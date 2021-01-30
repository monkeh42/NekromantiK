const HELP_TEXTS = {
    'unitsTab': {
        'mainTab': '<h2>UNITS</h2>\
                    Here you buy undead creatures with corpses.<br>\
                    Each zombie produces one corpse per second directly, while all other units produce the unit one tier below them at a rate of 1/tier per unit per second.<br>\
                    Each unit also has a corpse multiplier that multiplies your total corpse gain (corpse multipliers are additive), and a unit multiplier, which multiplies the unit production of that tier. \
                    Every time you purchase one of a unit after the first, its cost and corpse multiplier are multiplied by constants. The unit multiplier is always equal to the square root of the corpse multiplier.<br>\
                    Cost multipliers by unit tier (first tier = zombies): 100, 1e4, 1e4, 1e6, 1e10, 1e11, 1e12, 1e15.<br>\
                    Multiplier multipliers by unit tier: 1.75, 2, 2, 2, 2.2, 2.2, 2.5, 2.5.',
        'spacePrestige': '<h2>NEW WORLDS</h2>\
                        Eventually, this world will run out of souls to torture and corpses to harvest. When this happens, you must \'space prestige\' to move on to a new world.<br>\
                        When you space prestige, you lose all of your corpses and units, and you gain one Conquered World. Your conquered worlds provide a new multiplier to total corpse gain. Your first three space prestiges \
                        each also unlock a new feature and a new unit tier.<br>\
                        The first four space prestiges require at least one of your highest unlocked unit tier. After that, the requirement in 8th tier units increases by 2 with every prestige.',
    },
    'buildingsTab': {
        'mainTab': '<h2>BUILDINGS</h2>\
                    Here you will forge Astral Bricks and use them to construct monstrous buildings of death and war. Each building generates its own resource, and has its own set of upgrades \
                    focused on one aspect of the game.<br>\
                    Enabling Astral Enslavement disables corpse production and slows down time by 10x. During this time, you gain Astral Bricks based on your \
                    corpse gain (base formula is corpse gain^0.2).',
        'factory': '<h2>FACTORY</h2>\
                    Here you will produce armaments for your savage hordes. The production rate is based on the number of zombies you have (base formula is log10(zombies+1)^0.5) - someone needs to work the factory, after all.<br>\
                    The Death Factory upgrades will improve the effects of your units.',
        'necropolis': '<h2>NECROPOLIS</h2>',
        'construction': '<h2>CONSTRUCTION</h2>\
                    Here you can use Astral Bricks to improve the infrastructure of your hellish empire machine. These upgrades can be bought repeatedly and indefinitely, although the cost \
                    increases exponentially at very high levels.',
    },
}

const UNLOCKS_DATA = {
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
                return player.units[4].bought.gte(1);
            }
        },  
    },
    'buildingsTab': {
        'mainTab': {
            unlocked: false,
            idsToShow: ['buildingsTabCell', 'worldsBonusDisplay'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(1);
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
        'sun': {
            unlocked: false,
            idsToShow: ['sunUpgradesRow'],
            idsToHide: ['sunBuildRow'],
            condition: function() {
                return isBuilt(3);
            }
        } ,
        'construction': {
            unlocked: false,
            idsToShow: ['buildingsSubMenu', 'constructionSubTabBut'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(2);
            }
        } ,
    },
}

function checkUnlocked(tab, unlock) {
    return player.unlocks[tab][unlock];
}

function generateHelpText(tab) {
    var hText = HELP_TEXTS[tab]['mainTab'];

    for (k in HELP_TEXTS[tab]) {
        if (k != 'mainTab' && checkUnlocked(tab, k)) { hText = hText + HELP_TEXTS[tab][k] + '<br>'; }
    }
    return hText;
}

function generateHelpForFullPage(tabName, button, section) {
    if (document.getElementById(tabName).style.display == 'block') {
        document.getElementById(tabName).style.display = 'none';
        document.getElementById(button).className = 'helpPageBut';
    }
    else {
        var allTabs = document.getElementsByClassName('helpPageDiv');
        var tab; 

        var hText = '';
        for (k in HELP_TEXTS[section]) {
            hText = hText + HELP_TEXTS[section][k] + '<br>'; 
        }
        document.getElementById(tabName).innerHTML = hText;

        for (var i=0; i<allTabs.length; i++) {
            tab = allTabs.item(i);
            if (tab.id === (tabName)) {
                tab.style.display = 'block';
                document.getElementById(button).className = 'helpPageButSelected';
            } else {
                tab.style.display = 'none';
                document.getElementById(tab.id + 'But').className = 'helpPageBut';
            }
        }
    }
}