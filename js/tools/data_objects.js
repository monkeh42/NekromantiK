var START_PLAYER = {
    layerDisplay: {
        numClass: 'defNum',
    },
    corpses: new Decimal(0),
    corpsesAch13: new Decimal(10),
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
        
        priority: ['1', '2', '3', '4', '5', '6', '7', '8'],
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

    stats: {
        'allTimeStats': {
            displayStats: function() { return true; },
            label: 'All Time',

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

        'thisSacStats': {
            displayStats: function() { return player.stats['allTimeStats'].totalTimeResets.gt(0); },
            label: 'This Sacrifice',

            totalCorpses: new Decimal(0),
            totalWorlds: new Decimal(0),
            totalBricks: new Decimal(0),
            totalSpaceResets: new Decimal(0),

            bestCorpses: new Decimal(0),
            bestWorlds: new Decimal(0),
            bestBricks: new Decimal(0),

            wentAstral: false,
        },

        'thisAscStats': {
            displayStats: function() { return player.stats['allTimeStats'].totalAscensions.gt(0); },
            label: 'This Ascension',

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
        'units': true,
        'spacePrestige': false,  
        'autobuyers': false,
        'fastBuyers': false,
        'bulkBuyers': false,
        'prestigeBuyer': false,
        'advancedBuyer': false,
        'ascensionBuyer': false,
        'timeDimBuyer': false,
        'buildings': false,
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
        'time': false,
        'timeUpgrades': false,
        'timeUpgrades2': false,
        'timeDims2': false,
        'galaxies': false,
        'research': false,
        'infResearch': false,
        'ark': false,
    },

    achievements: {
        rowsUnlocked: {
            1: true,
            2: true,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
        },
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
            unlocked: true,
            'click': true,
            'key': true,
        },
        'timePrestige': {
            unlocked: false,
            'click': true,
            'key': true,
        },
        'timeRespec': {
            unlocked: false,
            'click': true,
            'key': true,
        },
        'galaxyPrestige': {
            unlocked: false,
            'click': true,
            'key': true,
        },
        'galaxyRespec': {
            unlocked: false,
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

    tabNotify: {
        milestones: false,
        ach: {
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
        'u': {
            notify: false,
            indirect: false,
            'u': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        'b': {
            notify: false,
            indirect: false,
            'b': {
                notify: false,
                indirect: false,
            },
            'c': {
                notify: false,
                indirect: false,
            },
        },
        't': {
            notify: false,
            indirect: false,
            'd': {
                notify: false,
                indirect: false,
            },
            'u': {
                notify: false,
                indirect: false,
            },
        },
        'g': {
            notify: false,
            indirect: false,
            'g': {
                notify: false,
                indirect: false,
            },
            'r': {
                notify: false,
                indirect: false,
            },
            'i': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        's': {
            notify: false,
            indirect: false,
            's': {
                notify: false,
                indirect: false,
            },
            'l': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        'o': {
            notify: false,
            indirect: false,
        },
        'h': {
            notify: false,
            indirect: false,
        },
    },

    tooltipsEnabled: false,
    displayRealTime: false,
    tab: 'unitsTab',
    subTabs: { 'u': 'unitsSubTab', 'b': 'buildingsSubTab', 't': 'timeDimSubTab', 'g': 'galaxiesSubTab', 's': 'statSubTab' },
    activeGalaxies: ['4', '1', '2'],
    hotkeysOn: true,
    dontResetSlider: false,
    favGalaxies: [[], [], []],
    favGalNames: ['Slot 1', 'Slot 2', 'Slot 3'],
    help: false,
    version: 'v1.1.1',
}

var STAT_KEYS = {
    1: ['corpses', 'totalCorpses', 'bestCorpses'],
    2: ['astral bricks', 'totalBricks', 'bestBricks'],
    3: ['exterminated worlds', 'totalWorlds', 'bestWorlds'],
    4: ['time crystals', 'totalCrystals', 'bestCrystals'],
    5: ['depleted galaxies', 'totalGalaxies', 'bestGalaxies'],
}

var HEADER_DATA = {
    rows: 14,
    1: {
        id:'autosavePopup',
        text: 'Autosave notification',
    },
    2: {
        id:'astralNoticeDisplay',
        text: 'Astral enslavement notice',
    },
    3: {
        id:'unitsBoostDisplay',
        text: 'Boost from units',
    },
    4: {
        id:'achBoostDisplay',
        text: 'Boost from achievements',
    },
    5: {
        id:'worldsBonusDisplay',
        text: 'Boost from worlds',
    },
    6: {
        id:'galaxiesBonusDisplay',
        text: 'Boost from galaxies',
    },
    7: {
        id:'totalBonusDisplay',
        text: 'Total corpse boost',
    },
    8: {
        id:'bricksDisplayHeader',
        text: 'Astral brick amount',
    },
    9: {
        id:'bricksGainDisplayHeader',
        text: 'Astral brick gain',
    },
    10: {
        id:'crystalsDisplayHeader',
        text: 'Time crystal amount',
    },
    11: {
        id:'timeBoostDisplay',
        text: 'Time speed boost',
    },
    12: {
        id:'unspentGalaxiesHeaderDisplay',
        text: 'Unspent galaxies',
    },
    13: {
        id:'researchDisplayHeader',
        text: 'Void research amount',
    },
    14: {
        id:'researchGainDisplayHeader',
        text: 'Void research gain',
    },
}

var AUTOBUYERS_DATA = {
    1: {
        headerText: 'Zombies',
        prefixText: 'zombie',
    },
    2: {
        headerText: 'Abominations',
        prefixText: 'abomination',
    },
    3: {
        headerText: 'Skeleton Mages',
        prefixText: 'skeletonmage',
    },
    4: {
        headerText: 'Banshees',
        prefixText: 'banshee',
    },
    5: {
        headerText: 'Liches',
        prefixText: 'lich',
    },
    6: {
        headerText: 'Behemoths',
        prefixText: 'behemoth',
    },
    7: {
        headerText: 'Ancient Ones',
        prefixText: 'ancientone',
    },
    8: {
        headerText: 'Sun Eaters',
        prefixText: 'suneater',
    },
    9: {
        headerText: 'Sacrifice',
        prefixText: 'sacrifice',
        labelTexts: {
            'atx': 'at x crystals',
            'xtimes': 'at x times last',
            'afterx': 'after x seconds',
        },
    },
    10: {
        headerText: 'World Prestige',
        prefixText: 'prestige',
    },
    11: {
        headerText: 'Ascension',
        prefixText: 'ascension',
    },
    12: {
        headerText: 'Time Dimensions',
        prefixText: 'timeDim',
        1: 'first:',
        2: 'second:',
        3: 'third:',
        4: 'fourth:',
        5: 'fifth:',
        6: 'sixth:',
        7: 'seventh:',
        8: 'eighth:',
    },
    multi: {
        rows: 3,
        cols: 4,
        idPre: 'autobuyer',
        klass: function() { return 'autobuyerOptions' },
        numBoxes: 12,
        numElsByBox: function(i) {
            return Object.keys(this.dataLists[i]).length;
        },
        boxUnlocked: function(i) {
            if (i<33) { return true; }
            else {
                if (i==33) { return player.unlocks['ascensionBuyer']; }
                else if (i==34) { return player.unlocks['timeDimBuyer']; }
            }
        },
        showEl: function(id, i) {
            if (id==32&&i==5) { return player.unlocks['prestigeBuyer']; }
            else { return true; }
        },
        dataLists: {
            11: {
                1: {
                    id: 1,
                    boxID: 1,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Zombies'; }
                },
                2: {
                    id: 2,
                    boxID: 1,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 1,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 1,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 1,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            12: {
                1: {
                    id: 1,
                    boxID: 2,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Abominations'; }
                },
                2: {
                    id: 2,
                    boxID: 2,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 2,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 2,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 2,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            13: {
                1: {
                    id: 1,
                    boxID: 3,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Skeleton Mages'; }
                },
                2: {
                    id: 2,
                    boxID: 3,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 3,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 3,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 3,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            14: {
                1: {
                    id: 1,
                    boxID: 4,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Banshees'; }
                },
                2: {
                    id: 2,
                    boxID: 4,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 4,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 4,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 4,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            21: {
                1: {
                    id: 1,
                    boxID: 5,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Liches'; }
                },
                2: {
                    id: 2,
                    boxID: 5,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 5,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 5,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 5,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            22: {
                1: {
                    id: 1,
                    boxID: 6,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Behemoths'; }
                },
                2: {
                    id: 2,
                    boxID: 6,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 6,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 6,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 6,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            23: {
                1: {
                    id: 1,
                    boxID: 7,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Ancient Ones'; }
                },
                2: {
                    id: 2,
                    boxID: 7,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 7,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 7,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 7,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            24: {
                1: {
                    id: 1,
                    boxID: 8,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Sun Eaters'; }
                },
                2: {
                    id: 2,
                    boxID: 8,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 8,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 8,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'max'; }
                },
                5: {
                    id: 5,
                    boxID: 8,
                    tag: 'unit-buyer-priority',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            31: {
                1: {
                    id: 1,
                    boxID: 9,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Sacrifice'; }
                },
                2: {
                    id: 2,
                    boxID: 9,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 9,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 9,
                    tag: 'sacrifice-buyer-options',
                    klass: function() { return ``; },
                    htm: function() { return ''; }
                },
            },
            32: {
                1: {
                    id: 1,
                    boxID: 10,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'World Prestige'; }
                },
                2: {
                    id: 2,
                    boxID: 10,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 10,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 10,
                    tag: 'buyer-amount',
                    klass: function() { return ``; },
                    htm: function() { return 'max auto prestiges:'; }
                },
                5: {
                    id: 5,
                    boxID: 10,
                    tag: 'div',
                    klass: function() { return 'prestigeLockScreen'; },
                    htm: function() { return ''; }
                },
            },
            33: {
                1: {
                    id: 1,
                    boxID: 11,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Ascension'; }
                },
                2: {
                    id: 2,
                    boxID: 11,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'on'; }
                },
                3: {
                    id: 3,
                    boxID: 11,
                    tag: 'unit-buyer-button',
                    klass: function() { return ``; },
                    htm: function() { return 'fast'; }
                },
                4: {
                    id: 4,
                    boxID: 11,
                    tag: 'buyer-amount',
                    klass: function() { return ``; },
                    htm: function() { return 'at x galaxies:'; }
                },
            },
            34: {
                1: {
                    id: 1,
                    boxID: 12,
                    tag: 'h2',
                    klass: function() { return ''; },
                    htm: function() { return 'Time Dimensions'; }
                },
                2: {
                    id: 2,
                    boxID: 12,
                    tag: 'dim-buyer-buttons',
                    klass: function() { return ''; },
                    htm: function() { return ''; }
                },
                3: {
                    id: 3,
                    boxID: 12,
                    tag: 'dim-buyer-buttons',
                    klass: function() { return ''; },
                    htm: function() { return ''; }
                },
                4: {
                    id: 4,
                    boxID: 12,
                    tag: 'dim-buyer-buttons',
                    klass: function() { return ''; },
                    htm: function() { return ''; }
                },
                5: {
                    id: 5,
                    boxID: 12,
                    tag: 'dim-buyer-buttons',
                    klass: function() { return ''; },
                    htm: function() { return ''; }
                },
                6: {
                    id: 6,
                    boxID: 12,
                    tag: 'dim-buyer-buttons',
                    klass: function() { return ''; },
                    htm: function() { return ''; }
                },
            },
        },
    },
}

var TABS_DATA = {
    'u': {
        title: 'UNITS',
        pid: 'unitsTab',
        condition: function() { return true; },
        unlocked: function() { return true; },
        subUnlocked: function() { return player.unlocks['autobuyers'] },
        subTabs: {
            units: {
                title: 'UNITS',
                pid: 'unitsSubTab',
                condition: function() { return true; },
                unlocked: function() { return true; },
            },
            autobuyers: {
                title: 'AUTOBUYERS',
                pid: 'autobuyersSubTab',
                condition: function() { return (hasTUpgrade(13)||hasAchievement(42)); },
                unlocked: function() { return player.unlocks['autobuyers']; },
            },
        },
    },
    'b': {
        title: 'BUILDINGS',
        pid: 'buildingsTab',
        condition: function() { return player.spaceResets.gte(1); },
        unlocked: function() { return player.unlocks['buildings']; },
        subUnlocked: function() { return player.unlocks['construction'] },
        subTabs: {
            buildings: {
                title: 'BUILDINGS',
                pid: 'buildingsSubTab',
                condition: function() { return player.spaceResets.gte(1); },
                unlocked: function() { return true; },
            },
            construction: {
                title: 'CONSTRUCTION',
                pid: 'constructionSubTab',
                condition: function() { return (player.spaceResets.gte(2)||hasMilestone(1)); },
                unlocked: function() { return player.unlocks['construction']; },
            },
        },
    },
    't': {
        title: 'TIME WARP',
        pid: 'timeTab',
        condition: function() { return player.spaceResets.gte(3); },
        unlocked: function() { return player.unlocks['time']; },
        subUnlocked: function() { return player.unlocks['timeUpgrades'] },
        subTabs: {
            dims: {
                title: 'TIME DIMENSIONS',
                pid: 'timeDimSubTab',
                condition: function() { return player.spaceResets.gte(3); },
                unlocked: function() { return true; },
            },
            upgs: {
                title: 'TIME UPGRADES',
                pid: 'timeUpgSubTab',
                condition: function() { return (hasUpgrade(3, 13)||hasAchievement(43)); },
                unlocked: function() { return player.unlocks['timeUpgrades']; },
            },
        },
    },
    'g': {
        title: 'GALAXIES',
        pid: 'galaxyTab',
        condition: function() { return hasUpgrade(3, 23); },
        unlocked: function() { return player.unlocks['galaxies']; },
        subUnlocked: function() { return player.unlocks['research'] },
        subTabs: {
            galaxies: {
                title: 'GALAXIES',
                pid: 'galaxiesSubTab',
                condition: function() { return hasUpgrade(3, 23); },
                unlocked: function() { return true; },
            },
            research: {
                title: 'VOID RESEARCH',
                pid: 'researchSubTab',
                condition: function() { return hasMilestone(7); },
                unlocked: function() { return player.unlocks['research']; },
            },
            infResearch: {
                title: 'INFINITE RESEARCH',
                pid: 'infResearchSubTab',
                condition: function() { return isResearchCompleted(6); },
                unlocked: function() { return player.unlocks['infResearch']; },
            },
            ark: {
                title: 'THE ARK',
                pid: 'arkSubTab',
                condition: function() { return hasMilestone(7); },
                unlocked: function() { return player.unlocks['ark']; },
            },
        },
    },
    's': {
        title: 'STATS ETC',
        pid: 'statsTab',
        condition: function() { return true; },
        unlocked: function() { return true; },
        subUnlocked: function() { return true },
        subTabs: {
            stats: {
                title: 'STATS',
                pid: 'statSubTab',
                condition: function() { return true; },
                unlocked: function() { return true; },
            },
            lastTen: {
                title: 'LAST 10 SAC.',
                pid: 'last10SubTab',
                condition: function() { return player.stats['allTimeStats'].totalTimeResets.gt(0); },
                unlocked: function() { return player.unlocks['time']; },
            },
            lastTenA: {
                title: 'LAST 10 ASC.',
                pid: 'last10AscSubTab',
                condition: function() { return player.stats['allTimeStats'].totalAscensions.gt(0);; },
                unlocked: function() { return player.unlocks['galaxies']; },
            },
            achievements: {
                title: 'ACHIEVEMENTS',
                pid: 'achSubTab',
                condition: function() { return true; },
                unlocked: function() { return true; },
            },
        },
    },
    'o': {
        title: 'OPTIONS',
        pid: 'optionsTab',
        condition: function() { return true; },
        unlocked: function() { return true; },
        subTabs: {},
    },
    'h': {
        title: 'HELP',
        pid: 'helpDiv',
        condition: function() { return true; },
        unlocked: function() { return true; },
        subTabs: {},
    },
}

var OPTIONS_DATA = {
    rows: 3,
    cols: 4,
    11: {
        title: 'MANUAL SAVE',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { manualSave() },
    },
    12: {
        title: 'MANUAL LOAD',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { manualLoad() },
    },
    13: {
        title: 'CHANGELOG',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { window.open('/docs/changelog.html', '_blank'); },
    },
    14: {
        title: 'HELP (full text)',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { window.open('/docs/nekro_help.html', '_blank'); },
    },
    21: {
        title: 'EXPORT SAVE',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { exportSave() },
    },
    22: {
        title: 'IMPORT SAVE',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { importToggle() },
    },
    23: {
        title: 'HARD RESET',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { hardResetClick(); },
    },
    24: {
        title: 'CUSTOMIZE HEADER',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { showNormalPopup('hpop'); },
    },
    31: {
        title: 'TOGGLE CONFIRMATIONS',
        altTitle: '',
        altToggle: function() { return false; },
        fxn: function() { showNormalPopup('cpop'); },
    },
    32: {
        title: 'FORMULA TOOLTIPS: OFF',
        altTitle: 'FORMULA TOOLTIPS: ON',
        altToggle: function() { return player.tooltipsEnabled; },
        fxn: function() { toggleTooltips() },
    },
    33: {
        title: 'ENABLE HOTKEYS: ON',
        altTitle: 'ENABLE HOTKEYS: OFF',
        altToggle: function() { return !player.hotkeysOn; },
        fxn: function() { toggleHotkeys(); },
    },
    34: {
        title: 'TIME DISPLAYS: GAME TIME',
        altTitle: 'TIME DISPLAYS: REAL TIME',
        altToggle: function() { return player.displayRealTime; },
        fxn: function() { toggleRealTimeDisplays() },
    },
}

var MILES_DATA = {
    1: {
        id: 1,
        reqText: 'Own four 1st row upgrades.',
        rewardText: 'Unlock two more construction upgrades, and construction is never reset.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(1) == 4;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    2: {
        id: 2,
        reqText: 'Complete one upgrade tree.',
        rewardText: 'Unlock the ascension autobuyer, and you keep <span style="font-weight: 900;">World Stasis 1-3</span> and <span style="font-weight: 900;">Star Stasis</span> permanently.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 1;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    3: {
        id: 3,
        reqText: 'Own four 2nd row upgrades.',
        rewardText: 'The corpse boost from galaxies is 1.5x stronger, and you keep <span style="font-weight: 900;">Rapid Fire</span> permanently.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(2) == 4;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    4: {
        id: 4,
        reqText: 'Complete two upgrade trees.',
        rewardText: 'Start every ascension with 11,111 time crystals.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 2;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    5: {
        id: 5,
        reqText: 'Own four 3rd row upgrades.',
        rewardText: 'Unlock a fourth building and the time dimension autobuyer.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(3) == 4;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    6: {
        id: 6,
        reqText: 'Complete three upgrade trees.',
        rewardText: 'Unlock two more columns of time upgrades and the time upgrade (cols 1-3) autobuyer.',
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 3;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
    7: {
        reqText: 'Own four 4th row upgrades.',
        rewardText: 'Unlock <span style="font-weight: 900;">Void Research</span> and <span style="font-weight: 900;">The Ark</span>.',
        id: 7,
        canUnlock: function() {
            return getBoughtGUpgsByRow(4) == 4;
        },
        unlocked: function() { return player.milestones[this.id]; }
    },
}

var ACH_DATA = {
    rows: 7,
    cols: 5,
    rowUnlocks: {
        1: {
            condition: function() { return true; },
            unlocked: function() { return player.achievements.rowsUnlocked[1] }
        },
        2: {
            condition: function() { return true; },
            unlocked: function() { return player.achievements.rowsUnlocked[2] }
        },
        3: {
            condition: function() { return hasAchievement(15); },
            unlocked: function() { return player.achievements.rowsUnlocked[3] }
        },
        4: {
            condition: function() { return hasAchievement(31); },
            unlocked: function() { return player.achievements.rowsUnlocked[4] }
        },
        5: {
            condition: function() { return hasAchievement(31); },
            unlocked: function() { return player.achievements.rowsUnlocked[5] }
        },
        6: {
            condition: function() { return hasAchievement(51); },
            unlocked: function() { return player.achievements.rowsUnlocked[6] }
        },
        7: {
            condition: function() { return hasAchievement(61); },
            unlocked: function() { return player.achievements.rowsUnlocked[7] }
        },
    },
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
            return player.unlocks['buildings'];
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
            return player.unlocks['construction'];
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
        reward: 'You start all resets with 10 corpses.',
        showEffect: false,
        hasReward: true,
        divID: 'ach13',
        canUnlock: function() {
            return player.unlocks['time'];
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
            let e = new Decimal(player.stats['thisSacStats'].bestBricks);
            return e.pow(0.2);
        },
        onUnlock: function() {
            return;
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
            return player.unlocks['timeUpgrades'];
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
            return player.stats['allTimeStats'].totalTimeResets.gte(15);
        },
        effect: function() {
            let e = new Decimal(player.stats['allTimeStats'].totalTimeResets);
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
            return (player.corpses.gte(1e100) && player.stats['thisSacStats'].totalBricks.eq(0));
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
            return DATA.u[1].mult().gte(10000) && !player.unlocks['time'];
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
            return player.stats['thisAscStats'].totalTimeResets.gt(0) && !player.stats['thisAscStats'].wentAstral;
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
            return player.stats['allTimeStats'].bestGalaxyGain.gt(1);
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
        desc: 'Trigger the galaxy effect softcap, or complete all six research projects without triggering it.',
        secret: false,
        hint: '',
        reward: '',
        hasReward: false,
        showEffect: false,
        divID: 'ach62',
        canUnlock: function() {
            let allProjs = true;
            for (let i=1; i<=6; i++) {
                if (!isResearchCompleted(i)) { allProjs = false; }
            }
            return (isSoftcapActive(getGalaxiesBonusNoSC())||allProjs);
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
            let e = new Decimal(player.stats['allTimeStats'].totalAscensions);
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

var UNLOCKS_DATA = {
    confirmations: {
        rows: 5,
        1: {
            text: 'World Prestige',
            id: 'worldPrestige',
        },
        2: {
            text: 'Sacrifice',
            id: 'timePrestige', 
        },
        3: {
            text: 'Respec Time',
            id: 'timeRespec', 
        },
        4: {
            text: 'Ascension',
            id: 'galaxyPrestige', 
        },
        5: {
            text: 'Respec Galaxies',
            id: 'galaxyRespec', 
        },
    },
    units: {
        1: function() {
            return true;
        },
        2: function() {
            return player.units[1].bought.gt(0);
        },
        3: function() {
            return player.units[2].bought.gt(0);
        },
        4: function() {
            return player.units[3].bought.gt(0);
        },
        5: function() {
            return player.units[4].bought.gt(0);
        },
        6: function() {
            return (player.units[5].bought.gt(0)&&player.spaceResets.gt(0));
        },
        7: function() {
            return (player.units[6].bought.gt(0)&&player.spaceResets.gt(1));
        },
        8: function() {
            return (player.units[7].bought.gt(0)&&player.spaceResets.gt(2));
        },
    },
    dimensions: {
        1: function() {
            return true;
        },
        2: function() {
            return player.timeDims[1].bought.gt(0);
        },
        3: function() {
            return player.timeDims[2].bought.gt(0);
        },
        4: function() {
            return player.timeDims[3].bought.gt(0);
        },
        5: function() {
            return (player.timeDims[4].bought.gt(0)&&player.unlocks['timeDims2']);
        },
        6: function() {
            return (player.timeDims[5].bought.gt(0)&&player.unlocks['timeDims2']);
        },
        7: function() {
            return (player.timeDims[6].bought.gt(0)&&player.unlocks['timeDims2']);
        },
        8: function() {
            return (player.timeDims[7].bought.gt(0)&&player.unlocks['timeDims2']);
        },
    },
    main: {
        'units': {
            condition: function() {
                return true;
            },
            onUnlock: function() {
                return;
            },
        }, 
        'spacePrestige': {
            condition: function() {
                return player.units[4].bought.gte(1) || player.ascensions.gt(0);
            },
            onUnlock: function() {
                player.headerDisplayUnlocked['worldsBonusDisplay'] = true;
            },
        },  
        'autobuyers': {
            notify: 'a',
            indirect: 'u',
            condition: function() {
                return hasTUpgrade(13);
            },
            onUnlock: function() {
                player.tabNotify[this.indirect].indirect = true;
                player.tabNotify[this.indirect][this.notify].notify = true;
            },
        },
        'fastBuyers': {
            condition: function() {
                return hasTUpgrade(24);
            },
            onUnlock: function() {
                return;
            },
        },
        'bulkBuyers': {
            condition: function() {
                return hasTUpgrade(33);
            },
            onUnlock: function() {
                return;
            },
        },
        'prestigeBuyer': {
            condition: function() {
                return hasTUpgrade(34);
            },
            onUnlock: function() {
                return;
            },
        },
        'advancedBuyer': {
            condition: function() {
                return hasUpgrade(3, 22);
            },
            onUnlock: function() {
                return;
            },
        },
        'ascensionBuyer': {
            condition: function() {
                return hasMilestone(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'timeDimBuyer': {
            condition: function() {
                return hasMilestone(5);
            },
            onUnlock: function() {
                return;
            },
        },
        'buildings': {
            notify: 'b',
            shouldNotify: function() {
                return !hasTUpgrade(11);
            },
            condition: function() {
                return player.spaceResets.gte(1);
            },
            onUnlock: function() {
                if (player.stats['allTimeStats'].totalAscensions.lte(0)&&!hasTUpgrade(11)) { player.tabNotify[this.notify].notify = true; }
                player.headerDisplayUnlocked['bricksDisplayHeader'] = true;
                player.headerDisplayUnlocked['bricksGainDisplayHeader'] = true;
                player.headerDisplayUnlocked['astralNoticeDisplay'] = true;
            },
        },
        'factory': {
            condition: function() {
                return isBuilt(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'factoryRow2': {
            condition: function() {
                return hasUpgrade(3, 11) && isBuilt(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'necropolis': {
            condition: function() {
                return isBuilt(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'necropolisRow2': {
            condition: function() {
                return hasUpgrade(3, 12) && isBuilt(2);
            },
            onUnlock: function() {
                return;
            },
        },
        'sun': {
            condition: function() {
                return isBuilt(3);
            },
            onUnlock: function() {
                return;
            },
        },
        'sunRow2': {
            condition: function() {
                return hasTUpgrade(34) && isBuilt(3);
            },
            onUnlock: function() {
                return;
            },
        },
        'construction': {
            notify: 'c',
            indirect: 'b',
            shouldNotify: function() {
                return !hasTUpgrade(12);
            },
            condition: function() {
                return player.spaceResets.gte(2);
            },
            onUnlock: function() {
                if (player.stats['allTimeStats'].totalAscensions.lte(0)&&!hasTUpgrade(12)) {
                    player.tabNotify[this.indirect].indirect = true;
                    player.tabNotify[this.indirect][this.notify].notify = true;
                }
            },
        },
        'constructionRow2': {
            condition: function() {
                return hasMilestone(1);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortexTable': {
            condition: function() {
                return hasMilestone(5);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortex': {
            condition: function() {
                return isBuilt(4);
            },
            onUnlock: function() {
                return;
            },
        },
        'vortexRow2': {
            condition: function() {
                return isResearchCompleted(6);
            },
            onUnlock: function() {
                return;
            },
        },
        'time': {
            notify: 't',
            shouldNotify: function() {
                return !hasAchievement(13);
            },
            condition: function() {
                return player.spaceResets.gte(3);
            },
            onUnlock: function() {
                if (player.stats['allTimeStats'].totalAscensions.lte(0)) { player.tabNotify[this.notify].notify = true; }
                player.headerDisplayUnlocked['crystalsDisplayHeader'] = true;
                player.headerDisplayUnlocked['timeBoostDisplay'] = true;
                player.confirmations['timePrestige'].unlocked = true;
                player.confirmations['timeRespec'].unlocked = true;
            },
        },
        'timeUpgrades': {
            notify: 'u',
            indirect: 't',
            shouldNotify: function() {
                return !hasUpgrade(3, 13);
            },
            condition: function() {
                return hasUpgrade(3, 13);
            },
            onUnlock: function() {
                if (player.stats['allTimeStats'].totalAscensions.lte(0)) { 
                    player.tabNotify[this.indirect].indirect = true;
                    player.tabNotify[this.indirect][this.notify].notify = true;
                }
            },
        },
        'timeUpgrades2': {
            notify: 'u',
            indirect: 't',
            condition: function() {
                return hasMilestone(6);
            },
            onUnlock: function() {
                player.tabNotify[this.indirect].indirect = true;
                player.tabNotify[this.indirect][this.notify].notify = true;
            },
        },
        'timeDims2': {
            //idsToShow: ['dimBuyer5Cell', 'dimBuyer6Cell', 'dimBuyer7Cell', 'dimBuyer8Cell', 'spacer1', 'spacer2', 'spacer3', 'spacer4'], //'timeRow5', 'timeRow6', 'timeRow7', 'timeRow8', 
            condition: function() {
                return hasUpgrade(4, 23);
            },
            onUnlock: function() {
                return;
            },
        },
        'galaxies': {
            notify: 'g',
            condition: function() {
                return hasUpgrade(3, 23);
            },
            onUnlock: function() {
                player.tabNotify[this.notify].notify = true;
                player.headerDisplayUnlocked['galaxiesBonusDisplay'] = true;
                player.headerDisplayUnlocked['unspentGalaxiesHeaderDisplay'] = true;
                player.confirmations['galaxyPrestige'].unlocked = true;
                player.confirmations['galaxyRespec'].unlocked = true;
            },
        },
        'ark': {
            notify: 'a',
            indirect: 'g',
            condition: function() {
                return hasMilestone(7);
            },
            onUnlock: function() {
                player.tabNotify[this.indirect].indirect = true;
                player.tabNotify[this.indirect][this.notify].notify = true;
                player.headerDisplayUnlocked['researchDisplayHeader'] = true;
                player.headerDisplayUnlocked['researchGainDisplayHeader'] = true;
            },
        },
        'research': {
            notify: 'r',
            indirect: 'g',
            condition: function() {
                return hasMilestone(7);
            },
            onUnlock: function() {
                player.tabNotify[this.indirect].indirect = true;
                player.tabNotify[this.indirect][this.notify].notify = true;
            },
        },
        'infResearch': {
            notify: 'i',
            indirect: 'g',
            condition: function() {
                return isResearchCompleted(6);
            },
            onUnlock: function() {
                player.tabNotify[this.indirect].indirect = true;
                player.tabNotify[this.indirect][this.notify].notify = true;
            },
        },
    },
}



var HOTKEYS = {
    '1': {
        key: 'm',
        desc: 'Max All Units',
        onPress: function() {
            buyMaxAll();
        }
    },
    '2': {
        key: 'a',
        desc: 'Toggle Astral Enslavement',
        onPress: function() {
            toggleAstral();
        }
    },
    '3': {
        key: 'p',
        desc: 'World Prestige',
        onPress: function() {
            spacePrestigeKey();
        }
    },
    '4': {
        key: 's',
        desc: 'Sacrifice',
        onPress: function() {
            timePrestigeKey();
        }
    },
    '5': {
        key: 't',
        desc: 'Respec Time Production',
        onPress: function() {
            respecTimeKey();
        }
    },
    '6': {
        key: 'n',
        desc: 'Ascension',
        onPress: function() {
            galaxyPrestigeKey(app.respecNextGal);
        }
    },
    '7': {
        key: 'g',
        desc: 'Respec Galaxies',
        onPress: function() {
            respecGalaxiesKey();
        }
    },
    '8': {
        key: 'q',
        desc: 'Units Tab',
        onPress: function() {
            player.tab = 'unitsTab';
        }
    },
    '9': {
        key: 'w',
        desc: 'Buildings Tab',
        onPress: function() {
            if (player.unlocks['buildings']) { player.tab = 'buildingsTab'; }
        }
    },
    '10': {
        key: 'e',
        desc: 'Time Tab',
        onPress: function() {
            if (player.unlocks['time']) { player.tab = 'timeTab'; }
        }
    },
    '11': {
        key: 'r',
        desc: 'Galaxies Tab',
        onPress: function() {
            if (player.unlocks['galaxies']) { player.tab = 'galaxyTab'; }
        }
    },
    '12': {
        key: 'f',
        desc: 'Cycle Subtabs',
        onPress: function() {
            cycleSubtabs();
        }
    },
    units: {
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
    copyData(START_PLAYER.layerDisplay, {
        numClass: 'defNum',
    });
    START_PLAYER.corpses = new Decimal(0);
    START_PLAYER.corpsesAch13 = new Decimal(10);
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
        priority: ['1', '2', '3', '4', '5', '6', '7', '8'],
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
    
    copyData(START_PLAYER.stats['allTimeStats'], {
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

    copyData(START_PLAYER.stats['thisSacStats'], {
        totalCorpses: new Decimal(0),
        totalWorlds: new Decimal(0),
        totalBricks: new Decimal(0),
        totalSpaceResets: new Decimal(0),

        bestCorpses: new Decimal(0),
        bestWorlds: new Decimal(0),
        bestBricks: new Decimal(0),

        wentAstral: false,
    });

    copyData(START_PLAYER.stats['thisAscStats'], {
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
        'units': true,
        'spacePrestige': false,  
        'autobuyers': false,
        'fastBuyers': false,
        'bulkBuyers': false,
        'prestigeBuyer': false,
        'advancedBuyer': false,
        'ascensionBuyer': false,
        'timeDimBuyer': false,
        'buildings': false,
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
        'time': false,
        'timeUpgrades': false,
        'timeUpgrades2': false,
        'timeDims2': false,
        'galaxies': false,
        'research': false,
        'infResearch': false,
        'ark': false,
    });

    copyData(START_PLAYER.achievements, {
        rowsUnlocked: {
            1: true,
            2: true,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
        },
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

    copyData(START_PLAYER.tabNotify, {
        milestones: false,
        ach: {
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
        'u': {
            notify: false,
            indirect: false,
            'u': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        'b': {
            notify: false,
            indirect: false,
            'b': {
                notify: false,
                indirect: false,
            },
            'c': {
                notify: false,
                indirect: false,
            },
        },
        't': {
            notify: false,
            indirect: false,
            'd': {
                notify: false,
                indirect: false,
            },
            'u': {
                notify: false,
                indirect: false,
            },
        },
        'g': {
            notify: false,
            indirect: false,
            'g': {
                notify: false,
                indirect: false,
            },
            'r': {
                notify: false,
                indirect: false,
            },
            'i': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        's': {
            notify: false,
            indirect: false,
            's': {
                notify: false,
                indirect: false,
            },
            'l': {
                notify: false,
                indirect: false,
            },
            'a': {
                notify: false,
                indirect: false,
            },
        },
        'o': {
            notify: false,
            indirect: false,
        },
        'h': {
            notify: false,
            indirect: false,
        },
    });

    START_PLAYER.tooltipsEnabled = false;
    START_PLAYER.displayRealTime = false;
    START_PLAYER.tab = 'unitsTab';
    START_PLAYER.subTabs = { 'u': 'unitsSubTab', 'b': 'buildingsSubTab', 't': 'timeDimSubTab', 'g': 'galaxiesSubTab', 's': 'statSubTab' };
    START_PLAYER.activeGalaxies = new Array('4', '1', '2');
    START_PLAYER.hotkeysOn = true;
    START_PLAYER.dontResetSlider = false;
    START_PLAYER.favGalaxies = [[], [], []];
    START_PLAYER.favGalNames = ['Slot 1', 'Slot 2', 'Slot 3'];
    START_PLAYER.help = false;
    START_PLAYER.version = 'v1.1.1';

    DATA.sp = {};
    copyData(DATA.sp, START_PLAYER);

    fixData(player, DATA.sp);
    save();
}