const NUM_UNITS = 8;
const TIERS = {
    1: 'zombie',
    2: 'abomination',
    3: 'skeletons mage',
    4: 'banshee',
    5: 'liche',
    6: 'behemoth',
    7: 'ancient one',
    8: 'sun eater',
}

const START_PLAYER = {
    corpses: new Decimal(10),

    // this is [number of units, tier]
    nextSpaceReset: [1, 5],
    spaceResets: new Decimal(0),
    worlds: new Decimal(0),

    bricks: new Decimal(0),
    brickGainExp: 0.2,

    
    totalCorpses: new Decimal(0),
    totalWorlds: new Decimal(0),
    totalSpaceResets: new Decimal(0),
    
    lastUpdate: new Date(),
    lastAutoSave: new Date(),
};

var player = {};
var units = {};
var unlocks = {};
var buildings = {};
var construction = {};

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
    units = null;
    unlocks = null;
    buildings = null;
    save();
    window.location.reload(true);
}

function getCorpsesPerSecond() {
    return units[1].amount.gt(0) ? units[1].amount.times(getTotalCorpseMult()) : new Decimal(0);
}

function getBricksPerSecond() {
    return getCorpsesPerSecond().pow(player.brickGainExp);
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        mult = mult.plus(units[i].corpseMult.times(units[i].corpseBoost()));
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
    document.getElementById('astralNotice').style.display = 'block';
    document.getElementById('totalMult').innerHTML = `${format(getCorpseMultFromUnits(), 2)}x`;
    document.getElementById('worldsMult').innerHTML = `${format(getWorldsBonus(), 2)}x`;
    document.getElementById('worldsNum').innerHTML = `${formatWhole(player.worlds)}`;
    document.getElementById('pluralWorld').innerHTML = worldSingulizer();
}

function updateUnitDisplay(tier) {
    document.getElementById(units[tier].amountID).innerHTML = "<div style=\"min-width: 40%; float: left;\">" + formatDefault(units[tier].amount) + "</div><div style=\"min-width: 35%; float: left;\">(" + formatWhole(units[tier].bought) + ")</div><div style=\"min-width: 25%; float: left;\">" + ((getUnitProdPerSecond(tier).gt(0) && !astralFlag) ? "(+" + formatWhole(new Decimal(getUnitProdPerSecond(tier).div(units[tier].amount.max(1))).m, 2) + "%/s)</div>" : "");
    document.getElementById(units[tier].multID).innerHTML = "<div style=\"min-width: 45%; float: left;\">" + format(units[tier].corpseMult.times(units[tier].corpseBoost()), 2) + "x</div><div style=\"min-width: 45%; float: left;\">(" + ((tier > 1) ? format(units[tier].prodMult.times(units[tier].prodBoost()), 2) : "~") + "x)</div>";
    document.getElementById(units[tier].buttonID).innerHTML = "Cost: " + formatWhole(units[tier].cost) + " corpses";
    document.getElementById(units[tier].maxID).innerHTML = canAfford(tier) ? `Max: ${calculateMaxUnits(tier)} for &#162;${formatWhole(calculateMaxUnitsCost(tier))}` : "Max: 0";
}

function updateUnlocks() {
    for (var tab in unlocks) {
        for (var key in unlocks[tab]) {
            if (!unlocks[tab][key].unlocked && unlocks[tab][key].condition()) { unlocks[tab][key].unlocked = true; }
            else if (!unlocks[tab][key].unlocked && key == 'mainTab') { break; }
        }
    }
    for (var i=1; i<NUM_UNITS; i++) {
        if (units[i].bought.gte(1) && canUnlock(i+1)) {
            units[i+1].unlocked = true;
        } 
    }
}

function updateHTML() {
    var element;
    var bUpgs;
    for (var tab in unlocks) {
        for (var key in unlocks[tab]) {
            if (unlocks[tab][key].unlocked) {
                for (var id in unlocks[tab][key].idsToShow) {
                    element = document.getElementById(unlocks[tab][key].idsToShow[id]);
                    if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                    else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                    else { element.style.display = 'block'; }
                }
                for (var j=0; j<unlocks[tab][key].idsToHide.length; j++) {
                    document.getElementById(unlocks[tab][key].idsToHide[j]).style.display = 'none';
                }
            }
        }
    }
    for (var i=1; i<=NUM_UNITS; i++) {
        if (units[i].unlocked) {
            document.getElementById(units[i].rowID).style.display = 'table-row';
            document.getElementById(units[i].buttonID).className = canAfford(i) ? 'unitBut' : 'unclickableUnit';
            document.getElementById(units[i].maxID).className = canAfford(i) ? "unitMax" : 'unclickableMax';
        }
    }
    for (var b in buildings) {
        if (isBuilt(b)) {
            for (var u in buildings[b].upgrades) {
                if (hasUpgrade(b, u)) { document.getElementById(buildings[b].upgrades[u].buttonID).className = buildings[b].upgradeBtnBought }
                else if (canAffordBUpg(b, u)) { document.getElementById(buildings[b].upgrades[u].buttonID).className = buildings[b].upgradeBtnClass }
                else { document.getElementById(buildings[b].upgrades[u].buttonID).className = buildings[b].upgradeBtnUnclick }
                document.getElementById(buildings[b].upgrades[u].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getUpgName(b, u) + "</span><br>" + getUpgDesc(b, u) + "<br>Cost: " + getUpgCost(b, u) + " " + buildings[b].resource + (isDisplayEffect(b, u) ? ("<br>Currently: " + format(getUpgEffect(b, u), 2) + "x") : "");
            }
        }
    }
    for (var c in construction) {
        if (canAffordCUpg(c)) { document.getElementById(construction[c].buttonID).className = 'constrUpg' }
        else { document.getElementById(construction[c].buttonID).className = 'unclickableConstrUpg' }
        document.getElementById(construction[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + getCUpgCost(c) + " astral bricks" + "<br>Current level: " + formatWhole(construction[c].level) + (isDisplayEffectC(c) ? ("<br>Currently: " + format(getCUpgEffect(c), 2) + "x") : "");
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
    document.getElementById('factoryAmt').innerHTML = formatDefault(buildings[1].amount);
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

function save() {
    localStorage.setItem('nekrosave', JSON.stringify(player));
    localStorage.setItem('unlocks', JSON.stringify(unlocks));
    localStorage.setItem('units', JSON.stringify(units));
    localStorage.setItem('buildings', JSON.stringify(buildings));
    localStorage.setItem('construction', JSON.stringify(construction));
}

function loadGame() {
    player = {};
    units = {};
    var savePlayer = JSON.parse(localStorage.getItem('nekrosave'));
    var saveUnlocks = JSON.parse(localStorage.getItem('unlocks'));
    var saveUnits = JSON.parse(localStorage.getItem('units'));
    var saveBuildings = JSON.parse(localStorage.getItem('buildings'));
    var saveConst = JSON.parse(localStorage.getItem('construction'));
    if (savePlayer === null || savePlayer === undefined) {
        player = Object.assign({}, START_PLAYER);
    } else {
        player = Object.assign({}, savePlayer);
        fixData(player, START_PLAYER);
    }
    if (saveUnlocks === null || saveUnlocks === undefined) {
        unlocks = Object.assign({}, START_UNLOCKS);
    } else {
        unlocks = Object.assign({}, saveUnlocks);
        fixData(unlocks, START_UNLOCKS);
    }
    if (saveUnits === null || saveUnits === undefined) {
        units = Object.assign({}, START_UNITS);
    } else {
        units = Object.assign({}, saveUnits);
        fixData(units, START_UNITS);
    }
    if (saveBuildings === null || saveBuildings === undefined) {
        buildings = Object.assign({}, START_BUILDS);
    } else {
        buildings = Object.assign({}, saveBuildings);
        fixData(buildings, START_BUILDS);
    }
    if (saveConst === null || saveConst === undefined) {
        construction = Object.assign({}, START_CONST);
    } else {
        construction = Object.assign({}, saveConst);
        fixData(construction, START_CONST);
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
        diff = diff*3;
        if (astralFlag) {
            player.bricks = player.bricks.plus(getBricksPerSecond().times(diff/1000));
        } else {
            player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff/1000));
        }
        player.totalCorpses = player.totalCorpses.plus(getCorpsesPerSecond().times(diff/1000));
        for (var i=1; i<NUM_UNITS; i++) {
            units[i].amount = units[i].amount.plus(getUnitProdPerSecond(i).times(diff/1000));
        }
        for (var b in buildings) {
            if (isBuilt(b)) {
                buildings[b].amount = buildings[b].amount.plus(getBuildingProdPerSec(b).times(diff/1000));
            }
        }
        allDisplay();
        if ((currentUpdate-player.lastAutoSave)>15000) { 
            player.lastAutoSave = currentUpdate;
            save();
        }
        player.lastUpdate = currentUpdate;
    }, 50);
}
