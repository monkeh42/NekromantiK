const HELP_TEXTS = {
    'unitsTab': {
        'mainTab': 'this is a help text',
        'spacePrestige': 'talk about new worlds',
    },
    'buildingsTab': '',
}

const UNLOCKS = {
    'unitsTab': {'mainTab': true, 'spacePrestige': false, },
    'buildingsTab': {'mainTab': false, 'factory': false, 'necropolis': false, },
}

function checkUnlocked(tab, unlock) {
    return UNLOCKS[tab][unlock];
}

function generateHelpText(tab) {
    var hText = '';

    for (k in UNLOCKS[tab]) {
        if (checkUnlocked(tab, k)) { hText = hText + HELP_TEXTS[tab][k]; }
    }
    return hText;
}