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
                    When you world prestige, you lose all of your corpses and units, and you gain one Exterminated World. Your exterminated worlds provide a new multiplier to total corpse gain. Your first three world prestiges \
                    each also unlock a new feature and a new unit tier.<br>\
                    The first four world prestiges require at least one of your highest unlocked unit tier. After that, the requirement in 8th tier units increases by 2 with every prestige.',
        'autobuyers': '<h2>AUTOBUYERS</h2>\
                    Each autobuyer attempts to purchase its corresponding unit or reset at regular intervals. When you first unlock them, you only have access to "slow autobuyers" - these trigger every 15 REAL WORLD seconds, \
                    meaning the time speed effects from astral enslavement and time essence have no effect on that interval. Eventually, you\'ll unlock "fast autobuyers", which trigger every game tick (20x/sec).<br>\
                    Each time autobuyers trigger, they attempt to buy each unit in order of the priority drop-down menus, starting with 1 and ending with 8.\
                    You will also eventually unlock "bulk autobuyers" for units, which attempt to max buy each unit every time instead of just buy one, and a world prestige autobuyer, which works the same as the unit autobuyers. You can toggle whether the game will prioritize prestige or sacrifice when they\'re both on and ready in the same tick.<br>\
                    The sacrifice autobuyer works a bit differently. You specify at what amount of crystals gained it should sacrifice, and then every autobuyer tick it will check your crystal gain and sacrifice if it\'s greater than \
                    or equal to what you entered. There is an additional checkbox on the sacrifice autobuyer for "auto lock in"; this means if the sacrifice was initiated by the autobuyer, it will automatically lock in your time \
                    dimensions to start producing essence.<br>\
                    Lastly, you will eventually unlock more options for the sacrifice autobuyer\'s condition. The two additional ones are: "at x times last", which sacrifices when your crystal gain is at least x times the amount of crystals \
                    gained in your last sacrifice, and "after x seconds", which simply sacrifices the specified number of seconds after your last sacrifice.',
        'fastBuyers': '',
        'bulkBuyers': '',
        'advancedBuyer': '',
        'prestigeBuyer':  '',
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
                    Dead Sun upgrades are purchased with nekro-photons and mostly unlock new upgrades and features.',
        'sunRow2':  '',
        'construction': '<h2>CONSTRUCTION</h2>\
                    Here you can use Astral Bricks to improve the infrastructure of your hellish empire machine. These upgrades can be bought repeatedly and indefinitely, although the cost \
                    increases exponentially at high levels (>25).',
    },
    'timeTab': {
        'mainTab': '<h2>TIME WARP</h2>\
                    Here you will use Time Crystals to purchase Time Dimensions, which produce Time Essence in two varieties - True Time and Anti Time.<br>\
                    To gain Time Crystals, you need to Sacrifice. You need at least 1e20 corpses to sacrifice, and it will reset ALL of your progress up to unlocking Time Warp (your corpses, units, exterminated worlds, \
                    astral bricks, buildings, building upgrades, and construction upgrades) plus any time essence or time dimensions you\'ve produced (not bought). You will gain time crystals based on the amount of corpses you have when you sacrifice. (base formula is floor(10^(corpses_exponent/20 - 0.45)))<br>\
                    Time Dimensions work similarly to units, except there are only 4 tiers. Each 1st dimension produces 1 time essence per second times the 1st dimension multiplier, which doubles with each 1st dimension purchased. Each higher tier dimension produces 1 per second of the tier below it, \
                    multiplied by that tier\'s multiplier. Unlike units, each dimension\'s multiplier increases at the same rate (x2 with each purchase) and the full multiplier is applied to production; however, the higher tier multipliers don\'t apply directly to essence production.<br>\
                    You can set the percentage of production from Time Dimensions put towards True/Anti Time Essence however you\'d like, but you can\'t change this setting without doing a sacrifice reset. You won\'t start Time Essence production until you click "lock in", which will disable the slider.<br>\
                    Note: clicking the "respec slider" button only counts as a sacrifice (for boosts/achievements based on number of sacrifices) if you actually gain time crystals. If you click the respec button before you reach 1e20 corpses, it won\'t be counted.<br>\
                    True Time Essence increases the multiplier to normal time speed, while Anti Time Essence increases the multiplier to time speed during Astral Enslavement. The Anti Time Essence boost is twice as powerful as the True Time Essence boost. \
                    True Time Essence also divides the Anti Time Essence effect, and vice versa, so you receive the strongest boost for either by setting the slider all the way to one side, but then you won\'t receive any boost at all for the Essence that isn\'t producing.<br>\
                    Final note: the Time Essence effects don\'t apply at all to time dimensions or essence production, and neither does the time speed nerf from Astral Enslavement.<br>\
                    Cost multipliers by dimension tier: 10, 100, 100, 1000.',
        'timeUpgrades': '<h2>TIME UPGRADES</h2>\
                    Here you\'ll buy some very powerful upgrades with Time Crystals. This is the point where you\'ll start needing to sacrifice frequently and repeatedly to make significant progress, so most of these \
                    upgrades focus on making sacrifice runs go faster.',
    },
    'galaxyTab': {
        'mainTab': '<h2>DEPLETED GALAXIES</h2>\
                    You have exterminated countless worlds, and your power begins to reach a point of singularity. You gather your energies and A S C E N D, forming a putrid, macabre Depleted Galaxy from the remains of those empty worlds.<br>\
                    10 exterminated worlds are required to ascend for one galaxy. The formula for further gain is floor(x^(x/10 - sqrt(x/10))). When you perform an ascension, everything up to the point that you unlocked galaxies is reset. The ONLY things \
                    other than achievements that you keep after your first ascension are <span style="font-weight: 800;">Cosmogenesis</span> (the upgrade that unlocks galaxies), the prestige autobuyer, and the fast/bulk/advanced autobuyer upgrades (but you still need to buy \
                    <span style="font-weight: 800;">World Stasis 3</span> again before you can use autobuyers).<br>\
                    Now that you have your first galaxy, you can spend it on a galaxy upgrade. There are four separate galaxy trees, and each has two branches in the middle. You can only take one brach at a time; buying a 2nd row upgrade in any galaxy \
                    will immediately lock out the two upgrades in that galaxy\'s other branch. Each upgrade has a base cost of 1 galaxy, but any time you buy an upgrade, the costs of all upgrades in all rows below it are increased by 1, and buying a 4th row \
                    upgrade increases the first row\'s costs by 1. A galaxy respec will completely reset all galaxy upgrades, costs, and locked upgrades.<br>\
                    Finally, there are galaxy milestones. These are permanent rewards that you receive the first time you fully complete 1/2/3/4 galaxies at once. NOTE: the milestones window is draggable.' 
    },
}
