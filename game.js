//consts and such

const GAME_DATA = {
    author: 'monkeh42',
    version: 'v0.2.9',
}

const NUM_UNITS = 8;

const NUM_TIMEDIMS = 4;

const NUM_ACHS = 15;

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

var DEV_SPEED = 1;

var mainLoop;

var justReset = false;

var popupShownTime;

var hidden, visibilityChange, isHidden;

var player = {};

//initialize

function init() {
    loadGame();

    showTab(player.activeTabs[0]);
    showUnitSubTab(player.activeTabs[1]);
    showBuildingSubTab(player.activeTabs[2]);
    showTimeSubTab(player.activeTabs[3]);
    if (player.activeTabs[0] == 'statsTab' && player.activeTabs[4] == 'statSubTab') { statsSubTabClick(); }
    else { showStatsSubTab(player.activeTabs[4]); }

    startGame();
}

//load stuff

function loadGame() {
    player = {};
    var savePlayer = localStorage.getItem('nekrosave');
    if (savePlayer === null || savePlayer === undefined) {
        copyData(player, START_PLAYER);
    } else {
        copyData(player, JSON.parse(window.atob(savePlayer)));
    }
    fixData(player, START_PLAYER);

    if (player.allTimeStats === undefined) { fixStats(); }

    if (player.allTimeStats.bestCorpses.eq(0)) { player.allTimeStats.bestCorpses = new Decimal(player.corpses); }
    if (player.allTimeStats.bestBricks.eq(0)) { player.allTimeStats.bestBricks = new Decimal(player.bricks); }
    if (player.allTimeStats.bestWorlds.eq(0)) { player.allTimeStats.bestWorlds = new Decimal(player.worlds); }
    if (player.thisSacStats.bestCorpses.eq(0)) { player.thisSacStats.bestCorpses = new Decimal(player.corpses); }
    if (player.thisSacStats.bestBricks.eq(0)) { player.thisSacStats.bestBricks = new Decimal(player.bricks); }
    if (player.thisSacStats.bestWorlds.eq(0)) { player.thisSacStats.bestWorlds = new Decimal(player.worlds); }
    if (player.allTimeStats.bestCrystals.eq(0)) { player.allTimeStats.bestCrystals = new Decimal(player.crystals); }

    if (player.allTimeStats.totalCorpses.eq(0)) { player.allTimeStats.totalCorpses = new Decimal(player.corpses); }
    if (player.allTimeStats.totalBricks.eq(0)) { player.allTimeStats.totalBricks = new Decimal(player.bricks); }
    if (player.allTimeStats.totalWorlds.eq(0)) { player.allTimeStats.totalWorlds = new Decimal(player.worlds); }
    if (player.thisSacStats.totalCorpses.eq(0)) { player.thisSacStats.totalCorpses = new Decimal(player.corpses); }
    if (player.thisSacStats.totalBricks.eq(0)) { player.thisSacStats.totalBricks = new Decimal(player.bricks); }
    if (player.thisSacStats.totalWorlds.eq(0)) { player.thisSacStats.totalWorlds = new Decimal(player.worlds); }
    if (player.allTimeStats.totalCrystals.eq(0)) { player.allTimeStats.totalCrystals = new Decimal(player.crystals); }

    if (player.allTimeStats.totalTimeResets.gt(player.timeResets)) { player.allTimeStats.totalTimeResets = new Decimal(player.timeResets); }

    //updateFixes();
    player.displayData.splice(0, player.displayData.length);
    if (player.tooltipsEnabled) {
        player.tooltipsEnabled = false;
        toggleTooltips();
    }

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    var element = document.getElementById('hotkeysList');
    var count = 0;
    element.innerHTML = 'Number Keys 1-8: Buy Single Unit; shift+(1-8): Buy Max Units;<br>';
    for (var k in HOTKEYS) {
        if (count == 3) {
            count = 0;
            element.innerHTML += '<br>';
        }
        if (isNaN(k)) {
            element.innerHTML += k + ': ' + HOTKEYS[k].desc + '; ';
            count++;
        }
    }
    element.innerHTML = element.innerHTML.slice(0, -2);
    element.innerHTML += '<br>hotkeys do not trigger if ctrl is pressed.'
}

function loadStyles() {
    if (player.displayData.length>0) {
        updateDisplay();
    }

    document.getElementById('versionNumber').innerHTML = GAME_DATA.version;

    for (let tab in UNLOCKS_DATA) {
        for (let key in UNLOCKS_DATA[tab]) {
            if (player.unlocks[tab][key]) { unlockElementsOnLoad(tab, key) }
            else if (!player.unlocks[tab][key] && key == 'mainTab') { break; }
        }
    }

    for (let i=1; i<=NUM_UNITS; i++) {
        if (player.units[i].unlocked) { document.getElementById(UNITS_DATA[i].rowID).style.display = 'table-row'; }
        if (!canAffordUnit(i)) {
            document.getElementById(UNITS_DATA[i].buttonID).classList.add('unclickableUnit');
            document.getElementById(UNITS_DATA[i].buttonID).classList.remove('unitBut');
            document.getElementById(UNITS_DATA[i].maxID).classList.add('unclickableMax');
            document.getElementById(UNITS_DATA[i].maxID).classList.remove('unitMax');
        }
    }
    for (let i=1; i<=NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].unlocked) { document.getElementById(TIME_DATA[i].rowID).style.display = 'table-row'; }
        if (!canAffordTime(i)) {
            document.getElementById(TIME_DATA[i].buttonID).classList.add('unclickableUnitT');
            document.getElementById(TIME_DATA[i].buttonID).classList.remove('unitButT');
            document.getElementById(TIME_DATA[i].maxID).classList.add('unclickableMaxT');
            document.getElementById(TIME_DATA[i].maxID).classList.remove('unitMaxT');
        }
    }

    if (canTimePrestige()) {
        document.getElementById('timePrestigeReq').style.display = 'none';
        document.getElementById('timePrestigeGainDesc').style.display = 'block';
    } 

    for (var b in BUILDS_DATA) {
        for (var u in BUILDS_DATA[b].upgrades) {
            if (BUILDS_DATA[b].upgrades[u].displayTooltip) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).setAttribute('data-title', BUILDS_DATA[b].upgrades[u].displayFormula()) }
            if (hasUpgrade(b, u)) {
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.add(BUILDS_DATA[b].upgradeBtnBought);
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnClass);
            } else {
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnBought);
                if (!canAffordBUpg(b, u)) {
                    document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.add(BUILDS_DATA[b].upgradeBtnUnclick);
                    document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnClass);
                }
            }
        }
    }

    if (hasAchievement(25)) { document.getElementById('keptBricks').style.display = 'block'; }
    
    for (var t in TIME_DATA.upgrades) {
        if (TIME_DATA.upgrades[t].displayTooltip) { document.getElementById(TIME_DATA.upgrades[t].buttonID).setAttribute('data-title', TIME_DATA.upgrades[t].displayFormula) }
        if (player.timeUpgs[t]) {
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.add('boughtTimeUpg');
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.remove('timeUpg');
        } else if (!canAffordTUpg(t)) {
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.add('unclickableTimeUpg');
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.remove('timeUpg');
        }
    }
    for (var c in CONSTR_DATA) {
        if (!canAffordCUpg(c)) {
            document.getElementById(CONSTR_DATA[c].buttonID).classList.add('unclickableConstrUpg');
            document.getElementById(CONSTR_DATA[c].buttonID).classList.remove('constrUpg');
        }
    }    

    document.getElementById('timeSlider').value = player.antiPercent;
    if (player.timeLocked) {
        document.getElementById('lockInTimeBut').classList.add('unclickSliderBut');
        document.getElementById('lockInTimeBut').classList.remove('timeSliderBut');
        document.getElementById('timeSlider').classList.add('sliderLocked');
        document.getElementById('timeSlider').classList.remove('slider');
        document.getElementById('timeSlider').disabled = true;
    } else {
        document.getElementById('respecTimeBut').classList.add('unclickSliderBut');
        document.getElementById('respecTimeBut').classList.remove('timeSliderBut');
        document.getElementById('timeSlider').classList.remove('sliderLocked');
        document.getElementById('timeSlider').classList.add('slider');
        document.getElementById('timeSlider').removeAttribute('disabled');
    }
    updateSliderDisplay();

    updateAutobuyersDisplay();

    for (let id in ACH_DATA) {
        document.getElementById(ACH_DATA[id].divID).setAttribute('data-title', ACH_DATA[id].desc + (ACH_DATA[id].hasReward ? ' Reward: ' + ACH_DATA[id].reward : '' ) + (ACH_DATA[id].showEffect ? ' Currently: ' + formatDefault2(ACH_DATA[id].effect()) + 'x' : '' ));
        if (player.achievements[id].unlocked) {
            document.getElementById(ACH_DATA[id].divID).classList.add('achievementUnlocked');
            document.getElementById(ACH_DATA[id].divID).classList.remove('achievement');
            if (player.achievements[id].new) {
                document.getElementById(ACH_DATA[id].divID).classList.add('achievementNew');
                player.displayData.push(['addClass', 'achSubTabBut', 'tabButNotify']);
                player.displayData.push(['addClass', 'statsTabBut', 'tabButIndirectNotify']);
            }
        }
    }

    if (player.astralFlag) {
        toggleAstralDisplay();
    }
}

//save stuff

function save() {
    localStorage.setItem('nekrosave', window.btoa(JSON.stringify(player)));
}

//main loop and related

function startGame() {
    var diff = (new Date).getTime() - player.lastUpdate;
    if ((diff)>(1000*1000)) { calculateOfflineTime(new Decimal(diff/1000)); }
    else {
        player.lastUpdate = (new Date).getTime();
        player.lastAutoSave = (new Date).getTime();
        player.lastAutobuy = (new Date).getTime();
        player.lastWindowUpdate = (new Date).getTime();
        save();
    }

    if (player.pastRuns.lastRun.timeSacrificed == 0) { player.pastRuns.lastRun.timeSacrificed = (new Date).getTime(); }

    document.getElementById('calcPopupContainer').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    updateDisplay();
    loadStyles();

    startInterval();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function gameLoop(diff=new Decimal(0), offline=false) {
    var currentUpdate = new Date().getTime();
    if (diff.eq(0)) { var diff = new Decimal(currentUpdate - player.lastUpdate); }
    if (DEV_SPEED>0) { diff = diff.times(DEV_SPEED); }
    var timeBuff = player.astralFlag ? getAntiTimeBuff().div(10) : getTrueTimeBuff();
    diff = timeBuff.times(diff);
    var realDiff = diff.div(timeBuff);
    if (player.astralFlag) {
        player.bricks = player.bricks.plus(getBricksPerSecond().times(diff.div(1000)));
        player.thisSacStats.totalBricks = player.thisSacStats.totalBricks.plus(getBricksPerSecond().times(diff.div(1000)));
        player.allTimeStats.totalBricks = player.allTimeStats.totalBricks.plus(getBricksPerSecond().times(diff.div(1000)));
    } else {
        player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        player.thisSacStats.totalCorpses = player.thisSacStats.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        player.allTimeStats.totalCorpses = player.allTimeStats.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
    }
    if (player.corpses.gt(player.thisSacStats.bestCorpses)) { player.thisSacStats.bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.thisSacStats.bestBricks)) { player.thisSacStats.bestBricks = new Decimal(player.bricks); }
    if (player.corpses.gt(player.allTimeStats.bestCorpses)) { player.allTimeStats.bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.allTimeStats.bestBricks)) { player.allTimeStats.bestBricks = new Decimal(player.bricks); }
    for (var i=1; i<NUM_UNITS; i++) {
        player.units[i].amount = player.units[i].amount.plus(getUnitProdPerSecond(i).times(diff.div(1000)));
    }
    if (player.timeLocked) {
        for (var i=1; i<=NUM_TIMEDIMS; i++) {
            if (i==1) {
                player.trueEssence = player.trueEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.truePercent/100));
                player.antiEssence = player.antiEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.antiPercent/100));
            }
            else { player.timeDims[i-1].amount = player.timeDims[i-1].amount.plus(getTimeDimProdPerSecond(i).times(realDiff.div(1000))); }
        }
    }
    for (var b in BUILDS_DATA) {
        if (isBuilt(b)) {
            player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(diff.div(1000)));
        }
    }
    updateUnlocks();
    updateAchievements();

    if (!offline && player.unlocks['unitsTab']['autobuyers']) {
        var slowAutoBuy = (currentUpdate - player.lastAutobuy)>=(15000/DEV_SPEED);
        autobuyerTick(slowAutoBuy);
        if (slowAutoBuy) { player.lastAutobuy = (new Date).getTime(); }
    }
    if (!offline) {
        //allDisplay();
        if ((currentUpdate-player.lastAutoSave)>5000) { 
            player.lastAutoSave = currentUpdate;
            save();
        }
        player.lastUpdate = currentUpdate;
    }
    justReset = false;
    if (popupShownTime !== undefined && popupShownTime !== null) {
        if (currentUpdate-popupShownTime >= 2000) {
            player.displayData.push(['setProp', 'achUnlockPopup', 'opacity', '0']);
            popupShownTime = null;
        }
    }
    if (!isHidden) { window.requestAnimationFrame(updateDisplay); }
}

function handleVisibilityChange() {
    if (!document[hidden]) {
        player.displayData = new Array(0);
        isHidden = false;
    } else { isHidden = true; }
}

function autobuyerTick(slow) {
    var tier;
    for (var i=0; i<player.autobuyers.priority.length; i++) {
        tier = player.autobuyers.priority[i];
        if (player.autobuyers[tier].on && (player.autobuyers[tier].fast || slow)) {
            if (player.autobuyers[tier].bulk) {
                buyMaxUnits(tier);
            } else {
                buySingleUnit(tier);
            }
        }
    }
    if (player.autobuyers[10].priority) {
        if (player.autobuyers[10].on && (player.autobuyers[10].fast || slow)) { if (canSpacePrestige()) { spacePrestigeNoConfirm(); } }
        if (player.autobuyers[9].on && (player.autobuyers[9].fast || slow)) { if (isAutoSacTriggered()) { timePrestigeNoConfirm(); } }
    } else {
        if (player.autobuyers[9].on && (player.autobuyers[9].fast || slow)) { if (isAutoSacTriggered()) { timePrestigeNoConfirm(); } }
        if (player.autobuyers[10].on && (player.autobuyers[10].fast || slow)) { if (canSpacePrestige()) { spacePrestigeNoConfirm(); } }
    }
}

function calculateOfflineTime(seconds) {
    document.getElementById('offlineCalcPopup').style.display = 'block';
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

    for (var done=0; done<ticks; done++) {
        gameLoop(extra.plus(50), true);
        simMilliseconds += extra.plus(50);
        autobuyerTick(simMilliseconds>=15000);
        if (simMilliseconds>=15000) { simMilliseconds = 0; }
    }
    player.lastUpdate = (new Date).getTime();
    player.lastAutoSave = (new Date).getTime();
    player.lastAutobuy = (new Date).getTime();
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

    if (allZero) {
        document.getElementById('offlineZero');
    }
    document.getElementById('offlineCalcPopup').style.display = 'none';
    document.getElementById('offlineGainPopup').style.display = 'block';
}

//import, export, etc

function hardReset() {
    if (!confirm("Are you sure? This will reset ALL of your progress.")) return
    player = null;
    save();
    window.location.reload(true);
}

function importToggle() {
    document.getElementById('exportTextLabel').style.display = 'block';
    document.getElementById('exportText').value = '';
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'table-cell';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').removeAttribute('colspan');
    document.getElementById('exportText').focus();
}

function importSave() {
    var imported = document.getElementById('exportText').value;
    if (imported !== undefined) {
        try {
            copyData(player, JSON.parse(window.atob(imported)));
        } catch(e) {
            return;
        }
    }
    
    fixData(player, START_PLAYER);
    save();
    window.location.reload();
}

function exportSave() {
    var str = window.btoa(JSON.stringify(player));

    document.getElementById('exportText').value = str;
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
}

function closeText() {
    document.getElementById('exportTextLabel').style.display = 'none';
    document.getElementById('exportText').style.display = 'none';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'none';
    document.getElementById('closeText').removeAttribute('colspan');
}

function exportGameState() {
    document.getElementById('exportText').value = window.btoa(JSON.stringify(player) + '\n\n') + window.btoa(JSON.stringify(START_PLAYER) + '\n\n') + window.btoa(JSON.stringify(UNITS_DATA) + '\n\n') + window.btoa(JSON.stringify(BUILDS_DATA) + '\n\n') + window.btoa(JSON.stringify(CONSTR_DATA) + '\n\n') + window.btoa(JSON.stringify(TIME_DATA) + '\n\n') + window.btoa(JSON.stringify(UNLOCKS_DATA) + '\n\n');
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
}

//fixes and data manipulation

function fixStats() {
    player.allTimeStats = {};
    player.thisSacStats = {};
    copyData(player.allTimeStats, START_PLAYER.allTimeStats);
    copyData(player.thisSacStats, START_PLAYER.thisSacStats);

    player.allTimeStats.totalCorpses = player.totalCorpses !== undefined ? new Decimal(player.totalCorpses) : new Decimal(0);
    player.allTimeStats.totalWorlds = player.totalWorlds !== undefined ? new Decimal(player.totalWorlds) : new Decimal(0);
    player.allTimeStats.totalBricks = player.totalBricks !== undefined ? new Decimal(player.totalBricks) : new Decimal(0);
    player.allTimeStats.totalSpaceResets = player.totalSpaceResets !== undefined ? new Decimal(player.totalSpaceResets) : new Decimal(0);
    player.allTimeStats.totalTimeResets = player.totalTimeResets !== undefined ? new Decimal(player.totalTimeResets) : new Decimal(0);
    player.allTimeStats.totalCrystals = player.totalCrystals !== undefined ? new Decimal(player.totalCrystals) : new Decimal(0);

    player.allTimeStats.bestCrystalGain = player.bestCrystalGain !== undefined ? new Decimal(player.bestCrystalGain) : new Decimal(0);
    player.allTimeStats.bestCrystalRate = player.bestCrystalRate !== undefined ? new Decimal(player.bestCrystalRate) : new Decimal(0);
    player.allTimeStats.bestCorpses = player.bestCorpses !== undefined ? new Decimal(player.bestCorpses) : new Decimal(0);
    player.allTimeStats.bestWorlds = player.bestWorlds !== undefined ? new Decimal(player.bestWorlds) : new Decimal(0);
    player.allTimeStats.bestBricks = player.bestBricks !== undefined ? new Decimal(player.bestBricks) : new Decimal(0);
    player.allTimeStats.bestCrystals = player.bestCrystals !== undefined ? new Decimal(player.bestCrystals) : new Decimal(0);

    player.thisSacStats.totalCorpses = player.corpses;
    player.thisSacStats.totalWorlds = player.worlds;
    player.thisSacStats.totalBricks = player.bricks;
    player.thisSacStats.totalSpaceResets = player.spaceResets;

    player.thisSacStats.bestCorpses = player.corpses;
    player.thisSacStats.bestWorlds = player.worlds;
    player.thisSacStats.bestBricks = player.bricks;

    player.thisSacStats.hasGoneAstral = true;
}

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
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            data[item] = {};
            copyData(data[item], start[item]);
        } else {
            data[item] = start[item];
        }
    }

}

/*function updateFixes() {
    if player.activeTabs[4] == 
}*/

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
    for (var b in player.buildings) {
        if (player.buildings[b].upgrades[1] !== undefined) {
            delete player.buildings[b].upgrades[1];
            delete player.buildings[b].upgrades[2];
            delete player.buildings[b].upgrades[3];
        }
    }
}

//achievement stuff

function getAchievementBoost() {
    let b = Decimal.pow(1.1, getNumAchievements());
    b = b.times(Decimal.pow(1.2, getNumAchRows()));
    return Decimal.max(b, 1);
}

function hasAchievement(id) {
    return player.achievements[id].unlocked;
}

function getAchievementEffect(id) {
    return ACH_DATA[id].effect();
}

function getNumAchievements() {
    let count = 0;
    for (let id in ACH_DATA) {
        if (player.achievements[id].unlocked) { count++ }
    }
    return count;
}

function getNumAchRows() {
    let count = 0;
    let yes = true;
    for (let i=1; i<=Math.floor(NUM_ACHS/5); i++) {
        for (let j=1; j<=5; j++) {
            if (!player.achievements[i.toString() + j.toString()].unlocked) { yes = false; }
        }
        if (yes) { count++ }
        yes = true;
    }
    return count;
}

//hotkeys/autobuyers

document.onkeydown = function(e) {
    if (!player.hotkeysOn) {return}
    var key = e.key;
    var ctrlDown = e.ctrlKey;
    var shiftDown = e.shiftKey;
    if (HOTKEYS[key] !== undefined && !ctrlDown) { HOTKEYS[key].onPress(shiftDown); }
}

function toggleHotkeys() {
    player.hotkeysOn = !player.hotkeysOn;
    if (player.hotkeysOn) { document.getElementById('toggleHotkeysBut').innerHTML = 'ENABLE HOTKEYS: ON'; }
    else { document.getElementById('toggleHotkeysBut').innerHTML = 'ENABLE HOTKEYS: OFF'; }
}

function allAuto(n) {
    if (n<0) {
        for (let i=1; i<10; i++) {
            player.autobuyers[i].on = false;
        }
        if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10].on = false; }
    } else if (n>0) {
        for (let i=1; i<10; i++) {
            player.autobuyers[i].on = true;
        }
        if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10].on = true; }
    } else {
        for (let i=1; i<10; i++) {
            player.autobuyers[i].on = !player.autobuyers[i].on;
        }
        if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10].on = !player.autobuyers[10].on; }
    }
    updateAutobuyersDisplay();
}

//dev stuff

function changeDevSpeed(num) {
    DEV_SPEED = num;
    if (DEV_SPEED!=1) { document.getElementById('devSpeedContainer').style.display = 'block'}
}

function resetDevSpeed() {
    DEV_SPEED = 1;
    document.getElementById('devSpeedContainer').style.display = 'none';
}

function rewindTime() {
    clearInterval(mainLoop);
    player.lastUpdate = player.lastUpdate - (3600*1000);
    save();
    window.location.reload();
}