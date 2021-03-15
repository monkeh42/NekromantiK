const START_PLAYER = {
    corpses: new Decimal(10),
    corpsesAch41: new Decimal(25000),
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
        4: {
            built: false,
            amount: new Decimal(0),
            progress: new Decimal(0),
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
        5: new Decimal(0),
        6: new Decimal(0),
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
        5: {
            unlocked: true,
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
        41: false,
        42: false,
        43: false,
        44: false,
        51: false,
        52: false,
        53: false,
        54: false,
    },

    autobuyers: {
        1: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        2: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        3: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        4: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        5: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        6: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        7: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        8: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        9: {
            'on': false,
            'fast': false,
            'amount': new Decimal(1),
            'type': 'atx',
        },
        10: {
            'on': false,
            'fast': false,
            'max': new Decimal(0),
        },
        11: {
            'on': false,
            'fast': false,
            'amount': new Decimal(1),
        },
        12: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
        },
        'time': {
            'on': false,
        },
        
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    },

    galaxyUpgs: {
        1: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        2: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        3: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        4: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
    },

    researchProjects: {
        1: {
            active: false,
            completed: false,
        },
        2: {
            active: false,
            completed: false,
        },
        3: {
            active: false,
            completed: false,
        },
        4: {
            active: false,
            completed: false,
        },
        5: {
            active: false,
            completed: false,
        },
        6: {
            active: false,
            completed: false,
        },
        7: {
            active: false,
            completed: false,
        },
    },

    ark: {
        'engines': {
            unlocked: false,
            bought: false,
        },
        'thrusters': {
            unlocked: false,
            bought: false,
        },
        'support': {
            unlocked: false,
            bought: false,
        },
        'railguns': {
            unlocked: false,
            bought: false,
        },
        'torpedos': {
            unlocked: false,
            bought: false,
        },
        'navigation': {
            unlocked: false,
            bought: false,
        },
    },

    ethUpgs: {
        11: false,
        12: false,
        13: false,
        14: false,
    },

    bricks: new Decimal(0),
    brickGainExp: 0.2,
    astralFlag: false,

    crystals: new Decimal(0),
    milesCrystals: new Decimal(11111),
    trueEssence: new Decimal(0),
    truePercent: 50,
    antiPercent: 50,
    antiEssence: new Decimal(0),
    timeResets: new Decimal(0),
    timeLocked: false,

    galaxies: new Decimal(0),
    spentGalaxies: new Decimal(0),
    ascensions: new Decimal(0),
    
    research: new Decimal(0),
    isInResearch: false,
    theorems: new Decimal(0),
    infCompletions: new Decimal(0),

    win: false,
    continue: false,

    allTimeStats: {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),
        totalTimeResets: new Decimal(0),
        totalCrystals: new Decimal(0),
        totalGalaxies: new Decimal(0),
        totalSpentGalaxies: new Decimal(0),
        totalAscensions: new Decimal(0),

        bestCrystalGain: new Decimal(0),
        bestCrystalRate: new Decimal(0),
        bestGalaxyGain: new Decimal(0),
        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),
        bestCrystals: new Decimal(0),
        bestGalaxies: new Decimal(0),
    },

    thisSacStats: {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),

        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),

        wentAstral: false,
    },

    thisAscStats: {
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

        wentAstral: false,
    },

    pastRuns: {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
        ],
    },

    pastAscRuns: {
        lastRun: {
            galaxyGain: new Decimal(0),
            timeSpent: 0,
            timeAscended: new Date(),
        },
        lastTen: [
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
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
            'ascensionBuyer': false,
            'timeDimBuyer': false,
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
            'constructionRow2': false,
            'vortexTable': false,
            'vortex': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
            'timeUpgrades2': false,
            'timeDims2': false,
        },
        'galaxyTab': {
            'mainTab': false,
            'customizeDisplay': false,
            'arkTab': false,
            'researchTab': false,
        },
    },

    achievements: {
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        31: false,
        32: false,
        33: false,
        34: false,
        35: false,
        41: false,
        42: false,
        43: false,
        44: false,
        45: false,
        51: false,
        52: false,
        53: false,
        54: false,
        55: false,
        61: false,
        62: false,
        63: false,
        64: false,
        65: false,
        71: false,
        72: false,
        73: false,
        74: false,
        75: false,
    },

    milestones: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
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
        'galaxyPrestige': {
            'click': true,
            'key': true,
        },
        'galaxyRespec': {
            'click': true,
            'key': true,
        },
    },

    headerDisplay: {
        'autosavePopup': true,
        'astralNoticeDisplay': true,
        'unitsBoostDisplay': true,
        'achBoostDisplay': false,
        'worldsBonusDisplay': true,
        'galaxiesBonusDisplay': true,
        'totalBonusDisplay': true,
        'bricksDisplayHeader': false,
        'bricksGainDisplayHeader': false,
        'crystalsDisplayHeader': false,
        'timeBoostDisplay': true,
        'unspentGalaxiesHeaderDisplay': false,
        'researchDisplayHeader': false,
        'researchGainDisplayHeader': false,
    },

    headerDisplayUnlocked: {
        'autosavePopup': true,
        'astralNoticeDisplay': false,
        'unitsBoostDisplay': true,
        'achBoostDisplay': true,
        'worldsBonusDisplay': false,
        'galaxiesBonusDisplay': false,
        'totalBonusDisplay': true,
        'bricksDisplayHeader': false,
        'bricksGainDisplayHeader': false,
        'crystalsDisplayHeader': false,
        'timeBoostDisplay': false,
        'unspentGalaxiesHeaderDisplay': false,
        'researchDisplayHeader': false,
        'researchGainDisplayHeader': false,
    },

    tooltipsEnabled: false,
    displayRealTime: false,
    activeTabs: ['unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'galaxiesSubTab', 'statSubTab'],
    activeGalaxies: [4, 'gal1', 'gal2'],
    hotkeysOn: true,
    dontResetSlider: false,
    favGalaxies: [[], [], []],
    favGalNames: ['Slot 1', 'Slot 2', 'Slot 3'],
    version: 'v0.3.1_d.5',
}

const MILES_DATA = {
    1: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(1) == 4;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
    2: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 1;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
    3: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(2) == 4;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
    4: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 2;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
    5: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(3) == 4;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
    6: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 3;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            document.getElementById('extraColsNotice').style.display = '';
        },
        isImplemented: true,
    },
    7: {
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 4;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        },
        isImplemented: true,
    },
}

const ACH_DATA = {
    11: {
        title: 'The Astral Brick Road',
        desc: 'Unlock Buildings.',
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        title: 'Inter-Dimensional Nekro-Cable',
        desc: 'Buy one 4th Time Dimension.',
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
        hasReward: true,
        showEffect: true,
        divID: 'ach31',
        canUnlock: function() {
            return player.allTimeStats.totalTimeResets.gte(15);
        },
        effect: function() {
            let e = new Decimal(player.allTimeStats.totalTimeResets);
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
        secret: false,
        hint: '',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach32',
        canUnlock: function() {
            for (let i=1; i<=4; i++) {
                if (player.construction[i].lt(25)) { return false; }
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
        secret: false,
        hint: '',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach33',
        canUnlock: function() {
            return (player.corpses.gte(1e100) && player.thisSacStats.totalBricks.eq(0));
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
        secret: false,
        hint: '',
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
        secret: false,
        hint: '',
        reward: 'Menagerie Of Worlds\'s effect is stronger (^0.67 -> ^0.333).',
        showEffect: false,
        hasReward: true,
        divID: 'ach35',
        canUnlock: function() {
            return hasUpgrade(3, 23);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    41: {
        title: 'Interstellar',
        desc: 'Buy a galaxy upgrade.',
        reward: 'You start all resets with 25,000 corpses.',
        secret: false,
        hint: '',
        hasReward: true,
        showEffect: false,
        divID: 'ach41',
        canUnlock: function() {
            return player.spentGalaxies.gt(0);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    42: {
        title: 'Tedium Is Joy',
        desc: 'Buy World Stasis 3 for the second time.',
        secret: false,
        hint: '',
        reward: 'Autobuyers are unlocked permanently.',
        hasReward: true,
        showEffect: false,
        divID: 'ach42',
        canUnlock: function() {
            return (hasTUpgrade(13) && player.ascensions.gt(0)) || player.ascensions.gt(1);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    43: {
        title: 'The Slog Of Slogs',
        desc: 'Buy Nekro-Time for the second time.',
        secret: false,
        hint: '',
        reward: 'Nekro-Time is never reset.',
        hasReward: true,
        showEffect: false,
        divID: 'ach43',
        canUnlock: function() {
            return (hasUpgrade(3, 13) && player.ascensions.gt(0)) || player.ascensions.gt(1);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    44: {
        title: 'That\'s Pretty Darn Fast',
        desc: 'Have your zombie corpse multiplier over 10,000 before unlocking Time Warp in this ascension.',
        secret: false,
        hint: '',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach44',
        canUnlock: function() {
            return UNITS_DATA[1].corpseMult().gte(10000) && !player.unlocks['timeTab']['mainTab'];
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    45: {
        title: 'Why?',
        desc: 'Sacrifice without enabling astral enslavement this ascension.',
        secret: false,
        hint: '',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach45',
        canUnlock: function() {
            return player.thisAscStats.totalTimeResets.gt(0) && !player.thisAscStats.wentAstral;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    51: {
        title: 'Multi-Galactic',
        desc: 'Ascend for more than one galaxy.',
        secret: false,
        hint: '',
        reward: 'Nekro-photons are only reset if the Dead Sun is reset.',
        hasReward: true,
        showEffect: false,
        divID: 'ach51',
        canUnlock: function() {
            return player.allTimeStats.bestGalaxyGain.gt(1);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    52: {
        title: 'We\'ve All Been There',
        desc: 'Respec galaxies without any galaxy upgrades.',
        secret: true,
        hint: 'Hint: do something utterly pointless.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach52',
        canUnlock: function() {
            return false;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    53: {
        title: 'Black Hole, Shmlack Hole',
        desc: 'Build the Galactic Vortex.',
        secret: false,
        hint: '',
        reward: 'Buildings don\'t reset on ascension (except bricks and resources).',
        hasReward: true,
        showEffect: false,
        divID: 'ach53',
        canUnlock: function() {
            return player.buildings[4].built;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    54: {
        title: 'Astral Fiend',
        secret: false,
        hint: '',
        desc: 'Sacrifice with more astral bricks than corpses.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach54',
        canUnlock: function() {
            return false;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    55: {
        title: 'Dear God, Why?',
        secret: false,
        hint: '',
        desc: 'Ascend without any galaxy upgrades (your first ascension doesn\'t count).',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach55',
        canUnlock: function() {
            return false;
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    61: {
        title: 'They Came From Beyond',
        desc: 'Unlock The Ark.',
        reward: '',
        secret: false,
        hint: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach61',
        canUnlock: function() {
            return hasMilestone(7);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    62: {
        title: 'What Have I Done?',
        desc: 'Trigger the galaxy effect softcap.',
        secret: false,
        hint: '',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach62',
        canUnlock: function() {
            return player.galaxies.gt(1000*(2**getNumCompletedProj()));
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    63: {
        title: 'I\'m Something Of A Scientist',
        desc: 'Complete a research project.',
        secret: false,
        hint: '',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach63',
        canUnlock: function() {
            return (getNumCompletedProj()>0);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    64: {
        title: 'Infinite Knowledge',
        desc: 'Unlock Infinite Research.',
        secret: false,
        hint: '',
        reward: 'Completely remove all galaxy effect softcaps.',
        hasReward: true,
        showEffect: false,
        divID: 'ach64',
        canUnlock: function() {
            return isResearchCompleted(6);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    65: {
        title: 'Covenant Established',
        desc: 'Construct an Ark component.',
        secret: false,
        hint: '',
        reward: '',
        showEffect: false,
        hasReward: false,
        divID: 'ach65',
        canUnlock: function() {
            return (getNumArkUpgs()>0);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    71: {
        title: 'How The Turntables',
        desc: 'Have your true time essence effect be more than double the anti time essence effect, while they\'re both at least 1,000x.',
        secret: false,
        hint: '',
        reward: 'Double the true time essence effect.',
        hasReward: true,
        showEffect: false,
        divID: 'ach71',
        canUnlock: function() {
            return (getTrueTimeBuff().gt(getAntiTimeBuff().times(2)) && getAntiTimeBuff().gte(1000));
        },
        effect: function() {
            return new Decimal(2);
        },
        onUnlock: function() {
            return;
        }
    },
    72: {
        title: 'Unpossible',
        desc: 'Complete Infinite Research once.',
        secret: false,
        hint: '',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach72',
        canUnlock: function() {
            return player.infCompletions.gt(0);
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    73: {
        title: 'True Annihilation',
        desc: 'Ascend for at least 100 galaxies in under 10 seconds.',
        secret: false,
        hint: '',
        reward: 'Your unit corpse multipliers get a boost based on number of ascensions.',
        hasReward: true,
        showEffect: true,
        divID: 'ach73',
        canUnlock: function() {
            return (player.pastAscRuns.lastRun.galaxyGain.gte(100) && (player.pastAscRuns.lastRun.timeSpent<10000));
        },
        effect: function() {
            let e = new Decimal(player.allTimeStats.totalAscensions);
            e = e.div(50);
            return e.plus(1);
        },
        onUnlock: function() {
            return;
        }
    },
    74: {
        title: 'Ethereal Fiend',
        secret: false,
        hint: '',
        desc: 'Buy all four Ethereal Upgrades at once.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach74',
        canUnlock: function() {
            return (hasEUpgrade(11) && hasEUpgrade(12) && hasEUpgrade(13) && hasEUpgrade(14));
        },
        effect: function() {
            return new Decimal(1);
        },
        onUnlock: function() {
            return;
        }
    },
    75: {
        title: 'Grains Of Sand',
        secret: false,
        hint: '',
        desc: 'Have at least 1e400 corpses.',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach75',
        canUnlock: function() {
            return player.corpses.gte("1e400");
        },
        effect: function() {
            return new Decimal(1);
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
            idsToShow: [],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return true;
            },
            onUnlock: function() {
                return;
            },
        }, 
        'spacePrestige': {
            unlocked: false,
            idsToShow: ['spacePresContainer', 'worldsBonusDisplay', 'worldsToggleRow'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return player.units[4].bought.gte(1) || player.ascensions.gt(0);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['worldsBonusDisplay'] = true;
            },
        },  
        'autobuyers': {
            unlocked: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: ['unitsSubMenu', 'autobuyersSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(13);
            },
            condition: function() {
                return hasTUpgrade(13);
            },
            onUnlock: function() {
                return;
            },
        },
        'fastBuyers': {
            unlocked: false,
            idsToShow: [],
            idsToHide: [],
            classToHide: 'buyerSpeedLock',
            classToEnable: 'buyerSpeedBut',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(24);
            },
            onUnlock: function() {
                return;
            },
        },
        'bulkBuyers': {
            unlocked: false,
            idsToShow: [],
            idsToHide: [],
            classToHide: 'buyerBulkLock',
            classToEnable: 'buyerBulkBut',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(33);
            },
            onUnlock: function() {
                return;
            },
        },
        'prestigeBuyer': {
            unlocked: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: [],
            idsToHide: ['prestigeLockScreen'],
            classToEnable: 'buyerPriBut',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(34);
            },
            onUnlock: function() {
                return;
            },
        },
        'advancedBuyer': {
            unlocked: false,
            idsToShow: [],
            idsToHide: ['advancedSacLock'],
            classToEnable: 'buyerList',
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 22);
            },
            onUnlock: function() {
                return;
            },
        },
        'ascensionBuyer': {
            unlocked: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: ['ascensionBuyerCell'],
            idsToHide: [],
            //classToEnable: 'buyerList',
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'timeDimBuyer': {
            unlocked: false,
            notifyID: 'autobuyersSubTabBut',
            parentNotify: 'unitsTabBut',
            idsToShow: ['timeDimBuyerCell'],
            idsToHide: [],
            //classToEnable: 'buyerList',
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(5);
            },
            onUnlock: function() {
                return;
            },
        },
    },
    'buildingsTab': {
        'mainTab': {
            unlocked: false,
            notifyID: 'buildingsTabBut',
            idsToShow: ['buildingsTabCell', 'buildingsTabCellMid', 'brickToggleRow', 'brickGainToggleRow', 'astralNoticeToggleRow'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(11);
            },
            condition: function() {
                return player.spaceResets.gte(1);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['bricksDisplayHeader'] = true;
                player.headerDisplayUnlocked['bricksGainDisplayHeader'] = true;
                player.headerDisplayUnlocked['astralNoticeDisplay'] = true;
            },
        },
        'factory': {
            unlocked: false,
            idsToShow: ['factoryUpgradesRow1', 'factoryHeaderRow'],
            idsToHide: ['factoryBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'factoryRow2': {
            unlocked: false,
            idsToShow: ['factoryUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 11) && isBuilt(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'necropolis': {
            unlocked: false,
            idsToShow: ['necropolisUpgradesRow1', 'necropolisHeaderRow'],
            idsToHide: ['necropolisBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'necropolisRow2': {
            unlocked: false,
            idsToShow: ['necropolisUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(3, 12) && isBuilt(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'sun': {
            unlocked: false,
            idsToShow: ['sunUpgradesRow', 'sunHeaderRow'],
            idsToHide: ['sunBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(3);
            },
            onUnlock: function() {
                return;
            },
        },
        'sunRow2': {
            unlocked: false,
            idsToShow: ['sunUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasTUpgrade(34) && isBuilt(3);
            },
            onUnlock: function() {
                return;
            },
        },
        'construction': {
            unlocked: false,
            notifyID: 'constructionSubTabBut',
            parentNotify: 'buildingsTabBut',
            idsToShow: ['buildingsSubMenu', 'constructionSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasTUpgrade(12);
            },
            condition: function() {
                return player.spaceResets.gte(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'constructionRow2': {
            unlocked: false,
            notifyID: 'constructionSubTabBut',
            parentNotify: 'buildingsTabBut',
            idsToShow: ['cUpgRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortexTable': {
            unlocked: false,
            notifyID: 'buildingsSubTabBut',
            parentNotify: 'buildingsTabBut',
            idsToShow: ['vortexTable', 'vortexBuildRow'],
            idsToHide: [],
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(5);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortex': {
            unlocked: false,
            idsToShow: ['vortexHeaderRow', 'vortexUpgradesRow', 'numWorldsGainDisplay'],
            idsToHide: ['vortexBuildRow'],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isBuilt(4);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortexRow2': {
            unlocked: false,
            idsToShow: ['vortexUpgradesRow2'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isResearchCompleted(6);
            },
            onUnlock: function() {
                return;
            },
        },
    },
    'timeTab': {
        'mainTab': {
            unlocked: false,
            notifyID: 'timeTabBut',
            idsToShow: ['timeTabCell', 'timeTabCellMid', 'timeBoostDisplay', 'crystalsToggleRow', 'timeBoostToggleRow'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasAchievement(13);
            },
            condition: function() {
                return player.spaceResets.gte(3);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['crystalsDisplayHeader'] = true;
                player.headerDisplayUnlocked['timeBoostDisplay'] = true;
            },
        },
        'timeUpgrades': {
            unlocked: false,
            notifyID: 'timeUpgSubTabBut',
            parentNotify: 'timeTabBut',
            idsToShow: ['timeSubMenu', 'timeUpgSubTabBut'],
            idsToHide: [],
            shouldNotify: function() {
                return !hasUpgrade(3, 13);
            },
            condition: function() {
                return hasUpgrade(3, 13);
            },
            onUnlock: function() {
                return;
            },
        },
        'timeUpgrades2': {
            unlocked: false,
            notifyID: 'timeUpgSubTabBut',
            parentNotify: 'timeTabBut',
            idsToShow: ['timeUpgBuyerDiv'],
            idsToHide: [],
            classToShow: 'timeUpgTDs2',
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(6);
            },
            onUnlock: function() {
                return;
            },
        },
        'timeDims2': {
            unlocked: false,
            idsToShow: ['timeRow5', 'timeRow6', 'timeRow7', 'timeRow8', 'dimBuyer5Cell', 'dimBuyer6Cell', 'dimBuyer7Cell', 'dimBuyer8Cell', 'spacer1', 'spacer2', 'spacer3', 'spacer4'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return hasUpgrade(4, 23);
            },
            onUnlock: function() {
                return;
            },
        },
    },
    'galaxyTab': {
        'mainTab': {
            unlocked: false,
            notifyID: 'galaxyTabBut',
            idsToShow: ['galaxyTabCell', 'galaxyTabCellMid', 'galaxiesBonusDisplay', 'last10AscCell', 'ascensionStats', 'totalAscensionsStats', 'spentGalaxiesStats', 'allTimeGalaxies', 'galaxiesToggleRow', 'unspentToggleRow'],
            idsToHide: ['statsAnd'],
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasUpgrade(3, 23);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['galaxiesBonusDisplay'] = true;
                player.headerDisplayUnlocked['unspentGalaxiesHeaderDisplay'] = true;
            },
        },
        'arkTab': {
            unlocked: false,
            notifyID: 'arkSubTabBut',
            parentNotify: 'galaxyTabBut',
            idsToShow: ['galaxiesSubMenu', 'researchToggleRow', 'researchGainToggleRow'],
            idsToHide: [],
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(7);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['researchDisplayHeader'] = true;
                player.headerDisplayUnlocked['researchGainDisplayHeader'] = true;
            },
        },
        'researchTab': {
            unlocked: false,
            notifyID: 'researchSubTabBut',
            parentNotify: 'galaxyTabBut',
            idsToShow: [],
            idsToHide: [],
            shouldNotify: function() {
                return true;
            },
            condition: function() {
                return hasMilestone(7);
            },
            onUnlock: function() {
                return;
            },
        },
        'infiniteResearch': {
            unlocked: false,
            idsToShow: ['infResearchTabCell'],
            idsToHide: [],
            shouldNotify: function() {
                return false;
            },
            condition: function() {
                return isResearchCompleted(6);
            },
            onUnlock: function() {
                return;
            },
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
    'p': {
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
    't': {
        desc: 'Respec Time Production',
        onPress: function() {
            respecTimeKey();
        }
    },
    'n': {
        desc: 'Ascension',
        onPress: function() {
            galaxyPrestigeKey();
        }
    },
    'g': {
        desc: 'Respec Galaxies',
        onPress: function() {
            respecGalaxiesKey();
        }
    },
    'q': {
        desc: 'Units Tab',
        onPress: function() {
            showTab('unitsTab', false, 'unitsTabBut');
        }
    },
    'w': {
        desc: 'Buildings Tab',
        onPress: function() {
            if (player.unlocks['buildingsTab']['mainTab']) { showTab('buildingsTab', false, 'buildingsTabBut'); }
        }
    },
    'e': {
        desc: 'Time Tab',
        onPress: function() {
            if (player.unlocks['timeTab']['mainTab']) { showTab('timeTab', false, 'timeTabBut'); }
        }
    },
    'r': {
        desc: 'Galaxies Tab',
        onPress: function() {
            if (player.unlocks['galaxyTab']['mainTab']) { showTab('galaxyTab', false, 'galaxyTabBut'); }
        }
    },
    'f': {
        desc: 'Cycle Subtabs',
        onPress: function() {
            cycleSubtabs();
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
    START_PLAYER.corpsesAch41 = new Decimal(25000);
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
    START_PLAYER.spaceResets = new Decimal(0);
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
        4: {
            built: false,
            amount: new Decimal(0),
            progress: new Decimal(0),
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
        5: new Decimal(0),
        6: new Decimal(0),
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
        5: {
            unlocked: true,
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
        41: false,
        42: false,
        43: false,
        44: false,
        51: false,
        52: false,
        53: false,
        54: false,
    });

    copyData(START_PLAYER.autobuyers, {
        1: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        2: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        3: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        4: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        5: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        6: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        7: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        8: {
            'on': false,
            'fast': false,
            'bulk': false,
        },
        9: {
            'on': false,
            'fast': false,
            'amount': new Decimal(1),
            'type': 'atx',
        },
        10: {
            'on': false,
            'fast': false,
            'max': new Decimal(0),
        },
        11: {
            'on': false,
            'fast': false,
            'amount': new Decimal(1),
        },
        12: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
        },
        'time': {
            'on': false,
        },
        priority: [1, 2, 3, 4, 5, 6, 7, 8],
    });

    copyData(START_PLAYER.pastRuns, {
        lastRun: {
            crystalGain: new Decimal(0),
            timeSpent: 0,
            timeSacrificed: new Date(),
        },
        lastTen: [
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
            {
                crystalGain: new Decimal(0),
                timeSpent: 0,
                timeSacrificed: new Date(),
            },
        ],
    });

    copyData(START_PLAYER.pastAscRuns, {
        lastRun: {
            galaxyGain: new Decimal(0),
            timeSpent: 0,
            timeAscended: new Date(),
        },
        lastTen: [
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
            {
                galaxyGain: new Decimal(0),
                timeSpent: 0,
                timeAscended: new Date(),
            },
        ],
    });

    copyData(START_PLAYER.galaxyUpgs, {
        1: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        2: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        3: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
        4: {
            11: {
                bought: false,
                locked: false,
            },
            21: {
                bought: false,
                locked: false,
            },
            22: {
                bought: false,
                locked: false,
            },
            31: {
                bought: false,
                locked: false,
            },
            32: {
                bought: false,
                locked: false,
            },
            41: {
                bought: false,
                locked: false,
            },
        },
    });

    copyData(START_PLAYER.ark, {
        'engines': {
            unlocked: false,
            bought: false,
        },
        'thrusters': {
            unlocked: false,
            bought: false,
        },
        'support': {
            unlocked: false,
            bought: false,
        },
        'railguns': {
            unlocked: false,
            bought: false,
        },
        'torpedos': {
            unlocked: false,
            bought: false,
        },
        'navigation': {
            unlocked: false,
            bought: false,
        },
    });

    copyData(START_PLAYER.ethUpgs, {
        11: false,
        12: false,
        13: false,
        14: false,
    });

    copyData(START_PLAYER.researchProjects, {
        1: {
            active: false,
            completed: false,
        },
        2: {
            active: false,
            completed: false,
        },
        3: {
            active: false,
            completed: false,
        },
        4: {
            active: false,
            completed: false,
        },
        5: {
            active: false,
            completed: false,
        },
        6: {
            active: false,
            completed: false,
        },
        7: {
            active: false,
            completed: false,
        },
    });

    START_PLAYER.isInResearch = false;
    START_PLAYER.research = new Decimal(0),

    START_PLAYER.bricks = new Decimal(0);
    START_PLAYER.brickGainExp = 0.2;
    START_PLAYER.astralFlag = false;

    START_PLAYER.crystals = new Decimal(0);
    START_PLAYER.milesCrystals = new Decimal(11111);
    START_PLAYER.trueEssence = new Decimal(0);
    START_PLAYER.truePercent = 50;
    START_PLAYER.antiPercent = 50;
    START_PLAYER.antiEssence = new Decimal(0);
    START_PLAYER.timeResets = new Decimal(0);
    START_PLAYER.timeLocked = false;

    START_PLAYER.galaxies = new Decimal(0);
    START_PLAYER.spentGalaxies = new Decimal(0);
    START_PLAYER.ascensions = new Decimal(0);

    START_PLAYER.research = new Decimal(0);
    START_PLAYER.isInResearch = false;
    START_PLAYER.theorems = new Decimal(0);
    START_PLAYER.infCompletions = new Decimal(0);

    START_PLAYER.win = false;
    START_PLAYER.continue = false;
    
    copyData(START_PLAYER.allTimeStats, {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),
        totalTimeResets: new Decimal(0),
        totalCrystals: new Decimal(0),
        totalGalaxies: new Decimal(0),
        totalSpentGalaxies: new Decimal(0),
        totalAscensions: new Decimal(0),

        bestCrystalGain: new Decimal(0),
        bestCrystalRate: new Decimal(0),
        bestGalaxyGain: new Decimal(0),
        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),
        bestCrystals: new Decimal(0),
        bestGalaxies: new Decimal(0),
    });

    copyData(START_PLAYER.thisSacStats, {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),

        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),

        wentAstral: false,
    });

    copyData(START_PLAYER.thisAscStats, {
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

        wentAstral: false,
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
            'ascensionBuyer': false,
            'timeDimBuyer': false,
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
            'constructionRow2': false,
            'vortexTable': false,
            'vortex': false,
        },
        'timeTab': {
            'mainTab': false,
            'timeUpgrades': false,
            'timeUpgrades2': false,
            'timeDims2': false,
        },
        'galaxyTab': {
            'mainTab': false,
            'customizeDisplay': false,
            'arkTab': false,
            'researchTab': false,
        },
    });

    copyData(START_PLAYER.achievements, {
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        31: false,
        32: false,
        33: false,
        34: false,
        35: false,
        41: false,
        42: false,
        43: false,
        44: false,
        45: false,
        51: false,
        52: false,
        53: false,
        54: false,
        55: false,
        61: false,
        62: false,
        63: false,
        64: false,
        65: false,
        71: false,
        72: false,
        73: false,
        74: false,
        75: false,
    });

    copyData(START_PLAYER.milestones, {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
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
        'galaxyPrestige': {
            'click': true,
            'key': true,
        },
        'galaxyRespec': {
            'click': true,
            'key': true,
        },
    });

    copyData(START_PLAYER.headerDisplay, {
        'autosavePopup': true,
        'astralNoticeDisplay': true,
        'unitsBoostDisplay': true,
        'achBoostDisplay': false,
        'worldsBonusDisplay': true,
        'galaxiesBonusDisplay': true,
        'totalBonusDisplay': true,
        'bricksDisplayHeader': false,
        'bricksGainDisplayHeader': false,
        'crystalsDisplayHeader': false,
        'timeBoostDisplay': true,
        'unspentGalaxiesHeaderDisplay': false,
        'researchDisplayHeader': false,
        'researchGainDisplayHeader': false,
    });

    copyData(START_PLAYER.headerDisplayUnlocked, {
        'autosavePopup': true,
        'astralNoticeDisplay': false,
        'unitsBoostDisplay': true,
        'achBoostDisplay': true,
        'worldsBonusDisplay': false,
        'galaxiesBonusDisplay': false,
        'totalBonusDisplay': true,
        'bricksDisplayHeader': false,
        'bricksGainDisplayHeader': false,
        'crystalsDisplayHeader': false,
        'timeBoostDisplay': false,
        'unspentGalaxiesHeaderDisplay': false,
        'researchDisplayHeader': false,
        'researchGainDisplayHeader': false,
    });

    START_PLAYER.tooltipsEnabled = false;
    START_PLAYER.displayRealTime = false;
    START_PLAYER.activeTabs = new Array('unitsTab', 'unitsSubTab', 'buildingsSubTab', 'timeDimSubTab', 'galaxiesSubTab', 'statSubTab');
    START_PLAYER.activeGalaxies = new Array(4, 'gal1', 'gal2');
    START_PLAYER.hotkeysOn = true;
    START_PLAYER.dontResetSlider = false;
    START_PLAYER.favGalaxies = [[], [], []];
    START_PLAYER.favGalNames = ['Slot 1', 'Slot 2', 'Slot 3'];
    START_PLAYER.version = 'v0.3.1_d.5';

    fixData(player, START_PLAYER);
    save();
}