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

function init() {
    loadGame();

    showTab('unitsTab');

    startInterval();
}

/*document.getElementById('factoryBuild').onclick = function () {
    document.getElementById('factoryBuildRow').style.display = 'none';
    document.getElementById('factoryUpgradesRow').style.display = 'table-row';
};
document.getElementById('necropolisBuild').onclick = function () {
    document.getElementById('necropolisBuildRow').style.display = 'none';
    document.getElementById('necropolisUpgradesRow').style.display = 'table-row';
};*/

function isNumber(str) {
    //var reg = new RegExp('/^\d+$/');
    return /^(\d+\.?\d*)e?(\d+\.?\d*)?$/.test(str);
}

/*function load() {
    //if (tstt === null || typeof tstt === undefined) {
    player = Object.assign({}, START_PLAYER);
        for (var q=1; q<=NUM_UNITS; q++) {
            units[q] = Object.assign({}, START_UNITS[q]);
        }
    
}*/

/*function fixSave() {
    player.corpses = new Decimal(player.corpses);
    player.spaceResets = new Decimal(player.spaceResets);
    player.worlds = new Decimal(player.worlds);
    for (var j=1; j<=NUM_UNITS; j++) {
        units[j].bought = new Decimal(units[j].bought);
        units[j].amount = new Decimal(units[j].amount);
        units[j].multPer = new Decimal(units[j].multPer);
        units[j].costMult = new Decimal(units[j].costMult);
        units[j].corpseMult = new Decimal(units[j].corpseMult);
        units[j].prodMult = new Decimal(units[j].prodMult);
        units[j].cost = new Decimal(units[j].cost);
    }
}*/

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

/*function customStringify() {
    localStorage.setItem("nekplay", player);
    for (var v=1; v<=NUM_UNITS; v++) {
        localStorage.setItem(units[v].single, units[v]);
    }
}

function customParse(NAME) {
    var tmpPlayer = localStorage.getItem(NAME);
    for (var nm in tmpPlayer) {
        if (isNumber(tmpPlayer[nm])) { tmpPlayer[nm] = new Decimal(tmpPlayer[nm]) }
    }
    player = Object.assign({}, tmpPlayer);

    var tmpUnits = {};
    for (var u=1; u<=NUM_UNITS; u++) {
        tmpUnits[u] = localStorage.getItem("nekro_unitu");
        for (var mn in tmpUnits[u]) {
            if (isNumber(tmpUnits[u][mn])) { tmpUnits[u][mn] = new Decimal(tmpUnits[u][mn]) }
        }
        units[u] = Object.assign({}, tmpUnits[u]);
    }
}*/

function hardReset() {
    player = null;
    for (var i=1; i<=NUM_UNITS; i++) {
        units[i] = null;
    }
    save();
    window.location.reload(true);
}

/*function playerSetup(start) {
    player = Object.assign({}, START_PLAYER);
    player.spaceResets = new Decimal(start.spaceResets);
    player.corpses = new Decimal(start.corpses);
    unitSetup(start);

    return player;
}*/

/*function unitSetup(start) {
    for (var i=0; i<NUM_UNITS; i++) {
        units[i] = Object.assign({}, start.units[i]);
    }
}*/

function getCorpsesPerSecond() {
    return units[1].amount.gt(0) ? units[1].amount.times(getTotalCorpseMult()) : new Decimal(0);
}

function getBricksPerSecond() {
    return getCorpsesPerSecond().pow(player.brickGainExp);
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        mult = mult.plus(units[i].corpseMult);
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
    document.getElementById(units[tier].amountID).innerHTML = "<div style=\"min-width: 30%; float: left;\">" + format(units[tier].amount) + "</div><div style=\"min-width: 30%; float: left;\">(" + formatWhole(units[tier].bought) + ")</div><div style=\"min-width: 35%; float: right;\">" + (getUnitProdPerSecond(tier).gt(0) ? "(+" + formatWhole(new Decimal(getUnitProdPerSecond(tier).div(units[tier].amount.max(1))).m, 2) + "%/s)</div>" : "");
    document.getElementById(units[tier].multID).innerHTML = "<div style=\"min-width: 45%; float: left;\">" + format(units[tier].corpseMult, 2) + "x</div><div style=\"min-width: 45%; float: left;\">(" + ((tier > 1) ? format(units[tier].prodMult, 2) : "~") + "x)</div>";
    document.getElementById(units[tier].buttonID).innerHTML = "Cost: " + formatWhole(units[tier].cost) + " corpses";
    document.getElementById(units[tier].maxID).innerHTML = canAfford(tier) ? `Max: ${calculateMaxUnits(tier)} for &#162;${formatWhole(calculateMaxUnitsCost(tier))}` : "Max: 0";
    if (document.getElementById(units[tier].rowID).style.display !== 'none') {
        document.getElementById(units[tier].buttonID).className = canAfford(tier) ? "unitBut" : "unclickableUnit";
        document.getElementById(units[tier].maxID).className = canAfford(tier) ? "unitMax" : "unclickableMax";
    }
    if (tier<NUM_UNITS && units[tier].bought.gt(0) && canUnlock(tier+1)) {
        document.getElementById(units[tier+1].rowID).style.display = 'table-row';
    }
}

function updateHTML() {
    if (player.totalWorlds.gt(0)) { 
        document.getElementById('worldsBonusDisplay').style.display = 'block';
        document.getElementById('buildingsTabBut').style.display = 'block';
    }
}

function updatePrestige() {
    document.getElementById('spacePresContainer').style.display = (units[player.nextSpaceReset[1]-1].bought.gt(0) ? 'block' : 'none');
    document.getElementById('spacePrestige').className =  (units[player.nextSpaceReset[1]].bought.gte(player.nextSpaceReset[0]) ? 'prestigeBut' : 'unclickablePrestige');
    document.getElementById('prestigeReq').innerHTML = "Requires <span style=\"font-size: 17pt; white-space: pre;\"> " + player.nextSpaceReset[0] + " </span> " + singulizer(player.nextSpaceReset[1], player.nextSpaceReset[0]);
}

function updateBuildings() {
    document.getElementById('brickDisplay').innerHTML = formatWhole(player.bricks);
}

function allDisplay() {
    for (var i=1; i<=(NUM_UNITS); i++) {
        updateUnitDisplay(i);
    }
    updateCorpseDisplay();
    updatePrestige();
    updateBuildings();
    updateHTML()

    //if ((new Date().getTime()-player.lastAutoSave)>15000) {
    //    save();
    //    player.lastAutoSave = new Date().getTime();
    //}
    
}

function getWorldsBonus() {
    return Decimal.max(player.worlds.div(2).pow(1.5).plus(1), 1);
}

function save() {
    localStorage.setItem('nekrosave', JSON.stringify(player));
    for (var v=1; v<=NUM_UNITS; v++) {
        localStorage.setItem(TIERS[v], JSON.stringify(units[v]));
    }
}

function loadGame() {
    player = {};
    units = {};
    var savePlayer = JSON.parse(localStorage.getItem('nekrosave'));
    var saveUnits = {};
    for (var v=1; v<=NUM_UNITS; v++) {
        saveUnits[v] = JSON.parse(localStorage.getItem(TIERS[v]));
    }
    if (savePlayer === null || savePlayer === undefined) {
        player = Object.assign({}, START_PLAYER);
    } else {
        player = Object.assign({}, savePlayer);
        for (var key in player) {
            if (isNumber(player[key]) && key != 'lastAutoSave' && key != 'lastUpdate') player[key] = new Decimal(player[key]);
        }
        //player = Object.assign({}, savePlayer);
    }
    for (var v=1; v<=NUM_UNITS; v++) {
        if (saveUnits[v] === null || saveUnits[v] === undefined) {
            units[v] = Object.assign({}, START_UNITS[v]);
        } else {
            units[v] = Object.assign({}, saveUnits[v]);
            for (var key in units[v]) {
                if (isNumber(units[v][key]) && key != 'tier') units[v][key] = new Decimal(units[v][key]);
            }
            //units[v] = Object.assign({}, saveUnits[v]);
        }
    }
    player.lastUpdate = new Date().getTime();
    player.lastAutoSave = new Date().getTime();
    checkForMissing();
    allDisplay();
}

function checkForMissing() {
    for (var k in START_PLAYER) {
        if (player[k] === undefined) {
            player[k] = START_PLAYER[k];
        }
    }
}

function startInterval() {
    mainLoop = setInterval(function () {
        var currentUpdate = new Date().getTime();
        var diff = currentUpdate - player.lastUpdate;
        if (astralFlag) { diff = diff/10; }
        diff = diff*10;
        if (astralFlag) {
            player.bricks = player.bricks.plus(getBricksPerSecond().times(diff/1000));
        } else {
            player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff/1000));
        }
        player.totalCorpses = player.totalCorpses.plus(getCorpsesPerSecond().times(diff/1000));
        for (var i=1; i<NUM_UNITS; i++) {
            units[i].amount = units[i].amount.plus(getUnitProdPerSecond(i).times(diff/1000));
        }
        allDisplay();
        if ((currentUpdate-player.lastAutoSave)>15000) { 
            player.lastAutoSave = currentUpdate;
            save();
        }
        player.lastUpdate = currentUpdate;
    }, 50);
}
