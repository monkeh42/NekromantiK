const GAME_DATA = {
    version: 'v0.1.1',
}

const NUM_UNITS = 8;
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

const DEV_SPEED = 1;

const START_PLAYER = {
    corpses: new Decimal(10),
    units: {
        1: {
            unlocked: true,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        2: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        3: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        4: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        5: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        6: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        7: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
        8: {
            unlocked: false,
            amount: new Decimal(0),
            bought: new Decimal(0)
        },
    },
    
    // this is [number of units, tier]
    nextSpaceReset: [1, 5],
    spaceResets: new Decimal(0),
    worlds: new Decimal(0),

    buildings: {
        1: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                1: false,
                2: false,
                3: false,
            }
        },
        2: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                1: false,
                2: false,
                3: false,
            }
        },
        3: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                1: false,
                2: false,
                3: false,
            }
        },
    },

    construction: {
        1: new Decimal(0),
        2: new Decimal(0),
        3: new Decimal(0),
        4: new Decimal(0),
    },

    bricks: new Decimal(0),
    brickGainExp: 0.2,
    
    totalCorpses: new Decimal(0),
    totalWorlds: new Decimal(0),
    totalSpaceResets: new Decimal(0),
    
    lastUpdate: new Date(),
    lastAutoSave: new Date(),

    unlocks: {
        'unitsTab': {
            'mainTab': true, 
            'spacePrestige': false,  
        },
        'buildingsTab': {
            'mainTab': false,
            'factory': false,
            'necropolis': false,
            'sun': false,
            'construction': false,
        },
    }
};

var player = {};

function init() {
    loadGame();

    showTab('unitsTab');
    showSubTab('buildingsSubTab');

    startInterval();
}

function showHelp() {
    if (document.getElementById('helpDiv').style.display == 'block') { document.getElementById('helpDiv').style.display = 'none'; }
    else {
        var active = getActiveTab();
        
    if (HELP_TEXTS[active] === undefined) {return;}
        document.getElementById('helpText').innerHTML = generateHelpText(active);
        document.getElementById('helpDiv').style.display = 'block';
    }
}

function closeHelp() {
    document.getElementById('helpDiv').style.display = 'none';
}

function isNumber(str) {
    //var reg = new RegExp('/^(\d+\.?\d*)e?\\+?(\d+\.?\d*)?$/');
    return /^(\d+\.?\d*)e?\+?(\d+\.?\d*)?$/.test(str);
}

function showTab(tabName) {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showSubTab(subTabName) {
    var allSubTabs = document.getElementsByClassName('subTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function getActiveTab() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            return tab.id;
        }
    }
    return null;
}

function hardReset() {
    if (!confirm("Are you sure? This will reset ALL of your progress.")) return
    player = null;
    save();
    window.location.reload(true);
}

function getCorpsesPerSecond() {
    return player.units[1].amount.gt(0) ? player.units[1].amount.times(getTotalCorpseMult()) : new Decimal(0);
}

function getBricksPerSecond() {
    var b = getCorpsesPerSecond().pow(player.brickGainExp);
    if (isBuilt(2)) { b = b.times(getResourceEff(2)) }
    return b;
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        mult = mult.plus(UNITS_DATA[i].corpseMult());
    }
    return Decimal.max(mult, 1);
}

function getTotalCorpseMult() {
    var mult = getCorpseMultFromUnits();
    mult = mult.times(getWorldsBonus());
    return Decimal.max(mult, 1);
}

//returns the correct pluralization for corpse gain.
//if gain is passed false, it does the same for corpse amount.
function corpseSingulizer(gain=true) {
    if (gain) {
        if (getCorpsesPerSecond().eq(1)) { return "corpse"; }
        else { return "corpses"; }
    } else {
        if (player.corpses.eq(1)) { return "corpse"; }
        else { return "corpses"; }
    }
}

function worldSingulizer() {
    if (player.worlds.eq(1)) { return "world"; }
    else { return "worlds"; }
}

function updateCorpseDisplay() {
    document.getElementById('corpseAmount').innerHTML = ` ${formatDefault(player.corpses)} `;
    document.getElementById('pluralCorpse').innerHTML = corpseSingulizer(false);
    document.getElementById('pluralCorpseG').innerHTML = corpseSingulizer(true);
    document.getElementById('corpseGain').innerHTML = ` ${(astralFlag ? formatWhole(0) : formatDefault(getCorpsesPerSecond()))} `;
    document.getElementById('totalMult').innerHTML = `${formatDefault2(getCorpseMultFromUnits())}x`;
    document.getElementById('worldsMult').innerHTML = `${formatDefault2(getWorldsBonus())}x`;
    document.getElementById('worldsNum').innerHTML = `${formatWhole(player.worlds)}`;
    document.getElementById('pluralWorld').innerHTML = worldSingulizer();
    document.getElementById('devSpeedDisplay').innerHTML = formatWhole(DEV_SPEED);
    if (DEV_SPEED!=1) { document.getElementById('devSpeedContainer').style.display = 'block'}
    else { document.getElementById('devSpeedContainer').style.display = 'none'}
}

function updateUnitDisplay(tier) {
    document.getElementById(UNITS_DATA[tier].amountID).innerHTML = "<div style=\"min-width: 40%; float: left;\">" + formatDefault(player.units[tier].amount) + "</div><div style=\"min-width: 35%; float: left;\">(" + formatWhole(player.units[tier].bought) + ")</div><div style=\"min-width: 25%; float: left;\">" + ((getUnitProdPerSecond(tier).gt(0) && !astralFlag) ? "(+" + formatDefault(Decimal.times((getUnitProdPerSecond(tier).div(player.units[tier].amount.max(1))), 100), 2) + "%/s)</div>" : "");
    document.getElementById(UNITS_DATA[tier].multID).innerHTML = "<div style=\"min-width: 45%; float: left;\">" + formatDefault2(UNITS_DATA[tier].corpseMult()) + "x</div><div style=\"min-width: 45%; float: left;\">(" + ((tier > 1) ? formatDefault2(UNITS_DATA[tier].prodMult()) : "~") + "x)</div>";
    document.getElementById(UNITS_DATA[tier].buttonID).innerHTML = "Cost: " + formatWhole(UNITS_DATA[tier].cost()) + " corpses";
    document.getElementById(UNITS_DATA[tier].maxID).innerHTML = canAffordUnit(tier) ? `Max: ${calculateMaxUnits(tier)} for &#162;${formatWhole(calculateMaxUnitsCost(tier))}` : "Max: 0";
}

function updateUnlocks() {
    for (var tab in UNLOCKS_DATA) {
        for (var key in UNLOCKS_DATA[tab]) {
            if (!player.unlocks[tab][key] && UNLOCKS_DATA[tab][key].condition()) { player.unlocks[tab][key] = true; }
            else if (!player.unlocks[tab][key] && key == 'mainTab') { break; }
        }
    }
    for (var i=1; i<NUM_UNITS; i++) {
        if (player.units[i].bought.gte(1) && canUnlock(i+1)) {
            player.units[i+1].unlocked = true;
        } 
    }
}

function updateHTML() {
    var element;
    var bUpgs;
    for (var tab in UNLOCKS_DATA) {
        for (var key in UNLOCKS_DATA[tab]) {
            if (player.unlocks[tab][key]) {
                for (var id in UNLOCKS_DATA[tab][key].idsToShow) {
                    element = document.getElementById(UNLOCKS_DATA[tab][key].idsToShow[id]);
                    if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                    else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                    else { element.style.display = 'block'; }
                }
                for (var idd in UNLOCKS_DATA[tab][key].idsToHide) {
                    document.getElementById(UNLOCKS_DATA[tab][key].idsToHide[idd]).style.display = 'none';
                }
            }
        }
    }
    for (var i=1; i<=NUM_UNITS; i++) {
        if (player.units[i].unlocked) {
            document.getElementById(UNITS_DATA[i].rowID).style.display = 'table-row';
            document.getElementById(UNITS_DATA[i].buttonID).className = canAffordUnit(i) ? 'unitBut' : 'unclickableUnit';
            document.getElementById(UNITS_DATA[i].maxID).className = canAffordUnit(i) ? "unitMax" : 'unclickableMax';
        }
    }
    for (var b in BUILDS_DATA) {
        if (canAffordBuilding(b)) { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonClass; }
        else { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonUnclick; }
        if (isBuilt(b)) {
            for (var u in BUILDS_DATA[b].upgrades) {
                if (hasUpgrade(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnBought }
                else if (canAffordBUpg(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnClass }
                else { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnUnclick }
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getUpgName(b, u) + "</span><br>" + getUpgDesc(b, u) + "<br>Cost: " + formatDefault(getUpgCost(b, u)) + " " + BUILDS_DATA[b].resource + (isDisplayEffect(b, u) ? ("<br>Currently: " + formatDefault2(getUpgEffect(b, u)) + "x") : "");
            }
        }
    }
    for (var c in CONSTR_DATA) {
        if (canAffordCUpg(c)) { document.getElementById(CONSTR_DATA[c].buttonID).className = 'constrUpg' }
        else { document.getElementById(CONSTR_DATA[c].buttonID).className = 'unclickableConstrUpg' }
        document.getElementById(CONSTR_DATA[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + getCUpgCost(c) + " astral bricks" + "<br>Current level: " + formatWhole(player.construction[c]) + (isDisplayEffectC(c) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(c)) + "x") : "");
    }
}

function updatePrestige() {
    document.getElementById('spacePrestige').className =  (canSpacePrestige() ? 'prestigeBut' : 'unclickablePrestige');
    if (player.spaceResets.lt(3)) {
        if (player.spaceResets.gt(1)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Time Warp (coming soon)';
        } else if (player.spaceResets.gt(0)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Construction Upgrades';
        } else {
            document.getElementById('spacePresUnlock').innerHTML = 'Buildings';
        }
    } else { document.getElementById('spacePresDesc').innerHTML = "<br><br><br>"; }
    document.getElementById('prestigeReq').innerHTML = "Requires <span style=\"font-size: 17pt; white-space: pre;\"> " + formatWhole(player.nextSpaceReset[0]) + " </span> " + singulizer(player.nextSpaceReset[1], player.nextSpaceReset[0]);
}

function updateBuildings() {
    document.getElementById('brickDisplay').innerHTML = formatDefault(player.bricks);
    document.getElementById('brickGainDisplay').innerHTML = ` ${(astralFlag ? formatDefault(getBricksPerSecond()) : formatWhole(0))} `;
    document.getElementById('factoryProd').innerHTML = formatDefault(getBuildingProdPerSec(1));
    document.getElementById('factoryAmt').innerHTML = formatDefault(player.buildings[1].amount);
    document.getElementById('necropolisProd').innerHTML = formatDefault(getBuildingProdPerSec(2));
    document.getElementById('necropolisAmt').innerHTML = formatDefault(player.buildings[2].amount);
    document.getElementById('acolyteEff').innerHTML = formatDefault2(BUILDS_DATA[2].resourceEff());
}

function allDisplay() {
    updateUnlocks();
    for (var i=1; i<=(NUM_UNITS); i++) {
        updateUnitDisplay(i);
    }
    updateCorpseDisplay();
    updatePrestige();
    updateBuildings();
    updateHTML()
}

function getWorldsBonus() {
    return Decimal.max(player.worlds.div(2).pow(1.5).plus(1), 1);
}

function importToggle() {
    document.getElementById('exportText').innerHTML = 'Paste your save here...';
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'block';
    document.getElementById('closeText').style.display = 'block';
}

function exportSave() {
    var str = window.btoa(JSON.stringify(player));

    document.getElementById('exportText').value = str;
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'block';
}

function importSave() {
    var imported = document.getElementById('exportText').value;
    if (imported !== undefined) {
        try {
            player = Object.assign({}, JSON.parse(window.atob(imported)));
            fixData(player, START_PLAYER);
            save();
            window.location.reload();
        } catch(e) {
            return;
        }
    }
}

function closeText() {
    document.getElementById('exportText').style.display = 'none';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'none';
}

function save() {
    localStorage.setItem('nekrosave', window.btoa(JSON.stringify(player)));
}

function loadGame() {
    player = {};
    var savePlayer = localStorage.getItem('nekrosave');
    if (savePlayer === null || savePlayer === undefined) {
        player = Object.assign({}, START_PLAYER);
    } else {
        player = Object.assign({}, JSON.parse(window.atob(savePlayer)));
        fixData(player, START_PLAYER);
    }
    player.lastUpdate = new Date().getTime();
    player.lastAutoSave = new Date().getTime();
    allDisplay();
}

function fixData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            if (data[item] === undefined) {
                data[item] = start[item];
            } else {
                fixData(data[item], start[item]);
            }
        } else if (start[item] instanceof Decimal) {
            if (data[item] === undefined) {
                data[item] = start[item];
            } else {
                data[item] = new Decimal(data[item]);
            }
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            if (data[item] === undefined) {
                data[item] = start[item];
            } else {
                fixData(data[item], start[item]);
            }
        } else {
            if (data[item] === undefined) {
                data[item] = start[item];
            }
        }
    }
}

function startInterval() {
    mainLoop = setInterval(function () {
        var currentUpdate = new Date().getTime();
        var diff = currentUpdate - player.lastUpdate;
        if (astralFlag) { diff = diff/10; }
        if (DEV_SPEED>0) { diff = diff*DEV_SPEED; }
        if (astralFlag) {
            player.bricks = player.bricks.plus(getBricksPerSecond().times(diff/1000));
        } else {
            player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff/1000));
        }
        player.totalCorpses = player.totalCorpses.plus(getCorpsesPerSecond().times(diff/1000));
        for (var i=1; i<NUM_UNITS; i++) {
            player.units[i].amount = player.units[i].amount.plus(getUnitProdPerSecond(i).times(diff/1000));
        }
        for (var b in BUILDS_DATA) {
            if (isBuilt(b)) {
                player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(diff/1000));
            }
        }
        allDisplay();
        if ((currentUpdate-player.lastAutoSave)>5000) { 
            player.lastAutoSave = currentUpdate;
            save();
        }
        player.lastUpdate = currentUpdate;
    }, 50);
}
