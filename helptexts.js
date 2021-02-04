const HELP_TEXTS = {
    'unitsTab': {
        'mainTab': '<h2>UNITS</h2>\
                    Here you buy undead creatures with corpses.<br>\
                    Each zombie produces one corpse per second directly, while all other units produce the unit one tier below them at a rate of 1/tier per unit per second.<br>\
                    Each unit also has a corpse multiplier that multiplies your total corpse gain (additively), and a unit multiplier, which multiplies the unit production of that tier and each tier below it. (additively). \
                    Every time you purchase one of a unit after the first, its cost and corpse multiplier are multiplied by constants. The base unit multiplier is always equal to the square root of the corpse multiplier.<br>\
                    Cost multipliers by unit tier (first tier = zombies): 100, 1e4, 1e4, 1e6, 1e10, 1e11, 1e12, 1e15.<br>\
                    Multiplier multipliers by unit tier: 1.75, 2, 2, 2, 2.2, 2.2, 2.5, 2.5.<br>\
                    (more sections will appear here as you progress)',
        'spacePrestige': '<h2>NEW WORLDS</h2>\
                        Eventually, this world will run out of souls to torture and corpses to harvest. When this happens, you must \'world prestige\' to move on to a new world.<br>\
                        When you world prestige, you lose all of your corpses and units, and you gain one Conquered World. Your conquered worlds provide a new multiplier to total corpse gain. Your first three world prestiges \
                        each also unlock a new feature and a new unit tier.<br>\
                        The first four world prestiges require at least one of your highest unlocked unit tier. After that, the requirement in 8th tier units increases by 2 with every prestige.',
    },
    'buildingsTab': {
        'mainTab': '<h2>BUILDINGS</h2>\
                    Here you will forge Astral Bricks and use them to construct monstrous buildings of death and war. Each building generates its own resource, and has its own set of upgrades \
                    focused on one aspect of the game.<br>\
                    Enabling Astral Enslavement disables corpse production and slows down time by 10x. During this time, you gain Astral Bricks based on your \
                    corpse gain (base formula is corpse gain^0.2).',
        'factory': '<h2>FACTORY</h2>\
                    Here you will produce armaments for your savage hordes. The production rate is based on the number of zombies you have (base formula is log10(zombies+1)^0.5) - someone needs to work the factory, after all.<br>\
                    Death Factory upgrades are purchased with armaments and will improve the effects of your units.',
        'factoryRow2':  '',
        'necropolis': '<h2>NECROPOLIS</h2>\
                    Your Necropolis trains acolytes to assist in channelling the astral void. The energies required to imbue mere mortals with this power is staggering, so you can only gain acolytes \
                    while you control the most powerful of undead beasts - the Sun Eaters (base formula is sun eaters^2).<br>\
                    Necropolis upgrades are purchased with astral bricks, and increase their effectiveness.',
        'necropolisRow2':  '',
        'sun': '<h2>DEAD SUN</h2>\
                    Here you will produce nekro-photons. They are produced at a constant rate, but only during astral enslavement (and yes, they are affected by the astral time speed nerf, but also by anti time essence).<br>\
                    Dead Sun upgrades are purchased with nekro-photons and unlock new upgrades and features.',
        'construction': '<h2>CONSTRUCTION</h2>\
                    Here you can use Astral Bricks to improve the infrastructure of your hellish empire machine. These upgrades can be bought repeatedly and indefinitely, although the cost \
                    increases exponentially at high levels (>25).',
    },
    'timeTab': {
        'mainTab': '<h2>TIME WARP</h2>\
                    Here you will use Time Crystals to purchase Time Dimensions, which produce Time Essence in two varieties - True Time and Anti Time.<br>\
                    To gain Time Crystals, you need to Sacrifice. You need at least 1e20 corpses to sacrifice, and it will reset ALL of your progress up to unlocking Time Warp (your corpses, units, conquered worlds, \
                    astral bricks, buildings, building upgrades, and construction upgrades) plus any time essence or time dimensions you\'ve produced (not bought). You will gain time crystals based on the amount of corpses you have when you sacrifice. (base formula is floor(10^(corpses_exponent/20 - 0.45)))<br>\
                    Time Dimensions work similarly to units, except there are only 4 tiers. Each 1st dimension produces 1 time essence per second times the 1st dimension multiplier, which doubles with each 1st dimension purchased. Each higher tier dimension produces 1 per second of the tier below it, \
                    multiplied by that tier\'s multiplier. Unlike units, each dimension\'s multiplier increases at the same rate (x2 with each purchase) and the full multiplier is applied to production; however, the higher tier multipliers don\'t apply directly to essence production.<br>\
                    You can set the percentage of production from Time Dimensions put towards True/Anti Time Essence however you\'d like, but you can\'t change this setting without doing a sacrifice reset. You won\'t start Time Essence production until you click "lock in", which will disable the slider.<br>\
                    True Time Essence increases the multiplier to normal time speed, while Anti Time Essence increases the multiplier to time speed during Astral Enslavement. The Anti Time Essence boost is twice as powerful as the True Time Essence boost. \
                    True Time Essence also divides the Anti Time Essence effect, and vice versa, so you receive the strongest boost for either by setting the slider all the way to one side, but then you won\'t receive any boost at all for the Essence that isn\'t producing.<br>\
                    Final note: the Time Essence effects don\'t apply at all to time dimensions or essence production, and neither does the time speed nerf from Astral Enslavement.<br>\
                    Cost multipliers by dimension tier: 10, 100, 100, 1000.'
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
            idsToShow: ['buildingsTabCell', 'worldsBonusDisplay', 'totalBonusDisplay'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(1);
            }
        },
        'factory': {
            unlocked: false,
            idsToShow: ['factoryUpgradesRow1', 'factoryHeaderRow'],
            idsToHide: ['factoryBuildRow'],
            condition: function() {
                return isBuilt(1);
            }
        },
        'factoryRow2': {
            unlocked: false,
            idsToShow: ['factoryUpgradesRow2'],
            idsToHide: [],
            condition: function() {
                return hasUpgrade(3, 11);
            }
        },
        'necropolis': {
            unlocked: false,
            idsToShow: ['necropolisUpgradesRow1', 'necropolisHeaderRow'],
            idsToHide: ['necropolisBuildRow'],
            condition: function() {
                return isBuilt(2);
            }
        },
        'necropolisRow2': {
            unlocked: false,
            idsToShow: ['necropolisUpgradesRow2'],
            idsToHide: [],
            condition: function() {
                return hasUpgrade(3, 12);
            }
        },
        'sun': {
            unlocked: false,
            idsToShow: ['sunUpgradesRow', 'sunHeaderRow'],
            idsToHide: ['sunBuildRow'],
            condition: function() {
                return isBuilt(3);
            }
        },
        'construction': {
            unlocked: false,
            idsToShow: ['buildingsSubMenu', 'constructionSubTabBut'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(2);
            }
        },
    },
    'timeTab': {
        'mainTab': {
            unlocked: false,
            idsToShow: ['timeTabCell', 'timeBoostDisplay'],
            idsToHide: [],
            condition: function() {
                return player.spaceResets.gte(3);
            }
        },
    }
}

function checkUnlocked(tab, unlock) {
    return player.unlocks[tab][unlock];
}

function generateHelpText(tab) {
    var hText = HELP_TEXTS[tab]['mainTab'];

    for (k in HELP_TEXTS[tab]) {
        if (k != 'mainTab' && HELP_TEXTS[tab][k] != '' && checkUnlocked(tab, k)) { hText = hText + HELP_TEXTS[tab][k] + '<br>'; }
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
            if (HELP_TEXTS[section][k] != '') { hText = hText + HELP_TEXTS[section][k] + '<br>'; }
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