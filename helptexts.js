const HELP_TEXTS = {
    'unitsTab': {
        'mainTab': '<h1>UNITS</h1>\
                    Here you buy undead creatures with corpses.<br>\
                    Each zombie produces one corpse per second directly, while all other units produce the unit one tier below them.<br>\
                    Each unit also has a corpse multiplier that multiplies your total corpse gain (corpse multipliers are additive), and a unit multiplier, which multiplies the unit production of that tier. \
                    Every time you purchase one of a unit, its cost and corpse multiplier are multiplied by constants. The unit multiplier is always equal to the square root of the corpse multiplier.<br>\
                    Cost multipliers by unit tier (first tier = zombies): 1e3, 1e4, 1e4, 1e6, 1e10, 1e11, 1e12, 1e15.<br>\
                    Multiplier multipliers by unit tier: 1.75, 2, 2, 2, 2.2, 2.2, 2.5, 2.5.',
        'spacePrestige': '<h1>NEW WORLDS</h1>\
                        Eventually, this world will run out of souls to torture and corpses to harvest. When this happens, you must \'space prestige\' to move on to a new world.<br>\
                        When you space prestige, you lose all of your corpses and units, and you gain one Conquered World. Your conquered worlds provide a new multiplier to total corpse gain. Your first space prestige also unlocks \
                        Buildings, and your first three each unlock a new unit tier.<br>\
                        The first four space prestiges require at least one of your highest unlocked unit tier. After that, the requirement in 8th tier units increases by 2 with every prestige.',
    },
    'buildingsTab': {
        'mainTab': '<h1>BUILDINGS</h1>\
                    Here you will forge Astral Bricks and use them to construct monstrous buildings of death and war. Each building generates its own resource, and has its own set of upgrades \
                    focused on one aspect of the game.<br>\
                    Enabling Astral Enslavement disables all unit production (corpses and units) and slows down time by 10x. During this time, you gain Astral Bricks based on your \
                    corpse gain (base formula is corpse gain^0.3).',
        'factory': '<h1>FACTORY</h1>\
                    Here you will produce armaments for your savage hordes. The production rate is based on the number of zombies you have (someone needs to work the factory, after all).<br>\
                    The Death Factory upgrades will improve the effects of your units.',
        'necropolis': '<h1>NECROPOLIS</h1>',
    },
}

const START_UNLOCKS = {
    'unitsTab': {
        'mainTab': {
            unlocked: true,
            idsToShow: [],
            idsToHide: [],
            condition: function() {
                return true;
            }
        }, 
        'spacePrestige': {
            unlocked: false,
            idsToShow: ['spacePresContainer'],
            idsToHide: [],
            condition: function() {
                return units[4].bought.gte(1);
            }
        },  
    },
    'buildingsTab': {
        'mainTab': {
            unlocked: false,
            idsToShow: ['buildingsTabBut', 'worldsBonusDisplay'],
            idsToHide: [],
            condition: function() {
                return player.totalSpaceResets.gte(1);
            }
        },
        'factory': {
            unlocked: false,
            idsToShow: ['factoryUpgradesRow', 'factoryHeaderRow'],
            idsToHide: ['factoryBuildRow'],
            condition: function() {
                return isBuilt(1);
            }
        },
        'necropolis': {
            unlocked: false,
            idsToShow: ['necropolisUpgradesRow'],
            idsToHide: ['necropolisBuildRow'],
            condition: function() {
                return isBuilt(2);
            }
        } ,
    },
}

function checkUnlocked(tab, unlock) {
    return unlocks[tab][unlock].unlocked;
}

function generateHelpText(tab) {
    var hText = HELP_TEXTS[tab]['mainTab'];

    for (k in unlocks[tab]) {
        if (k != 'mainTab' && checkUnlocked(tab, k)) { hText = hText + HELP_TEXTS[tab][k] + '<br>'; }
    }
    return hText;
}