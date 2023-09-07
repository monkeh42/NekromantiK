//consts and such

const GAME_DATA = {
    author: 'monkeh42',
    version: 'v1.1.2',
}

const NUM_UNITS = 8;

const NUM_TIMEDIMS = 8;

const NUM_ACHS = 25;

const NUM_GALAXY_ROWS = 4;

const TIERS = {
    1: 'zombie',
    2: 'abomination',
    3: 'skeletons mage',
    4: 'banshee',
    5: 'lich',
    6: 'behemoth',
    7: 'ancient one',
    8: 'sun eater',
}

var mainLoop;

var popupShownTime;

var mPopupShownTime;

var sPopupShownTime;

var asPopupShownTime;

var hidden, visibilityChange, isHidden;

var player = {};

var dataKeys = {};

var DATA = {};

var modules;

//var timedPopups = [];

var activePopups = [];

const HOTKEY_KEYS = { 'm': 1, 'a': 2, 'p': 3, 's': 4, 't': 5, 'n': 6, 'g': 7, 'q': 8, 'w': 9, 'e': 10, 'r': 11, 'f': 12 };

//initialize

function init() {
    loadGame();

    startGame();
}

//load stuff

function loadGame() {
    setupData();
    player = {};
    var savePlayer = localStorage.getItem('nekrosave');
    if (savePlayer === null || savePlayer === undefined) {
        copyData(player, START_PLAYER);
    } else {
        copyData(player, JSON.parse(window.atob(savePlayer)));
        if (Object.keys(player).length == 0) { copyData(player, START_PLAYER); }
    }
    fixData(player, START_PLAYER); 
    if (player.version != GAME_DATA.version) { updateVersion(); }

    if (player.nextSpaceReset[0] == null) {
        var num = 2*(Math.round(player.spaceResets)-3)
        switch (Math.round(player.spaceResets)) {
            case 0:
                player.nextSpaceReset = new Array(1, 5);
                break;
            case 1:
                player.nextSpaceReset = new Array(1, 6);
                break;
            case 2:
                player.nextSpaceReset = new Array(1, 7);
                break;
            case 3:
                player.nextSpaceReset = new Array(1, 8);
                break;
            default:
                player.nextSpaceReset = new Array(1+num, 8);
    
        }
    }

    if (player.activeGalaxies[1].slice(0,3)=='gal') {
        player.activeGalaxies[1] = '1';
        player.activeGalaxies[2] = '2';
    }

    player.help = false;
    if (player.win&&!player.continue) { player.continue = true; }

    if (screen.width < 1280 && screen.width > 600 && player.activeGalaxies[0] == '4') {
        player.activeGalaxies = ['2', '1', '2'];
    } else if (screen.width <= 600 && player.activeGalaxies[0] != '1') {
        player.activeGalaxies = ['1', '1', '2'];
    }

    if (player.tooltipsEnabled) {
        player.tooltipsEnabled = false;
        toggleTooltips();
    }

    loadVue();
    app.galSelected = player.activeGalaxies[0];
    app.dontRespec = player.dontResetSlider;
    updateShadow();
}

function addData(id, name, data) {
    DATA[id] = {};
    copyData(DATA[id], data);
    dataKeys[id] = name;
}

function setupData() {
    addData('hk', 'hotkeys', HOTKEYS);
    addData('sk', 'stat keys', STAT_KEYS);
    addData('header', 'header displays', HEADER_DATA);
    addData('tabs', 'tabs and subtabs', TABS_DATA);
    addData('o', 'options', OPTIONS_DATA);
    addData('sp', 'start player', START_PLAYER);
    addData('ul', 'unlocks', UNLOCKS_DATA);
    addData('ach', 'achievements', ACH_DATA);
    addData('ms', 'milestones', MILES_DATA);
    addData('ab', 'autobuyers', AUTOBUYERS_DATA);
    addData('u', 'units', UNITS_DATA);
    addData('b', 'buildings', BUILDS_DATA[0]);
    for (let i=1; i<=4; i++) { addData('b'+i.toString(), BUILDS_DATA[i].id, BUILDS_DATA[i]); }
    addData('c', 'construction', CONSTR_DATA);
    addData('t', 'time', TIME_DATA);
    addData('tu', 'time upgrades', TIME_UPGRADES);
    addData('td', 'time dimensions', TIME_DIMENSIONS);
    addData('g', 'galaxies', GALAXIES_DATA[0]);
    for (let j=1; j<=4; j++) { addData('g'+j.toString(), GALAXIES_DATA[j].name, GALAXIES_DATA[j]); }
    addData('a', 'ark', ARK_DATA);
    addData('r', 'research', RESEARCH_DATA);
    addData('e', 'ethereal', ETH_DATA);
}

//save stuff

function manualLoad() {
    window.location.reload(true);
}

function manualSave() {
    save();
    showPopup('savePopup', 'Game Saved!', 2000);
}

function save() {
    localStorage.setItem('nekrosave', window.btoa(JSON.stringify(player)));
}

//main loop and related

function startGame() {
    var diff = new Date() - player.lastUpdate;
    if ((diff)>(300*1000)) {
        calculateOfflineTime(new Decimal(diff/1000));
    }
    else {
        document.getElementById('offlineCalcPopup').style.display = 'none';
        document.getElementById('game').style.display = 'block';
    }

    if (player.pastRuns.lastRun.timeSpent == 0) { player.pastRuns.lastRun.timeSacrificed = new Date(); }
    if (player.pastAscRuns.lastRun.timeSpent == 0) { player.pastAscRuns.lastRun.timeAscended = new Date(); }
    player.lastUpdate = new Date();
    player.lastAutoSave = new Date();
    player.lastAutobuy = new Date();
    player.lastWindowUpdate = new Date();
    save();

    startInterval();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function gameLoop(diff=new Decimal(0), offline=false) {
    let gain = new Decimal(0);
    if (!offline) { 
        var currentUpdate = new Date().getTime();
        diff = new Decimal(currentUpdate - player.lastUpdate); 
        if (app.devSpeed>0) { diff = diff.times(app.devSpeed); }
    }
    var timeBuff;
    if (player.astralFlag) { timeBuff = getAntiTimeBuff().div(getAstralNerf()) }
    else { timeBuff = getTrueTimeBuff(); }
    var realDiff = new Decimal(diff);
    var trueDiff = new Decimal(realDiff);
    diff = diff.times(timeBuff);
    if (hasGUpgrade(1, 32) || hasGUpgrade(4, 22)) { realDiff = diff.times(timeBuff.sqrt()); } 
    
    if (player.astralFlag) {
        gain = getBricksPerSecond().times(diff.div(1000));
        player.bricks = player.bricks.plus(gain);
        player.stats['thisSacStats'].totalBricks = player.stats['thisSacStats'].totalBricks.plus(gain);
        player.stats['thisAscStats'].totalBricks = player.stats['thisAscStats'].totalBricks.plus(gain);
        player.stats['allTimeStats'].totalBricks = player.stats['allTimeStats'].totalBricks.plus(gain);
        
        if (hasGUpgrade(1, 22)) {
            gain = getGUpgEffect(1, 22).times(diff.div(1000));
            player.corpses = player.corpses.plus(gain);
            player.stats['thisSacStats'].totalCorpses = player.stats['thisSacStats'].totalCorpses.plus(gain);
            player.stats['thisAscStats'].totalCorpses = player.stats['thisAscStats'].totalCorpses.plus(gain);
            player.stats['allTimeStats'].totalCorpses = player.stats['allTimeStats'].totalCorpses.plus(gain);
            
        }
        if (player.isInResearch) { player.research = player.research.plus(getResearchPerSecond().times(diff.div(1000))); }
        
    } else {
        gain = getCorpsesPerSecond().times(diff.div(1000));
        player.corpses = player.corpses.plus(gain);
        player.stats['thisSacStats'].totalCorpses = player.stats['thisSacStats'].totalCorpses.plus(gain);
        player.stats['thisAscStats'].totalCorpses = player.stats['thisAscStats'].totalCorpses.plus(gain);
        player.stats['allTimeStats'].totalCorpses = player.stats['allTimeStats'].totalCorpses.plus(gain);
        
        if (hasGUpgrade(4, 32)) {
            gain = getGUpgEffect(4, 32).times(diff.div(1000));
            player.bricks = player.bricks.plus(gain);
            player.stats['thisSacStats'].totalBricks = player.stats['thisSacStats'].totalBricks.plus(gain);
            player.stats['thisAscStats'].totalBricks = player.stats['thisAscStats'].totalBricks.plus(gain);
            player.stats['allTimeStats'].totalBricks = player.stats['allTimeStats'].totalBricks.plus(gain);
            
        }
    }
    
    if (player.corpses.gt(player.stats['thisSacStats'].bestCorpses)) { player.stats['thisSacStats'].bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.stats['thisSacStats'].bestBricks)) { player.stats['thisSacStats'].bestBricks = new Decimal(player.bricks); }
    if (player.corpses.gt(player.stats['thisAscStats'].bestCorpses)) { player.stats['thisAscStats'].bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.stats['thisAscStats'].bestBricks)) { player.stats['thisAscStats'].bestBricks = new Decimal(player.bricks); }
    if (player.corpses.gt(player.stats['allTimeStats'].bestCorpses)) { player.stats['allTimeStats'].bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.stats['allTimeStats'].bestBricks)) { player.stats['allTimeStats'].bestBricks = new Decimal(player.bricks); }
    
    for (var i=1; i<NUM_UNITS; i++) {
        player.units[i].amount = player.units[i].amount.plus(getUnitProdPerSecond(i).times(diff.div(1000)));
    }
    if (hasGUpgrade(2, 41)) { player.units[8].amount = player.units[8].amount.plus(getUnitProdPerSecond(i).times(realDiff.div(1000))); }
    
    if (player.timeLocked) {
        for (var i=1; i<=NUM_TIMEDIMS; i++) {
            if (i==1) {
                player.trueEssence = player.trueEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.truePercent/100));
                player.antiEssence = player.antiEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.antiPercent/100));
            } 
            else if (i<=4 || hasUpgrade(4, 23)) { player.timeDims[i-1].amount = player.timeDims[i-1].amount.plus(getTimeDimProdPerSecond(i).times(realDiff.div(1000))); }
        }
    }
    
    for (let b=1; b<=4; b++) {
        if (isBuilt(b)) {
            if (b==3) {
                player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(hasGUpgrade(1, 31) ? diff.times(getAstralNerf()).div(1000) : diff.div(1000)));
            } else if (b==4) {
                player.buildings[b].progress = player.buildings[b].progress.plus(getBuildingProdPerSec(b).times(diff.div(1000)));
                if (player.buildings[b].progress.gte(100)) {
                    player.buildings[b].progress = new Decimal(0);
                    player.buildings[b].amount = player.buildings[b].amount.plus(1);
                }
            }
            else { player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(diff.div(1000))); }
        }
    }
    
    if (!offline) {
        updateUnlocks();
        
        updateAchievements();
        
        updateMilestones();

        checkResearchProg();
    

        if (player.unlocks['autobuyers']) {
            var slowAutoBuy = (currentUpdate - player.lastAutobuy)>=(15000/app.devSpeed);
            autobuyerTick(slowAutoBuy);
            if (slowAutoBuy) { player.lastAutobuy = new Date(); }
        }
    
        if ((currentUpdate-player.lastAutoSave)>10000) { 
            player.lastAutoSave = currentUpdate;
            save();
            if (player.headerDisplay['autosavePopup']) {
                if (!player.win || player.continue) { showPopup('autosavePopup', 'Game Autosaved!', 2000); }
            }
        }
        player.lastUpdate = currentUpdate;
    
        player.dontResetSlider = app.dontRespec;
        player.truePercent = 100 - Number(app.sliderVal);
        player.antiPercent = Number(app.sliderVal);
    
        popupTimers(trueDiff);
    }
    
}

function autobuyerTick(slow) {
    var tier;
    for (var i=0; i<player.autobuyers.priority.length; i++) {
        tier = parseInt(player.autobuyers.priority[i]);
        if (player.autobuyers[tier]['on'] && (player.autobuyers[tier]['fast'] || slow)) {
            if (player.autobuyers[tier]['bulk']) {
                buyMaxUnits(tier);
            } else {
                buySingleUnit(tier);
            }
        }
    }
    if (player.autobuyers[9]['on'] && (player.autobuyers[9]['fast'] || slow)) { if (isAutoSacTriggered()) { timePrestigeNoConfirm(); } }
    if (player.autobuyers[10]['on'] && (player.autobuyers[10]['fast'] || slow)) { if (canSpacePrestige() && (player.spaceResets.lt(player.autobuyers[10]['max']) || player.autobuyers[10]['max'] == 0)) { spacePrestigeNoConfirm(); } }
    if (player.autobuyers[11]['on'] && (player.autobuyers[11]['fast'] || slow)) { if (canGalaxyPrestige() && calculateGalaxyGain().gte(player.autobuyers[11]['amount'])) { galaxyPrestigeNoConfirm(); } }
    for (let i=NUM_TIMEDIMS; i>0; i--) {
        if (i<=4 || hasUpgrade(4, 23)) {
            if (player.autobuyers[12][i]) { buyMaxTime(i); }
        }
    }
    if (player.autobuyers['time']['on']) {
        for (let x=1; x<=3; x++) {
            for (let y=1; y<=4; y++) {
                if (canAffordTUpg(x*10+y)) { buyTUpg(x.toString() + y.toString()); }
            }
        }
    }
}

function popupTimers(dif) {
    for (popup in app.$refs['popupscontainer'].timedPopups) {
        app.$refs['popupscontainer'].timedPopups[popup]['time'] -= dif;
        if (app.$refs['popupscontainer'].timedPopups[popup]['time'] <= 0) {
            app.$refs['popupscontainer'].timedPopups.splice(popup, 1);
        }
    }
}

function calculateOfflineTime(seconds) {
    if (seconds>21600) { seconds = 21600; }
    var ticks = seconds * 20;
    var extra = new Decimal(0);
    var simMilliseconds = 0;
    if (ticks>1000) {
        extra = new Decimal((ticks-1000)/20);
        ticks = 1000;
    }

    var startCorpses = new Decimal(player.corpses);
    var startBricks = new Decimal(player.bricks);
    var startArms = new Decimal(player.buildings[1].amount);
    var startAcolytes = new Decimal(player.buildings[2].amount);
    var startPhotons = new Decimal(player.buildings[3].amount);
    var startTrue = new Decimal(player.trueEssence);
    var startAnti = new Decimal(player.antiEssence);
    var startGalaxies = new Decimal(player.galaxies);
    var startResearch = new Decimal(player.research);

    for (var done=0; done<ticks; done++) {
        gameLoop(extra.plus(50), true);
        simMilliseconds += extra.plus(50);
        
        if (simMilliseconds>=15000) {
            simMilliseconds = 0;
            autobuyerTick(true);
        } else { autobuyerTick(false); }
    }
    player.lastUpdate = new Date();
    player.lastAutoSave = new Date();
    player.lastAutobuy = new Date();
    save();

    var allZero = true;
    if (player.corpses.gt(startCorpses)) {
        document.getElementById('offlineCorpseGain').innerHTML = formatDefault(player.corpses.minus(startCorpses));
        document.getElementById('offlineCorpse').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineCorpse').style.display = 'none';
    }
    if (player.bricks.gt(startBricks)) {
        document.getElementById('offlineBrickGain').innerHTML = formatDefault(player.bricks.minus(startBricks));
        document.getElementById('offlineBrick').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineBrick').style.display = 'none';
    }
    if (player.buildings[1].amount.gt(startArms)) {
        document.getElementById('offlineArmamentGain').innerHTML = formatDefault(player.buildings[1].amount.minus(startArms));
        document.getElementById('offlineArmament').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineArmament').style.display = 'none';
    }
    if (player.buildings[2].amount.gt(startAcolytes)) {
        document.getElementById('offlineAcolyteGain').innerHTML = formatDefault(player.buildings[2].amount.minus(startAcolytes));
        document.getElementById('offlineAcolyte').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineAcolyte').style.display = 'none';
    }
    if (player.buildings[3].amount.gt(startPhotons)) {
        document.getElementById('offlinePhotonGain').innerHTML = formatDefault(player.buildings[3].amount.minus(startPhotons));
        document.getElementById('offlinePhoton').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlinePhoton').style.display = 'none';
    }
    if (player.trueEssence.gt(startTrue) || player.antiEssence.gt(startAnti)) {
        document.getElementById('offlineTrueGain').innerHTML = formatDefault(player.trueEssence.minus(startTrue).gte(1) ? player.trueEssence.minus(startTrue) : '0');
        document.getElementById('offlineAntiGain').innerHTML = formatDefault(player.antiEssence.minus(startAnti).gte(1) ? player.antiEssence.minus(startAnti) : '0');
        document.getElementById('offlineEssence').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineEssence').style.display = 'none';
    }
    if (player.galaxies.gt(startGalaxies)) {
        document.getElementById('offlineGalaxyGain').innerHTML = formatDefault(player.galaxies.minus(startGalaxies));
        document.getElementById('offlineGalaxy').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineGalaxy').style.display = 'none';
    }
    if (player.research.gt(startResearch)) {
        document.getElementById('offlineResearchGain').innerHTML = formatDefault(player.research.minus(startResearch));
        document.getElementById('offlineResearch').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineResearch').style.display = 'none';
    }

    if (allZero) {
        document.getElementById('offlineZero');
    }
    document.getElementById('offlineCalcPopup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('offlineGainPopup').style.display = 'block';
}

//import, export, etc

function hardResetClick() {
    confirmation('This will reset ALL of your progress and can\'t be undone.', 'hardReset')
}

function hardReset() {
    player = null;
    save();
    window.location.reload(true);
}

function importToggle() {
    app.exportTextArea = '';
    app.importing = true;
    app.exporting = false;
    setTimeout(function() { app.$refs['exptextarea'].focus() }, 10);
}

function importSave() {
    var imported = app.exportTextArea;
    if (imported !== undefined) {
        try {
            copyData(player, JSON.parse(window.atob(imported)));
            if (Object.keys(player).length == 0) { copyData(player, DATA.sp); }
        } catch(e) {
            return;
        }
    }
    
    fixData(player, DATA.sp); 
    if (player.version != GAME_DATA.version) { updateVersion(); }
    save();
    window.location.reload();
}

function exportSave() {
    app.importing = false;
    app.exporting = true;
    app.exportTextArea = window.btoa(JSON.stringify(player));
    setTimeout(function() { app.$refs['exptextarea'].select() }, 10);
}

function closeText() {
    app.importing = false;
    app.exporting = false;
    app.exportTextArea = '';
}

/*function exportGameState() {
    document.getElementById('exportText').value = window.btoa(JSON.stringify(player) + '\n\n') + window.btoa(JSON.stringify(DATA.sp) + '\n\n') + window.btoa(JSON.stringify(DATA.u) + '\n\n') + window.btoa(JSON.stringify(DATA.b) + '\n\n') + window.btoa(JSON.stringify(DATA.c) + '\n\n') + window.btoa(JSON.stringify(DATA.td) + '\n\n') + window.btoa(JSON.stringify(DATA.tu) + '\n\n') + window.btoa(JSON.stringify(DATA.ul) + '\n\n');
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
}*/

//fixes and data manipulation

function copyData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            data[item] = [];
            copyData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            data[item] = new Decimal(start[item]);
        } else if (start[item] instanceof Date) {
            data[item] = new Date(start[item]);
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            data[item] = {};
            copyData(data[item], start[item]);
        } else {
            data[item] = start[item];
        }
    }

}

function fixData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            if (data[item] === undefined) {
                data[item] = [];
            }
            fixData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            if (data[item] === undefined) {
                data[item] = new Decimal(start[item]);
            } else {
                data[item] = new Decimal(data[item]);
            }
        } else if (start[item] instanceof Date) {
            if (data[item] === undefined) {
                data[item] = new Date(start[item]);
            } else { data[item] = new Date(data[item]); }
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            if (data[item] === undefined) {
                data[item] = {};
            }
            fixData(data[item], start[item]);
        } else {
            if (data[item] === undefined) {
                data[item] = start[item];
            }
        }
    }
}

function updateVersion() {
    let tempPlayer = {};
    copyData(tempPlayer, player);
    player = {};
    fixResetBug();
    copyData(player, DATA.sp);
    updateVersionData(player, tempPlayer);
    player.version = GAME_DATA.version;
    if (tempPlayer.version != GAME_DATA.version && tempPlayer.version.slice(0,4)=='v1.0') {
        if (tempPlayer.unlocks['unitsTab']['mainTab']) { player.unlocks['units'] = true; }
        if (tempPlayer.unlocks['unitsTab']['spacePrestige']) { player.unlocks['spacePrestige'] = true; }
        if (tempPlayer.unlocks['unitsTab']['autobuyers']) { player.unlocks['autobuyers'] = true; }
        if (tempPlayer.unlocks['unitsTab']['fastBuyers']) { player.unlocks['fastBuyers'] = true; }
        if (tempPlayer.unlocks['unitsTab']['BulkBuyers'] || tempPlayer.unlocks['unitsTab']['bulkBuyers']) { player.unlocks['bulkBuyers'] = true; }
        if (tempPlayer.unlocks['unitsTab']['prestigeBuyer']) { player.unlocks['prestigeBuyer'] = true; }
        if (tempPlayer.unlocks['unitsTab']['advancedBuyer']) { player.unlocks['advancedBuyer'] = true; }
        if (tempPlayer.unlocks['unitsTab']['ascensionBuyer']) { player.unlocks['ascensionBuyer'] = true; }
        if (tempPlayer.unlocks['unitsTab']['timeDimBuyer']) { player.unlocks['timeDimBuyer'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['factory']) { player.unlocks['factory'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['factoryRow2']) { player.unlocks['factoryRow2'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['necropolis']) { player.unlocks['necropolis'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['necropolisRow2']) { player.unlocks['necropolisRow2'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['sun']) { player.unlocks['sun'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['sunRow2']) { player.unlocks['sunRow2'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['constructionSubTab']) { player.unlocks['construction'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['constructionRow2']) { player.unlocks['constructionRow2'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['vortexTable']) { player.unlocks['vortexTable'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['vortex']) { player.unlocks['vortex'] = true; }
        if (tempPlayer.unlocks['buildingsTab']['vortexRow2']) { player.unlocks['vortexRow2'] = true; }
        if (tempPlayer.unlocks['timeTab']['mainTab']) { player.unlocks['time'] = true; }
        if (tempPlayer.unlocks['timeTab']['timeUpgrades']) { player.unlocks['timeUpgrades'] = true; }
        if (tempPlayer.unlocks['timeTab']['timeUpgrades2']) { player.unlocks['timeUpgrades2'] = true; }
        if (tempPlayer.unlocks['timeTab']['timeDims2']) { player.unlocks['timeDims2'] = true; }
        if (tempPlayer.unlocks['galaxyTab']['mainTab']) { player.unlocks['galaxies'] = true; }
        if (tempPlayer.unlocks['galaxyTab']['researchTab']) { player.unlocks['research'] = true; }
        if (tempPlayer.unlocks['galaxyTab']['arkTab']) { player.unlocks['ark'] = true; }
        if (isResearchCompleted(6)) { player.unlocks['infResearch'] = true; }

        for (let k in tempPlayer.allTimeStats) {
            if (k!='displayStats' && k!='label' && k!='wentAstral' && k!='hasGoneAstral') {
                player.stats['allTimeStats'][k] = new Decimal(tempPlayer.allTimeStats[k]);
            }
        }
        for (let m in tempPlayer.thisSacStats) {
            if (m!='displayStats' && m!='label' && m!='wentAstral' && m!='hasGoneAstral') {
                player.stats['thisSacStats'][m] = new Decimal(tempPlayer.thisSacStats[m]);
            }
        }
        for (let n in tempPlayer.thisAscStats) {
            if (n!='displayStats' && n!='label' && n!='wentAstral' && n!='hasGoneAstral') {
                player.stats['thisAscStats'][n] = new Decimal(tempPlayer.thisAscStats[n]);
            }
        }

        for (let key in player.unlocks) {
            if (player.unlocks[key]) {
                DATA.ul.main[key].onUnlock();
            }
        }
        copyData(player.tabNotify, DATA.sp.tabNotify);
    }
    tempPlayer = {};
}

function updateVersionData(newP, oldP) {
    for (item in newP) {
        if (newP[item] == null) {
            if (oldP[item] !== undefined) {
                if (oldP[item] != null) {
                    newP[item] = oldP[item];
                } 
            }
        } else if (Array.isArray(newP[item])) {
            if (newP[item] === undefined) {
                newP[item] = [];
            }
            if (oldP !== undefined) { updateVersionData(newP[item], oldP[item]); }
        } else if (newP[item] instanceof Decimal) {
            if (oldP[item] !== undefined) {
                newP[item] = new Decimal(oldP[item]);
            }
        } else if ((!!newP[item]) && (typeof newP[item] === "object")) {
            if (oldP[item] !== undefined) {
                updateVersionData(newP[item], oldP[item]);
            }
        } else if (newP[item] instanceof Date) {
            if (oldP[item] !== undefined && oldP[item] instanceof Date) {
                newP[item] = new Date(oldP[item]);
            }
        } else {
            if (oldP !== undefined) {
                if (oldP[item] !== undefined && item != 'version') {
                    if (typeof newP[item] === typeof oldP[item]) { newP[item] = oldP[item]; }
                }
            }
        }
    }
}

//misc

function getRealTimeMultiplier() {
    let mult = new Decimal(1);
    if (player.astralFlag) {
        mult = mult.div(getAstralNerf());
        mult = mult.times(getAntiTimeBuff());
    } else {
        mult = mult.times(getTrueTimeBuff());
    }
    return mult;
}

function getRealTimeDimMultiplier() {
    let mult = new Decimal(1);
    if (player.astralFlag && hasGUpgrade(1, 32)) {
        mult = mult.times(getAntiTimeBuff().sqrt());
    } else if (!player.astralFlag && hasGUpgrade(4, 22)) {
        mult = mult.times(getTrueTimeBuff().sqrt());
    }
    return mult;
}

//achievement stuff

function getAchievementBoost() {
    let b = Decimal.pow(1.1, getNumAchievements());
    b = b.times(Decimal.pow(1.2, getNumAchRows()));
    return Decimal.max(b, 1);
}

function hasAchievement(id) {
    return player.achievements[id];
}

function getAchievementEffect(id) {
    return DATA.ach[id].effect();
}

function getNumAchievements() {
    let count = 0;
    for (let id in DATA.ach) {
        if (player.achievements[id]) { count++ }
    }
    return count;
}

function getNumAchRows() {
    let count = 0;
    let yes = true;
    for (let i=1; i<=Math.floor(NUM_ACHS/5); i++) {
        for (let j=1; j<=5; j++) {
            if (!player.achievements[i.toString() + j.toString()]) { yes = false; }
        }
        if (yes) { count++ }
        yes = true;
    }
    return count;
}

//milestone stuff

function hasMilestone(id) {
    return player.milestones[id];
}

function getMilestoneEffect(id) {
    return DATA.ms[id].effect();
}

function getNumMilestones() {
    let count = 0;
    for (let id in DATA.ms) {
        if (player.milestones[id]) { count++ }
    }
    return count;
}

//hotkeys/autobuyers

document.onkeydown = function(e) {
    if (!player.hotkeysOn) {return}
    var key = e.key;
    var ctrlDown = e.ctrlKey;
    var shiftDown = e.shiftKey;
    var metaDown = e.metaKey;
    if (DATA.hk[HOTKEY_KEYS[key]] !== undefined && !ctrlDown && !metaDown && !(document.activeElement.id == 'ascensionBuyerAmount' || document.activeElement.id == 'maxPrestige' || document.activeElement.id == 'sacrificeBuyerAmount')) {
        if (isNaN(key)) { DATA.hk[HOTKEY_KEYS[key]].onPress(shiftDown); }
        else { DATA.hk.units[key].onPress(shiftDown); }
    }
}

function toggleHotkeys() {
    player.hotkeysOn = !player.hotkeysOn;
}

function allAuto(n) {
    if (n<0) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = false;
        }
        if (app.allBuyersRadio=='all') {
            player.autobuyers[9]['on'] = false;
            if (player.unlocks['prestigeBuyer']) { player.autobuyers[10]['on'] = false; }
            if (player.unlocks['ascensionBuyer']) { player.autobuyers[11]['on'] = false; }
            if (player.unlocks['timeDimBuyer']) {
                for (j=1; j<=8; j++) {
                    if (j<5 || player.unlocks['timeDims2']) { player.autobuyers[12][j] = false; }
                }
            }
        }
    } else if (n>0) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = true;
        }
        if (app.allBuyersRadio=='all') {
            player.autobuyers[9]['on'] = true;
            if (player.unlocks['prestigeBuyer']) { player.autobuyers[10]['on'] = true; }
            if (player.unlocks['ascensionBuyer']) { player.autobuyers[11]['on'] = true; }
            if (player.unlocks['timeDimBuyer']) {
                for (j=1; j<=8; j++) {
                    if (j<5 || player.unlocks['timeDims2']) { player.autobuyers[12][j] = true; }
                }
            }
        }
    } else {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = !player.autobuyers[i]['on'];
        }
        if (app.allBuyersRadio=='all') {
            player.autobuyers[9]['on'] = !player.autobuyers[9]['on'];
            if (player.unlocks['prestigeBuyer']) { player.autobuyers[10]['on'] = !player.autobuyers[10]['on']; }
            if (player.unlocks['ascensionBuyer']) { player.autobuyers[11]['on'] = !player.autobuyers[11]['on']; }
            if (player.unlocks['timeDimBuyer']) {
                for (j=1; j<=8; j++) {
                    if (j<5 || player.unlocks['timeDims2']) { player.autobuyers[12][j] = !player.autobuyers[12][j]; }
                }
            }
        }
    }
}

function allSpeed() {
    if (player.unlocks['fastBuyers']) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['fast'] = !player.autobuyers[i]['fast'];
        }
        if (app.allBuyersRadio=='all') {
            player.autobuyers[9]['fast'] = !player.autobuyers[9]['fast'];
            if (player.unlocks['prestigeBuyer']) { player.autobuyers[10]['fast'] = !player.autobuyers[10]['fast']; }
            if (player.unlocks['ascensionBuyer']) { player.autobuyers[11]['fast'] = !player.autobuyers[11]['fast']; }
        }
    }
}

function allAmount() {
    if (player.unlocks['bulkBuyers']) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['bulk'] = !player.autobuyers[i]['bulk'];
        }
        if (app.allBuyersRadio=='all') {
            player.autobuyers[9]['bulk'] = !player.autobuyers[9]['bulk'];
            if (player.unlocks['prestigeBuyer']) { player.autobuyers[10]['bulk'] = !player.autobuyers[10]['bulk']; }
            if (player.unlocks['ascensionBuyer']) { player.autobuyers[11]['bulk'] = !player.autobuyers[11]['bulk']; }
        }
    }
}

//dev stuff

function changeDevSpeed(num) {
    app.devSpeed = num;
}

function resetDevSpeed() {
    app.devSpeed = 1;
}