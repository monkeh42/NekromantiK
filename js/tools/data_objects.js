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
        10: {
            on: false,
            fast: false,
            priority: false,
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

    allTimeStats: {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),
        totalTimeResets: new Decimal(0),
        totalCrystals: new Decimal(0),

        bestCrystalGain: new Decimal(0),
        bestCrystalRate: new Decimal(0),
        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),
        bestCrystals: new Decimal(0),
    },

    thisSacStats: {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),

        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),

        hasGoneAstral: false,
    },

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
            'prestigeBuyer': false,
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
        'galaxyTab': {
            'mainTab': false,
            'arkTab': false,
        },
    },

    achievements: {
        11: {
            unlocked: false,
            new: false,
        },
        12: {
            unlocked: false,
            new: false,
        },
        13: {
            unlocked: false,
            new: false,
        },
        14: {
            unlocked: false,
            new: false,
        },
        15: {
            unlocked: false,
            new: false,
        },
        21: {
            unlocked: false,
            new: false,
        },
        22: {
            unlocked: false,
            new: false,
        },
        23: {
            unlocked: false,
            new: false,
        },
        24: {
            unlocked: false,
            new: false,
        },
        25: {
            unlocked: false,
            new: false,
        },
        31: {
            unlocked: false,
            new: false,
        },
        32: {
            unlocked: false,
            new: false,
        },
        33: {
            unlocked: false,
            new: false,
        },
        34: {
            unlocked: false,
            new: false,
        },
        35: {
            unlocked: false,
            new: false,
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
    activeTabs: ['unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'statSubTab'],
    hotkeysOn: true,
}

const ACH_DATA = {
    11: {
        title: 'The Astral Brick Road',
        desc: 'Unlock Buildings.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach11',
        canUnlock: function() {
            return player.unlocks['buildingsTab']['mainTab'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    12: {
        title: 'Nekro-Carpentry',
        desc: 'Unlock Construction.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach12',
        canUnlock: function() {
            return player.unlocks['buildingsTab']['construction'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    13: {
        title: 'Wait, This Sounds Familiar...',
        desc: 'Unlock Time Warp.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach13',
        canUnlock: function() {
            return player.unlocks['timeTab']['mainTab'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    14: {
        title: 'Master Of The Dead',
        desc: 'Own at least one of each unit.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach14',
        canUnlock: function() {
            for (let i=1; i<=NUM_UNITS; i++) {
                if (player.units[i].amount.eq(0)) { return false; }
            }
            return true;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    15: {
        title: 'One Sun, Two Sun, Dead Sun, Blue Sun',
        desc: 'Build the Dead Sun.',
        reward: 'Keep all your bricks on prestige, and keep your best bricks this sacrifice raised ^0.2 on sacrifice.',
        showEffect: false,
        hasReward: true,
        divID: 'ach15',
        canUnlock: function() {
            return isBuilt(3);
        },
        effect: function() {
            let e = new Decimal(player.thisSacStats.bestBricks);
            return e.pow(0.2);
        },
        onUnlock: function() {
            document.getElementById('keptBricks').style.display = 'block';
        }
    },
    21: {
        title: 'Killing Time',
        desc: 'Unlock Time Upgrades.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach21',
        canUnlock: function() {
            return player.unlocks['timeTab']['timeUpgrades'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    22: {
        title: 'Inter-dimensional Nekro-Cable',
        desc: 'Buy one 4th Time Dimension.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach22',
        canUnlock: function() {
            return player.timeDims[4].bought.gt(0);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    23: {
        title: 'Full Stasis',
        desc: 'Buy the entire first column of Time Upgrades.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach23',
        canUnlock: function() {
            return hasTUpgrade(14);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    24: {
        title: 'It\'s About Time',
        desc: 'Buy the entire second column of Time Upgrades.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach24',
        canUnlock: function() {
            return hasTUpgrade(24);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    25: {
        title: 'Thyme Lord',
        desc: 'Buy the entire third column of Time Upgrades.',
        reward: 'Double base nekro-photon production (2/sec -> 4/sec).',
        showEffect: false,
        hasReward: true,
        divID: 'ach25',
        canUnlock: function() {
            return hasTUpgrade(34);
        },
        effect: function() {
            return new Decimal(2);
        },
        onUnlock: function() {
            return;
        }
    },
    31: {
        title: 'The Grind',
        desc: 'Sacrifice fifteen times.',
        reward: 'Your unit corpse multipliers get a boost based on number of sacrifices.',
        hasReward: true,
        showEffect: true,
        divID: 'ach31',
        canUnlock: function() {
            return player.timeResets.gte(15);
        },
        effect: function() {
            let e = new Decimal(player.timeResets);
            e = e.div(5);
            return e.plus(1);
        },
        onUnlock: function() {
            return;
        }
    },
    32: {
        title: 'Master Nekro-Carpenter',
        desc: 'Get the first four construction upgrades all to at least level 25.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach32',
        canUnlock: function() {
            for (let id in CONSTR_DATA) {
                if (player.construction[id].lt(25)) { return false; }
            }
            return true;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    33: {
        title: 'Frugality',
        desc: 'Reach 1e100 corpses without enabling Astral Enslavement this sacrifice.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach33',
        canUnlock: function() {
            return (player.corpses.gte(1e100) && !player.thisSacStats.hasGoneAstral);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    34: {
        title: 'I Need To Go Faster',
        desc: 'Get your normal time multiplier to at least 30x.',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach34',
        canUnlock: function() {
            return getTrueTimeBuff().gte(30);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    35: {
        title: 'Galactic Angst',
        desc: 'Unlock Depleted Galaxies.',
        reward: 'Menagerie Of Worlds\'s effect is stronger (^0.67 -> ^0.37).',
        showEffect: false,
        hasReward: true,
        divID: 'ach35',
        canUnlock: function() {
            return false; //hasUpgrade(3, 23);
        },
        effect: function() {
            let e = new Decimal(player.bestBricks);
            return e.pow(0.2);
        },
        onUnlock: function() {
            return;
        }
    },
}

const UNLOCKS_DATA = {
    'unitsTab': {
        'mainTab': {
            unlocked: true,
            classNotID: false,
            idsToShow: [],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return true;
            }
        }, 
        'spacePrestige': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['spacePresContainer'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return player.units[4].bought.gte(1);
            }
        },  
        'autobuyers': {
            unlocked: false,
            classNotID: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: ['unitsSubMenu', 'autobuyersSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(13);
            },
            condition: function() {
                return hasTUpgrade(13);
            }
        },
        'fastBuyers': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerSpeedOnContainer'],
            cssVar: '--speedDisplay',
            classToEnable: 'speedBuyerRadio',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(24);
            }
        },
        'bulkBuyers': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerBulkOnContainer'],
            cssVar: '--bulkDisplay',
            classToEnable: 'bulkBuyerRadio',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(33);
            }
        },
        'prestigeBuyer': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: [],
            cssVar: '--prestigeDisplay',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(34);
            }
        },
        'advancedBuyer': {
            unlocked: false,
            classNotID: true,
            idsToShow: [],
            idsToHide: ['buyerAmountOptionsContainer'],
            cssVar: '--optionsDisplay',
            classToEnable: 'buyerList',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 22);
            }
        },
    },
    'buildingsTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            notifyID: 'buildingsTabBut',
            idsToShow: ['buildingsTabCell', 'worldsBonusDisplay', 'totalBonusDisplay'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(11);
            },
            condition: function() {
                return player.spaceResets.gte(1);
            }
        },
        'factory': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['factoryUpgradesRow1', 'factoryHeaderRow'],
            idsToHide: ['factoryBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(1);
            }
        },
        'factoryRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['factoryUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 11) && isBuilt(1);
            }
        },
        'necropolis': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['necropolisUpgradesRow1', 'necropolisHeaderRow'],
            idsToHide: ['necropolisBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(2);
            }
        },
        'necropolisRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['necropolisUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 12) && isBuilt(2);
            }
        },
        'sun': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['sunUpgradesRow', 'sunHeaderRow'],
            idsToHide: ['sunBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(3);
            }
        },
        'sunRow2': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['sunUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(34) && isBuilt(3);
            }
        },
        'construction': {
            unlocked: false,
            classNotID: false,
            notifyID: 'constructionSubTabBut',
            parentNotify: 'buildingsTabBut',
            idsToShow: ['buildingsSubMenu', 'constructionSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(12);
            },
            condition: function() {
                return player.spaceResets.gte(2);
            }
        },
    },
    'timeTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            notifyID: 'timeTabBut',
            idsToShow: ['timeTabCell', 'timeBoostDisplay'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasAchievement(13);
            },
            condition: function() {
                return player.spaceResets.gte(3);
            }
        },
        'timeUpgrades': {
            unlocked: false,
            classNotID: false,
            notifyID: 'timeUpgSubTabBut',
            parentNotify: 'timeTabBut',
            idsToShow: ['timeSubMenu', 'timeUpgSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasUpgrade(3, 13);
            },
            condition: function() {
                return hasUpgrade(3, 13);
            }
        }
    },
    'galaxyTab': {
        'mainTab': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['galaxyTabCell'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return false;
            }
        },
        'arkTab': {
            unlocked: false,
            classNotID: false,
            idsToShow: ['galaxiesSubMenu', 'arkSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return false;
            }
        },
    },
}

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
            spacePrestigeKey();
        }
    },
    's': {
        desc: 'Sacrifice',
        onPress: function() {
            timePrestigeKey();
        }
    },
    'r': {
        desc: 'Respec Time Production',
        onPress: function() {
            respecTimeKey();
        }
    },
    '1': {
        desc: 'Buy One Zombie',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(1) : buySingleUnit(1)
        }
    },
    '2': {
        desc: 'Buy One Abomination',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(2) : buySingleUnit(2)
        }
    },
    '3': {
        desc: 'Buy One Skeleton Mage',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(3) : buySingleUnit(3)
        }
    },
    '4': {
        desc: 'Buy One Banshee',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(4) : buySingleUnit(4)
        }
    },
    '5': {
        desc: 'Buy One Lich',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(5) : buySingleUnit(5)
        }
    },
    '6': {
        desc: 'Buy One Behemoth',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(6) : buySingleUnit(6)
        }
    },
    '7': {
        desc: 'Buy One Ancient One',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(7) : buySingleUnit(7)
        }
    },
    '8': {
        desc: 'Buy One Sun Eater',
        onPress: function(shiftPressed) {
            shiftPressed ? buyMaxUnits(8) : buySingleUnit(8)
        }
    },
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
                21: false,
                22: false,
                23: false,
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
        10: {
            on: false,
            fast: false,
            priority: false,
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
    
    copyData(START_PLAYER.allTimeStats, {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),
        totalTimeResets: new Decimal(0),
        totalCrystals: new Decimal(0),

        bestCrystalGain: new Decimal(0),
        bestCrystalRate: new Decimal(0),
        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),
        bestCrystals: new Decimal(0),
    });

    copyData(START_PLAYER.thisSacStats, {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),
        
        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),

        hasGoneAstral: false,
    });
    
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
            'prestigeBuyer': false,
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
        'galaxyTab': {
            'mainTab': false,
            'arkTab': false,
        },
    });

    copyData(START_PLAYER.achievements, {
        11: {
            unlocked: false,
            new: false,
        },
        12: {
            unlocked: false,
            new: false,
        },
        13: {
            unlocked: false,
            new: false,
        },
        14: {
            unlocked: false,
            new: false,
        },
        15: {
            unlocked: false,
            new: false,
        },
        21: {
            unlocked: false,
            new: false,
        },
        22: {
            unlocked: false,
            new: false,
        },
        23: {
            unlocked: false,
            new: false,
        },
        24: {
            unlocked: false,
            new: false,
        },
        25: {
            unlocked: false,
            new: false,
        },
        31: {
            unlocked: false,
            new: false,
        },
        32: {
            unlocked: false,
            new: false,
        },
        33: {
            unlocked: false,
            new: false,
        },
        34: {
            unlocked: false,
            new: false,
        },
        35: {
            unlocked: false,
            new: false,
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
    START_PLAYER.activeTabs = new Array('unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'statSubTab');
    START_PLAYER.hotkeysOn = true,

    fixData(player, START_PLAYER);
    save();
}