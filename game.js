const GAME_DATA = {
    author: 'monkeh42',
    version: 'v0.2.8',
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

var DEV_SPEED = 1;
var mainLoop;

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
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        2: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        3: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
    },

    construction: {
        1: new Decimal(0),
        2: new Decimal(0),
        3: new Decimal(0),
        4: new Decimal(0),
    },

    timeDims: {
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
    },

    timeUpgs: {
        11: false,
        12: false,
        13: false,
        14: false,
        21: false,
        22: false,
        23: false,
        24: false,
        31: false,
        32: false,
        33: false,
        34: false,
    },

    autobuyers: {
        1: {
            on: false,
            fast: false,
            bulk: false,
        },
        2: {
            on: false,
            fast: false,
            bulk: false,
        },
        3: {
            on: false,
            fast: false,
            bulk: false,
        },
        4: {
            on: false,
            fast: false,
            bulk: false,
        },
        5: {
            on: false,
            fast: false,
            bulk: false,
        },
        6: {
            on: false,
            fast: false,
            bulk: false,
        },
        7: {
            on: false,
            fast: false,
            bulk: false,
        },
        8: {
            on: false,
            fast: false,
            bulk: false,
        },
        9: {
            on: false,
            fast: false,
            amount: new Decimal(0),
            type: 'atx',
            autolock: true,
        },
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    },

    bricks: new Decimal(0),
    brickGainExp: 0.2,
    astralFlag: false,

    crystals: new Decimal(0),
    trueEssence: new Decimal(0),
    truePercent: 50,
    antiPercent: 50,
    antiEssence: new Decimal(0),
    timeResets: new Decimal(0),
    timeLocked: false,
    
    totalCorpses: new Decimal(0),
    totalWorlds: new Decimal(0),
    totalSpaceResets: new Decimal(0),
    totalTimeResets: new Decimal(0),
    totalCrystals: new Decimal(0),

    pastRuns: {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(0),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
        ],
    },
    
    lastUpdate: new Date(),
    lastAutoSave: new Date(),
    lastAutobuy: new Date(),

    unlocks: {
        'unitsTab': {
            'mainTab': true, 
            'spacePrestige': false,  
            'autobuyers': false,
            'fastBuyers': false,
            'BulkBuyers': false,
            'advancedBuyer': false,
        },
        'buildingsTab': {
            'mainTab': false,
            'factory': false,
            'factoryRow2': false,
            'necropolis': false,
            'necropolisRow2':false,
            'sun': false,
            'sunRow2': false,
            'construction': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
        },
    },

    confirmations: {
        'worldPrestige': {
            'click': true,
            'key': true,
        },
        'timePrestige': {
            'click': true,
            'key': true,
        },
        'timeRespec': {
            'click': true,
            'key': true,
        },
    },

    tooltipsEnabled: false,
    activeTabs: ['unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab'],
};

const HOTKEYS = {
    'm': {
        desc: 'Max All Units',
        onPress: function() {
            buyMaxAll();
        }
    },
    'a': {
        desc: 'Toggle Astral Enslavement',
        onPress: function() {
            toggleAstral();
        }
    },
    'w': {
        desc: 'World Prestige',
        onPress: function() {
            spacePrestige();
        }
    },
    's': {
        desc: 'Sacrifice',
        onPress: function() {
            timePrestige();
        }
    },
    'r': {
        desc: 'Respec Time Production',
        onPress: function() {
            timePrestige();
        }
    },
    '1': {
        desc: 'Buy One Zombie',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(1) : buySingleUnit(1)
        }
    },
    '2': {
        desc: 'Buy One Abomination',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(2) : buySingleUnit(2)
        }
    },
    '3': {
        desc: 'Buy One Skeleton Mage',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(3) : buySingleUnit(3)
        }
    },
    '4': {
        desc: 'Buy One Banshee',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(4) : buySingleUnit(4)
        }
    },
    '5': {
        desc: 'Buy One Lich',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(5) : buySingleUnit(5)
        }
    },
    '6': {
        desc: 'Buy One Behemoth',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(6) : buySingleUnit(6)
        }
    },
    '7': {
        desc: 'Buy One Ancient One',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(7) : buySingleUnit(7)
        }
    },
    '8': {
        desc: 'Buy One Sun Eater',
        onPress: function(ctrlPressed) {
            ctrlPressed ? buyMaxUnits(8) : buySingleUnit(8)
        }
    },
};

document.onkeydown = function(e) {
    var key = e.key;
    var ctrlDown = e.ctrlKey;
    if (HOTKEYS[key] !== undefined) { HOTKEYS[key].onPress(ctrlDown); }
}

var player = {};

function init() {
    loadGame();

    showTab(player.activeTabs[0]);
    showUnitSubTab(player.activeTabs[1]);
    showBuildingSubTab(player.activeTabs[2]);
    showTimeSubTab(player.activeTabs[3]);

    startGame();
}

function updateSliderDisplay() {
    player.truePercent = 100 - Number(document.getElementById('timeSlider').value);
    player.antiPercent = Number(document.getElementById('timeSlider').value);
    document.getElementById('sliderValueRight').innerHTML = document.getElementById('timeSlider').value;
    document.getElementById('sliderValueLeft').innerHTML = 100 - document.getElementById('timeSlider').value;
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
    player.activeTabs[0] = tabName;
}

function showUnitSubTab(subTabName) {
    var allSubTabs = document.getElementsByClassName('unitSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    player.activeTabs[1] = subTabName;
}

function showBuildingSubTab(subTabName) {
    var allSubTabs = document.getElementsByClassName('buildingSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    player.activeTabs[2] = subTabName;
}

function showTimeSubTab(subTabName) {
    var allSubTabs = document.getElementsByClassName('timeSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    player.activeTabs[3] = subTabName;
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

function getActiveTabs() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    var allSubTabs = document.getElementsByClassName('subTab');
    var subTab;
    var aTabs = [];
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            aTabs.push(tab.id);
        }
    }
    for (var j=0; j<allSubTabs.length; j++) {
        subTab = allSubTabs.item(j);
        if (subTab.style.display === 'block') {
            aTabs.push(subTab.id);
        }
    }
    return aTabs;
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
    if (hasUpgrade(2, 11)) { b = b.times(getUpgEffect(2, 11)); }
    if (hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
    return b;
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        if ((i==8) && hasUpgrade(1, 22) && getUpgEffect(1, 22)) { mult = mult.times(UNITS_DATA[i].corpseMult()); }
        else { mult = mult.plus(UNITS_DATA[i].corpseMult()); }
    }
    return Decimal.max(mult, 1);
}

function getTotalCorpseMult() {
    var mult = getCorpseMultFromUnits();
    mult = mult.times(getWorldsBonus());
    if (hasUpgrade(2, 13)) { mult = mult.times(getUpgEffect(2, 13)); }
    if (hasUpgrade(1, 23)) { mult = mult.times(getUpgEffect(1, 23)); }
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
    document.getElementById('corpseAmount').innerHTML = formatDefault(player.corpses);
    document.getElementById('pluralCorpse').innerHTML = corpseSingulizer(false);
    document.getElementById('pluralCorpseG').innerHTML = corpseSingulizer(true);
    document.getElementById('corpseGain').innerHTML = player.astralFlag ? formatWhole(0) : formatDefault(getCorpsesPerSecond())
    document.getElementById('totalMult').innerHTML = `${formatDefault2(getCorpseMultFromUnits())}x`;
    document.getElementById('worldsMult').innerHTML = `${formatDefault2(getWorldsBonus())}x`;
    document.getElementById('worldsNum').innerHTML = `${formatWhole(player.worlds)}`;
    document.getElementById('pluralWorld').innerHTML = worldSingulizer();
    document.getElementById('totalMultAll').innerHTML = `${formatDefault2(getTotalCorpseMult())}x`;
    document.getElementById('normalAstral').innerHTML = player.astralFlag ? 'ASTRAL' : 'NORMAL'
    document.getElementById('normalAstral').style.color = player.astralFlag ? '#42d35a' : 'white'
    document.getElementById('timeMult').innerHTML = `${player.astralFlag ? formatDefault2(getAntiTimeBuff()) : formatDefault2(getTrueTimeBuff())}x`
    document.getElementById('timeMult').style.color = player.astralFlag ? '#42d35a' : 'white'
    document.getElementById('devSpeedDisplay').innerHTML = formatWhole(DEV_SPEED);
    if (DEV_SPEED!=1) { document.getElementById('devSpeedContainer').style.display = 'block'}
    else { document.getElementById('devSpeedContainer').style.display = 'none'}
}

function updateUnitDisplay(tier) {
    document.getElementById(UNITS_DATA[tier].amountID).innerHTML = "<div style=\"min-width: 35%; float: left;\">" + formatUnitRow(player.units[tier].amount) + "</div><div style=\"min-width: 35%; float: left;\">(" + formatWholeUnitRow(player.units[tier].bought) + ")</div><div style=\"min-width: 30%; float: left;\">" + (getUnitProdPerSecond(tier).gt(0) ? "(+" + formatDefault(Decimal.times((getUnitProdPerSecond(tier).div(player.units[tier].amount.max(1))), 100), 2) + "%/s)</div>" : "");
    document.getElementById(UNITS_DATA[tier].multID).innerHTML = "<div style=\"min-width: 45%; float: left;\">" + formatUnitRow2(UNITS_DATA[tier].corpseMult()) + "x</div><div style=\"min-width: 45%; float: left;\">(" + ((tier > 1) ? formatUnitRow2(UNITS_DATA[tier].prodMult()) : "~") + "x)</div>";
    document.getElementById(UNITS_DATA[tier].buttonID).innerHTML = "Cost: " + formatWhole(UNITS_DATA[tier].cost()) + " corpses";
    document.getElementById(UNITS_DATA[tier].maxID).innerHTML = canAffordUnit(tier) ? `Max: ${calculateMaxUnits(tier)} for &#162;${formatWhole(calculateMaxUnitsCost(tier))}` : "Max: 0";
}

function updateTimeDimDisplay(tier) {
    document.getElementById(TIME_DATA[tier].amountID).innerHTML = "<div style=\"min-width: 30%; float: left;\">" + formatUnitRow(player.timeDims[tier].amount) + "</div><div style=\"min-width: 30%; float: left;\">(" + formatWholeUnitRow(player.timeDims[tier].bought) + ")</div><div style=\"min-width: 40%; float: left;\">" + (getTimeDimProdPerSecond(tier+1).gt(0) ? "(+" + formatDefault(Decimal.times((getTimeDimProdPerSecond(tier+1).div(player.timeDims[tier].amount.max(1))), 100), 2) + "%/s)</div>" : "");
    document.getElementById(TIME_DATA[tier].multID).innerHTML = "<div>" + formatUnitRow2(TIME_DATA[tier].mult()) + "x</div>";
    document.getElementById(TIME_DATA[tier].buttonID).innerHTML = "Cost: " + formatWhole(TIME_DATA[tier].cost()) + " crystals";
    document.getElementById(TIME_DATA[tier].maxID).innerHTML = canAffordTime(tier) ? `Max: ${calculateMaxTime(tier)} for &#162;${formatWhole(calculateMaxTimeCost(tier))}` : "Max: 0";
}

function updateTimeDisplay() {
    document.getElementById('trueTimeAmt').innerHTML = formatUnitRow(player.trueEssence);
    document.getElementById('antiTimeAmt').innerHTML = formatUnitRow(player.antiEssence);
    document.getElementById('trueTimeGain').innerHTML = formatUnitRow(getTimeDimProdPerSecond(1).times((100-document.getElementById('timeSlider').value)/100));
    document.getElementById('antiTimeGain').innerHTML = formatUnitRow(getTimeDimProdPerSecond(1).times(document.getElementById('timeSlider').value/100));
    document.getElementById('trueTimeBuff').innerHTML = formatDefault2(getTrueTimeBuff());
    document.getElementById('antiTimeBuff').innerHTML = formatDefault2(getAntiTimeBuff());
    document.getElementById('trueTimeNerf').innerHTML = formatDefault2(getTrueTimeNerf());
    document.getElementById('antiTimeNerf').innerHTML = formatDefault2(getAntiTimeNerf());
    document.getElementById('crystalAmt').innerHTML = ' ' + formatWhole(player.crystals) + ' ';
    if (player.totalCrystals.gte(2000)) { document.getElementById('timePresDesc').style.display = 'none'; }

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
    for (var i=1; i<NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].bought.gte(1)) {
            player.timeDims[i+1].unlocked = true;
        } 
    }
}

function updateHTML() {
    var element;
    var elements;
    var bUpgs;
    document.getElementById('versionNumber').innerHTML = GAME_DATA.version;
    for (var tab in UNLOCKS_DATA) {
        for (var key in UNLOCKS_DATA[tab]) {
            if (player.unlocks[tab][key]) {
                for (var id in UNLOCKS_DATA[tab][key].idsToShow) {
                    if (id !== undefined) {    
                        element = document.getElementById(UNLOCKS_DATA[tab][key].idsToShow[id]);
                        if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                        else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                        else { element.style.display = 'block'; }
                    }
                }
                for (var idd in UNLOCKS_DATA[tab][key].idsToHide) {
                    if (UNLOCKS_DATA[tab][key].classNotID) {
                        document.documentElement.style.setProperty(UNLOCKS_DATA[tab][key].cssVar, 'none');
                        elements = document.getElementsByClassName(UNLOCKS_DATA[tab][key].classToEnable);
                        for (var q=0; q<elements.length; q++) {
                            elements[q].removeAttribute('disabled');
                        }
                    } else {
                        document.getElementById(UNLOCKS_DATA[tab][key].idsToHide[idd]).style.display = 'none';
                    }
                }
            } else {
                for (var id in UNLOCKS_DATA[tab][key].idsToShow) {
                    document.getElementById(UNLOCKS_DATA[tab][key].idsToShow[id]).style.display = 'none';
                }
                for (var idd in UNLOCKS_DATA[tab][key].idsToHide) {
                    if (UNLOCKS_DATA[tab][key].classNotID) {
                        document.documentElement.style.setProperty(UNLOCKS_DATA[tab][key].cssVar, 'block');
                        elements = document.getElementsByClassName(UNLOCKS_DATA[tab][key].classToEnable);
                        for (var q=0; q<elements.length; q++) {
                            elements[q].setAttribute('disabled', true);
                        }
                    } else {
                        element = document.getElementById(UNLOCKS_DATA[tab][key].idsToHide[idd]);
                        if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                        else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                        else { element.style.display = 'block'; }
                    }
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
    for (var i=1; i<=NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].unlocked) {
            document.getElementById(TIME_DATA[i].rowID).style.display = 'table-row';
            document.getElementById(TIME_DATA[i].buttonID).className = canAffordTime(i) ? 'unitButT' : 'unclickableUnit';
            document.getElementById(TIME_DATA[i].maxID).className = canAffordTime(i) ? "unitMaxT" : 'unclickableMax';
        }
    }
    var timeTextElements = document.getElementsByClassName('timeResourceTexts');
    for (var el=0; el<timeTextElements.length; el++) {
        timeTextElements[el].innerHTML = timeSingulizer(timeTextElements[el].id);
    }
    for (var b in BUILDS_DATA) {
        if (canAffordBuilding(b)) { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonClass; }
        else { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonUnclick; }
        if (isBuilt(b)) {
            for (var u in BUILDS_DATA[b].upgrades) {
                if (hasUpgrade(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnBought + ((player.tooltipsEnabled && BUILDS_DATA[b].upgrades[u].displayTooltip) ? ' tooltip' : '') }
                else if (canAffordBUpg(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnClass + ((player.tooltipsEnabled && BUILDS_DATA[b].upgrades[u].displayTooltip) ? ' tooltip' : '') }
                else { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnUnclick + ((player.tooltipsEnabled && BUILDS_DATA[b].upgrades[u].displayTooltip) ? ' tooltip' : '') }
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getUpgName(b, u) + "</span><br>" + getUpgDesc(b, u) + "<br>Cost: " + formatWhole(getUpgCost(b, u)) + " " + BUILDS_DATA[b].upgResource + (isDisplayEffect(b, u) ? ("<br>Currently: " + formatDefault2(getUpgEffect(b, u)) + "x") : "");
            }
        }
        var buildingTextElements = document.getElementsByClassName('buildingResourceTexts');
        for (var el=0; el<buildingTextElements.length; el++) {
            buildingTextElements[el].innerHTML = buildingSingulizer(buildingTextElements[el].id);
        }
    }
    for (var c in CONSTR_DATA) {
        if (canAffordCUpg(c)) { document.getElementById(CONSTR_DATA[c].buttonID).className = 'constrUpg' }
        else { document.getElementById(CONSTR_DATA[c].buttonID).className = 'unclickableConstrUpg' }
        if (CONSTR_DATA[c].isTimes) { document.getElementById(CONSTR_DATA[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + formatDefault(getCUpgCost(c)) + " astral bricks" + "<br>Current level: " + formatWhole(player.construction[c]) + (isDisplayEffectC(c) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(c)) + "x") : ""); }
        else { document.getElementById(CONSTR_DATA[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + formatDefault(getCUpgCost(c)) + " astral bricks" + "<br>Current level: " + formatWhole(player.construction[c]) + (isDisplayEffectC(c) ? ("<br>Currently: +" + formatDefault2(getCUpgEffect(c))) : ""); }
    }
    for (var t in TIME_DATA.upgrades) {
        if (hasTUpgrade(t)) { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'boughtTimeUpg' + ((player.tooltipsEnabled && TIME_DATA.upgrades[t].displayTooltip) ? ' tooltip' : '') }
        else if (canAffordTUpg(t)) { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'timeUpg' + ((player.tooltipsEnabled && TIME_DATA.upgrades[t].displayTooltip) ? ' tooltip' : '') }
        else { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'unclickableTimeUpg' + ((player.tooltipsEnabled && TIME_DATA.upgrades[t].displayTooltip) ? ' tooltip' : '') }
        document.getElementById(TIME_DATA.upgrades[t].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getTUpgName(t) + "</span><br>" + getTUpgDesc(t) + ((TIME_DATA.upgrades[t].preReq != null) ? "<br>Requires <span style=\"font-weight: 800;\">" + TIME_DATA.upgrades[TIME_DATA.upgrades[t].preReq].title + "</span>": "") + "<br>Cost: " + formatWhole(getTUpgCost(t)) + " time crystals" + (isDisplayEffectT(t) ? ("<br>Currently: " + formatDefault2(getTUpgEffect(t)) + "x") : "");
    }
    if (player.astralFlag) {
        document.getElementById('brickGainDiv').style.display = 'block';
        document.getElementById('astralToggle').className = 'astralOn';
        document.getElementById('astralText').innerHTML = 'disable';
        document.getElementById('astralNotice').style.display = 'block';
    } else {
        document.getElementById('brickGainDiv').style.display = 'none';
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
        document.getElementById('astralNotice').style.display = 'none';
    }
    if (player.timeLocked) {
        document.getElementById('lockInTimeBut').className = 'unclickSliderBut';
        document.getElementById('respecTimeBut').className = 'timeSliderBut';
        document.getElementById('timeSlider').className = 'sliderLocked';
        document.getElementById('timeSlider').setAttribute('disabled', true);
    } else {
        document.getElementById('lockInTimeBut').className = 'timeSliderBut';
        document.getElementById('respecTimeBut').className = 'unclickSliderBut';
        document.getElementById('timeSlider').className = 'slider';
        document.getElementById('timePrestige').removeAttribute('disabled');
    }
}

function updatePrestige() {
    document.getElementById('spacePrestige').className =  (canSpacePrestige() ? 'prestigeBut' : 'unclickablePrestige');
    if (player.spaceResets.lt(3)) {
        document.getElementById('spacePresDesc').style.display = 'block';
        if (player.spaceResets.gt(1)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Time Warp';
        } else if (player.spaceResets.gt(0)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Construction Upgrades';
        } else {
            document.getElementById('spacePresUnlock').innerHTML = 'Buildings';
        }
    } else { document.getElementById('spacePresDesc').style.display = 'none'; }
    document.getElementById('prestigeReq').innerHTML = "Requires <span style=\"font-size: 17pt; white-space: pre;\"> " + formatWhole(player.nextSpaceReset[0]) + " </span> " + unitSingulizer(player.nextSpaceReset[1], player.nextSpaceReset[0]);
    document.getElementById('timePrestige').className = (player.tooltipsEnabled ? (canTimePrestige() ? 'timePrestigeBut tooltip' : 'unclickablePrestige tooltip') : (canTimePrestige() ? 'timePrestigeBut' : 'unclickablePrestige'));
    if (canTimePrestige()) {
        document.getElementById('timePrestigeReq').style.display = 'none';
        document.getElementById('timePrestigeGainDesc').style.display = 'block';
    } else {
        document.getElementById('timePrestigeReq').style.display = 'block';
        document.getElementById('timePrestigeGainDesc').style.display = 'none';
    }
    document.getElementById('timePrestigeGain').innerHTML = ' ' + formatWhole(calculateCrystalGain()) + ' ';
}

function updateBuildings() {
    document.getElementById('brickDisplay').innerHTML = formatUnitRow(player.bricks);
    document.getElementById('brickGainDisplay').innerHTML = ` ${(player.astralFlag ? formatUnitRow(getBricksPerSecond()) : formatWhole(0))} `;
    document.getElementById('factoryProd').innerHTML = formatDefault(getBuildingProdPerSec(1));
    document.getElementById('factoryAmt').innerHTML = formatDefault(player.buildings[1].amount);
    document.getElementById('factoryBuildLabel').innerHTML = BUILDS_DATA[1].id;
    document.getElementById('factoryCostLabel').innerHTML = formatWhole(BUILDS_DATA[1].cost);
    document.getElementById('necropolisProd').innerHTML = formatDefault(getBuildingProdPerSec(2));
    document.getElementById('necropolisAmt').innerHTML = formatDefault(player.buildings[2].amount);
    document.getElementById('necropolisBuildLabel').innerHTML = BUILDS_DATA[2].id;
    document.getElementById('necropolisCostLabel').innerHTML = formatWhole(BUILDS_DATA[2].cost);
    document.getElementById('sunProd').innerHTML = formatDefault(getBuildingProdPerSec(3));
    document.getElementById('sunAmt').innerHTML = formatDefault(player.buildings[3].amount);
    document.getElementById('sunBuildLabel').innerHTML = BUILDS_DATA[3].id;
    document.getElementById('sunCostLabel').innerHTML = formatWhole(BUILDS_DATA[3].cost);
    document.getElementById('sunGainSpan').style.display = player.astralFlag ? 'block' : 'none'
    document.getElementById('sunGainNotice').style.display = player.astralFlag ? 'none' : 'block'
    document.getElementById('acolyteEff').innerHTML = formatDefault2(BUILDS_DATA[2].resourceEff());
}

function allDisplay() {
    updateUnlocks();
    for (var i=1; i<=(NUM_UNITS); i++) {
        updateUnitDisplay(i);
    }
    for (var i=1; i<=(NUM_TIMEDIMS); i++) {
        updateTimeDimDisplay(i);
    }
    updateCorpseDisplay();
    updateTimeDisplay();
    updatePrestige();
    updateBuildings();
    updateAutobuyers();
    updateHTML();
    document.getElementById('sliderValueRight').innerHTML = player.antiPercent;
    document.getElementById('sliderValueLeft').innerHTML = player.truePercent;
    document.getElementById('timeSlider').value = player.antiPercent;
}

function getWorldsBonus() {
    var b = new Decimal(player.worlds)
    var e = 1.5 + getCUpgEffect(4);
    var boost = Decimal.max(b.div(1.5).pow(e).plus(1), 1);
    if (hasTUpgrade(32)) { boost = boost.times(getTUpgEffect(32)); }
    return boost;
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

function exportSave() {
    var str = window.btoa(JSON.stringify(player));

    document.getElementById('exportText').value = str;
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
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

function closeText() {
    document.getElementById('exportTextLabel').style.display = 'none';
    document.getElementById('exportText').style.display = 'none';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'none';
    document.getElementById('closeText').removeAttribute('colspan');
}

function save() {
    localStorage.setItem('nekrosave', window.btoa(JSON.stringify(player)));
}

function loadGame() {
    player = {};
    var savePlayer = localStorage.getItem('nekrosave');
    if (savePlayer === null || savePlayer === undefined) {
        copyData(player, START_PLAYER);
    } else {
        copyData(player, JSON.parse(window.atob(savePlayer)));
    }
    fixData(player, START_PLAYER);
    if (player.tooltipsEnabled) {
        player.tooltipsEnabled = false;
        toggleTooltips();
    }

    var element = document.getElementById('hotkeysList');
    var count = 0;
    element.innerHTML = 'Number Keys 1-8: Buy Single Unit; ctrl+(1-8): Buy Max Units;<br>';
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

    for (var b in BUILDS_DATA) {
        for (var u in BUILDS_DATA[b].upgrades) {
            if (BUILDS_DATA[b].upgrades[u].displayTooltip) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).setAttribute('data-title', BUILDS_DATA[b].upgrades[u].displayFormula) }
        }
    }
    for (var t in TIME_DATA.upgrades) {
        if (TIME_DATA.upgrades[t].displayTooltip) { document.getElementById(TIME_DATA.upgrades[t].buttonID).setAttribute('data-title', TIME_DATA.upgrades[t].displayFormula) }
    }

    for (var i=1; i<10; i++) {
        
        if (i<9) { 
            document.getElementById(player.autobuyers.priority[i-1].toString() + (i).toString()).selected = true;
            var unitName = UNITS_DATA[i].single.replace(' ', '');
            if (player.autobuyers[i].on) { document.getElementById(unitName + 'BuyerOn').checked = true; }
            if (player.autobuyers[i].fast) { document.getElementById(unitName + 'BuyerFast').checked = true; }
            if (player.autobuyers[i].bulk) { document.getElementById(unitName + 'BuyerBulkOn').checked = true; }
        } else {
            if (player.autobuyers[i].on) { document.getElementById('sacrificeBuyerOn').checked = true; }
            if (player.autobuyers[i].fast) { document.getElementById('sacrificeBuyerFast').checked = true; }
            document.getElementById('sacrificeBuyerAmount').value = formatWholeNoComma(player.autobuyers[i].amount);
            document.getElementById('sacrificeBuyerOptionsList').options.namedItem(player.autobuyers[i].type).selected = true;
            if (player.autobuyers[i].autolock) { document.getElementById('sacrificeBuyerAutolock').checked = true; }
        }
    }
    fixResetBug();
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

function exportGameState() {
    document.getElementById('exportText').value = window.btoa(JSON.stringify(player) + '\n') + window.btoa(JSON.stringify(START_PLAYER) + '\n') + window.btoa(JSON.stringify(UNITS_DATA) + '\n') + window.btoa(JSON.stringify(BUILDS_DATA) + '\n') + window.btoa(JSON.stringify(CONSTR_DATA) + '\n') + window.btoa(JSON.stringify(TIME_DATA) + '\n');
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
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
    } else {
        player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
    }
    player.totalCorpses = player.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
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
    if (!offline && player.unlocks['unitsTab']['autobuyers']) {
        var slowAutoBuy = (currentUpdate - player.lastAutobuy)>=(15000/DEV_SPEED);
        autobuyerTick(slowAutoBuy);
        if (slowAutoBuy) { player.lastAutobuy = (new Date).getTime(); }
    }
    if (!offline) {
        allDisplay();
        if ((currentUpdate-player.lastAutoSave)>5000) { 
            player.lastAutoSave = currentUpdate;
            save();
        }
        player.lastUpdate = currentUpdate;
    }
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
    if (player.autobuyers[9].on && (player.autobuyers[9].fast || slow)) {
        if (isAutoSacTriggered()) { timePrestigeNoConfirm(true); }
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
    player.lastUpdate = (new Date).getTime();
    player.lastAutoSave = (new Date).getTime();
    player.lastAutobuy = (new Date).getTime();
}

function closeOfflinePopup() {
    document.getElementById('offlineGainPopup').style.display = 'none';
}

function startGame() {
    var diff = (new Date).getTime() - player.lastUpdate;
    if ((diff)>(1000*1000)) { calculateOfflineTime(new Decimal(diff/1000)); }
    else {
        player.lastUpdate = (new Date).getTime();
        player.lastAutoSave = (new Date).getTime();
        player.lastAutobuy = (new Date).getTime();
        save();
    }

    if (player.pastRuns.lastRun.timeSacrificed == 0) { player.pastRuns.lastRun.timeSacrificed = (new Date).getTime(); }

    document.getElementById('calcPopupContainer').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    startInterval();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function changeDevSpeed(num) {
    DEV_SPEED = num;
}

function resetDevSpeed() {
    DEV_SPEED = 1;
}

function rewindTime() {
    clearInterval(mainLoop);
    player.lastUpdate = player.lastUpdate - (3600*1000);
    save();
    window.location.reload();
}

function toggleTooltips() {
    document.getElementById('brickTooltip').classList.toggle('tooltip');
    document.getElementById('trueTooltip').classList.toggle('tooltip');
    document.getElementById('antiTooltip').classList.toggle('tooltip');
    document.getElementById('factoryTooltip').classList.toggle('tooltip');
    document.getElementById('necropolisTooltip').classList.toggle('tooltip');
    document.getElementById('sunTooltip').classList.toggle('tooltip');
    player.tooltipsEnabled = !player.tooltipsEnabled;
    if (player.tooltipsEnabled) { document.getElementById('toggleTooltips').innerHTML = 'TOGGLE FORMULA TOOLTIPS: ON'; }
    else { document.getElementById('toggleTooltips').innerHTML = 'TOGGLE FORMULA TOOLTIPS: OFF'; }
}

function showChangelog(divID) {
    var allDivs = document.getElementsByClassName('changelogPageDiv');
    var tab;
    for (var i=0; i<allDivs.length; i++) {
        tab = allDivs.item(i);
        if (tab.id === divID) {
            (tab.style.display == 'block') ? tab.style.display = 'none': tab.style.display = 'block'
        } else {
            tab.style.display = 'none';
        }
    }
}

function toggleConfirmations(action, method, id) {
    player.confirmations[action][method] = !player.confirmations[action][method];
    if (player.confirmations[action][method]) {
        document.getElementById(id).innerHTML = "ON";
    } else {
        document.getElementById(id).innerHTML = "OFF";
    }
}

function openConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'block';
}

function closeConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'none';
}

function fixResetBug() {
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
    START_PLAYER.corpses = new Decimal(10);
    copyData(START_PLAYER.units, {
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
    });
    
    // this is [number of units, tier]
    START_PLAYER.nextSpaceReset = new Array(1, 5);
    START_PLAYER.spaceResets = new Decimal(0)
    START_PLAYER.worlds = new Decimal(0);

    copyData(START_PLAYER.buildings, {
        1: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        2: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
                21: false,
                22: false,
                23: false,
            }
        },
        3: {
            built: false,
            amount: new Decimal(0),
            upgrades: {
                11: false,
                12: false,
                13: false,
            }
        },
    });

    copyData(START_PLAYER.construction, {
        1: new Decimal(0),
        2: new Decimal(0),
        3: new Decimal(0),
        4: new Decimal(0),
    });

    copyData(START_PLAYER.timeDims, {
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
    });

    copyData(START_PLAYER.timeUpgs, {
        11: false,
        12: false,
        13: false,
        14: false,
        21: false,
        22: false,
        23: false,
        24: false,
        31: false,
        32: false,
        33: false,
        34: false,
    });

    copyData(START_PLAYER.autobuyers, {
        1: {
            on: false,
            fast: false,
            bulk: false,
        },
        2: {
            on: false,
            fast: false,
            bulk: false,
        },
        3: {
            on: false,
            fast: false,
            bulk: false,
        },
        4: {
            on: false,
            fast: false,
            bulk: false,
        },
        5: {
            on: false,
            fast: false,
            bulk: false,
        },
        6: {
            on: false,
            fast: false,
            bulk: false,
        },
        7: {
            on: false,
            fast: false,
            bulk: false,
        },
        8: {
            on: false,
            fast: false,
            bulk: false,
        },
        9: {
            on: false,
            fast: false,
            amount: new Decimal(0),
            type: 'atx',
            autolock: true,
        },
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    });

    copyData(START_PLAYER.pastRuns, {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(0),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(0),
            },
        ],
    });

    START_PLAYER.bricks = new Decimal(0);
    START_PLAYER.brickGainExp = 0.2;
    START_PLAYER.astralFlag = false;

    START_PLAYER.crystals = new Decimal(0);
    START_PLAYER.trueEssence = new Decimal(0);
    START_PLAYER.truePercent = 50;
    START_PLAYER.antiPercent = 50;
    START_PLAYER.antiEssence = new Decimal(0);
    START_PLAYER.timeResets = new Decimal(0);
    START_PLAYER.timeLocked = false;
    
    START_PLAYER.totalCorpses = new Decimal(0);
    START_PLAYER.totalWorlds = new Decimal(0);
    START_PLAYER.totalSpaceResets = new Decimal(0);
    START_PLAYER.totalTimeResets = new Decimal(0);
    START_PLAYER.totalCrystals = new Decimal(0);
    
    START_PLAYER.lastUpdate = new Date();
    START_PLAYER.lastAutoSave = new Date();
    START_PLAYER.lastAutobuy = new Date();

    copyData(START_PLAYER.unlocks, {
        'unitsTab': {
            'mainTab': true, 
            'spacePrestige': false,  
            'autobuyers': false,
            'fastBuyers': false,
            'BulkBuyers': false,
            'advancedBuyer': false,
        },
        'buildingsTab': {
            'mainTab': false,
            'factory': false,
            'factoryRow2': false,
            'necropolis': false,
            'necropolisRow2':false,
            'sun': false,
            'sunRow2': false,
            'construction': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
        },
    });

    copyData(START_PLAYER.confirmations, {
        'worldPrestige': {
            'click': true,
            'key': true,
        },
        'timePrestige': {
            'click': true,
            'key': true,
        },
        'timeRespec': {
            'click': true,
            'key': true,
        },
    });

    START_PLAYER.tooltipsEnabled = false;
    START_PLAYER.activeTabs = new Array('unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab'),

    fixData(player, START_PLAYER);
    save();
}