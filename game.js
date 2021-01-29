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
    brickGainExp: 0.3,

    
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

function init() {
    loadGame();

    showTab('unitsTab');

    startInterval();
}

function showHelp() {
    var active = getActiveTab();
    document.getElementById('helpSpan').innerHTML = generateHelpText(active);
    document.getElementById('helpDiv').style.display = 'block';
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

function updateCorpseDisplay() {
    document.getElementById('corpseAmount').innerHTML = ` ${formatWhole(player.corpses)} `;
    document.getElementById('pluralCorpse').innerHTML = corpseSingulizer(false);
    document.getElementById('pluralCorpseG').innerHTML = corpseSingulizer(true);
    document.getElementById('corpseGain').innerHTML = ` ${(astralFlag ? format(0) : format(getCorpsesPerSecond()))} `;
    document.getElementById('totalMult').innerHTML = `${format(getCorpseMultFromUnits(), 2)}x`;
    document.getElementById('worldsMult').innerHTML = `${format(getWorldsBonus(), 2)}x`;
    document.getElementById('worldsNum').innerHTML = `${formatWhole(player.worlds)}`;
}

function updateUnitDisplay(tier) {
    document.getElementById(units[tier].amountID).innerHTML = "<div style=\"min-width: 30%; float: left;\">" + format(units[tier].amount) + "</div><div style=\"min-width: 30%; float: left;\">(" + formatWhole(units[tier].bought) + ")</div><div style=\"min-width: 35%; float: right;\">" + ((getUnitProdPerSecond(tier).gt(0) && !astralFlag) ? "(+" + formatWhole(new Decimal(getUnitProdPerSecond(tier).div(units[tier].amount.max(1))).m, 2) + "%/s)</div>" : "");
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
                document.getElementById(buildings[b].upgrades[u].buttonID).innerHTML = "<strong>" + getUpgName(b, u) + "</strong><br>" + getUpgDesc(b, u) + "<br>Cost: " + getUpgCost(b, u) + " armaments";
            }
        }
    }
}

function updatePrestige() {
    document.getElementById('spacePrestige').className =  (units[player.nextSpaceReset[1]].bought.gte(player.nextSpaceReset[0]) ? 'prestigeBut' : 'unclickablePrestige');
    document.getElementById('prestigeReq').innerHTML = "Requires <span style=\"font-size: 17pt; white-space: pre;\"> " + player.nextSpaceReset[0] + " </span> " + singulizer(player.nextSpaceReset[1], player.nextSpaceReset[0]);
}

function updateBuildings() {
    document.getElementById('brickDisplay').innerHTML = formatWhole(player.bricks);
    document.getElementById('brickGainDisplay').innerHTML = ` ${(astralFlag ? format(getBricksPerSecond()) : format(0))} `;
    document.getElementById('factoryProd').innerHTML = format(getBuilingProdPerSec(1));
    document.getElementById('factoryAmt').innerHTML = format(buildings[1].amount);
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
}

function loadGame() {
    player = {};
    units = {};
    var savePlayer = JSON.parse(localStorage.getItem('nekrosave'));
    var saveUnlocks = JSON.parse(localStorage.getItem('unlocks'));
    var saveUnits = JSON.parse(localStorage.getItem('units'));
    var saveBuildings = JSON.parse(localStorage.getItem('buildings'));
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
        if (!astralFlag) {
            for (var i=1; i<NUM_UNITS; i++) {
                units[i].amount = units[i].amount.plus(getUnitProdPerSecond(i).times(diff/1000));
            }
        }
        for (var b in buildings) {
            if (isBuilt(b)) {
                buildings[b].amount = buildings[b].amount.plus(getBuilingProdPerSec(b).times(diff/1000));
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
