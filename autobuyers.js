function updateAutobuyers() {
    var elements = document.getElementsByClassName('onBuyerRadio');
    var tier = 0;
    var pri = 0;
    var unitName = '';
    var firstThree = '';
    var newPriority = new Array();
    for (var i=0; i<elements.length; i++) {
        unitName = '';
        firstThree = elements[i].id.slice(0, 3);
        for (var j=1; j<=NUM_UNITS; j++) {
            if (UNITS_DATA[j].single.startsWith(firstThree)) {
                tier = UNITS_DATA[j].tier;
                unitName = UNITS_DATA[j].single.replace(' ', '');
                pri = parseInt(document.getElementById(unitName + 'Priority').value);
                break;
            }
            tier = 9;
            unitName = 'sacrifice';
        }
        player.autobuyers[tier].on = document.getElementById(unitName + 'BuyerOn').checked;
        player.autobuyers[tier].fast = document.getElementById(unitName + 'BuyerFast').checked;
        if (tier == 9) {
            player.autobuyers[tier].amount = new Decimal(document.getElementById(unitName + 'BuyerAmount').value);
            player.autobuyers[tier].type = document.getElementById(unitName + 'BuyerOptionsList').value;
        } else {
            player.autobuyers[tier].bulk = document.getElementById(unitName + 'BuyerBulkOn').checked;
            if (newPriority[pri-1] === undefined) { newPriority[pri-1] = parseInt(tier); }
            else { newPriority.splice(pri-1, 0, tier); }
        }
    }
    copyData(player.autobuyers.priority, newPriority);
}

function isAutoSacTriggered() {
    switch (player.autobuyers[9].type) {
        case 'atx':
            return (calculateCrystalGain().gte(player.autobuyers[9].amount));

        case 'xtimes':
            return (calculateCrystalGain().times(player.pastRuns.lastRun.crystalGain).gte(player.autobuyers[9].amount));

        case 'afterx':
            return player.autobuyers[9].amount.lt(((new Date).getTime()-player.pastRuns.lastRun.timeSacrificed)*1000);

        default: return false;
    }
}