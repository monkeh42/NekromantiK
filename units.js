const START_UNITS = {
    1: {
        single: "zombie",
        plural: "zombies",
        unlocked: true,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(1.75),
        costMult: new Decimal(100),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(10),
        corpseBoost: function() {
            var cb = new Decimal(1);
            if (hasUpgrade(1, 11)) { cb = cb.times(getUpgEffect(1, 11)); }
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 1,
        buttonID: "zombieBut",
        maxID: "zombieMax",
        amountID: "zombieAmount",
        multID: "zombieMult",
        rowID: "zombieRow",
    },
    2: {
        single: "abomination",
        plural: "abominations",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2),
        costMult: new Decimal(10000),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(100),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 2,
        buttonID: "abomBut",
        maxID: "abomMax",
        amountID: "abomAmount",
        multID: "abomMult",
        rowID: "abomRow",
    },
    3: {
        single: "skeleton mage",
        plural: "skeleton mages",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2),
        costMult: new Decimal(10000),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(10000),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 3,
        buttonID: "mageBut",
        maxID: "mageMax",
        amountID: "mageAmount",
        multID: "mageMult",
        rowID: "mageRow",
    },
    4: {
        single: "banshee",
        plural: "banshees",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2),
        costMult: new Decimal(1000000),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(1000000),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 4,
        buttonID: "bansheeBut",
        maxID: "bansheeMax",
        amountID: "bansheeAmount",
        multID: "bansheeMult",
        rowID: "bansheeRow",
    },
    5: {
        single: "lich",
        plural: "liches",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2.2),
        costMult: new Decimal(1e10),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(1e9),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 5,
        buttonID: "lichBut",
        maxID: "lichMax",
        amountID: "lichAmount",
        multID: "lichMult",
        rowID: "lichRow",
    },
    6: {
        single: "behemoth",
        plural: "behemoths",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2.2),
        costMult: new Decimal(1e11),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(1e13),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 6,
        buttonID: "beheBut",
        maxID: "beheMax",
        amountID: "beheAmount",
        multID: "beheMult",
        rowID: "beheRow",
    },
    7: {
        single: "ancient one",
        plural: "ancient ones",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2.5),
        costMult: new Decimal(1e12),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(1e19),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 7,
        buttonID: "oneBut",
        maxID: "oneMax",
        amountID: "oneAmount",
        multID: "oneMult",
        rowID: "oneRow",
    },
    8: {
        single: "sun eater",
        plural: "sun eaters",
        unlocked: false,
        bought: new Decimal(0),
        amount: new Decimal(0),
        multPer: new Decimal(2.5),
        costMult: new Decimal(1e15),
        corpseMult: new Decimal(0),
        prodMult: new Decimal(0),
        cost: new Decimal(1e25),
        corpseBoost: function() {
            var cb = new Decimal(1);
            return cb;
        },
        prodBoost: function() {
            var pb = new Decimal(1);
            return pb;
        },
        tier: 8,
        buttonID: "sunBut",
        maxID: "sunMax",
        amountID: "sunAmount",
        multID: "sunMult",
        rowID: "sunRow",
    },
};

function resetUnits() {
    for (var z=NUM_UNITS; z>0; z--) {
        units[z].amount = new Decimal(0);
        units[z].bought = new Decimal(0);
    }
    units = Object.assign({}, START_UNITS);
    fixData(units, START_UNITS);
}

function canSpacePrestige() {
    return units[player.nextSpaceReset[1]].bought.gte(player.nextSpaceReset[0]);
}

function spacePrestige() {
    if (canSpacePrestige()) {
        astralFlag = false;
        clearInterval(mainLoop);
        player.spaceResets = player.spaceResets.plus(1);
        player.worlds = player.worlds.plus(1);
        player.totalSpaceResets = player.totalSpaceResets.plus(1);
        player.totalWorlds = player.totalWorlds.plus(1);
        if (player.nextSpaceReset[1] < NUM_UNITS) { player.nextSpaceReset[1] += 1; }
        else { player.nextSpaceReset[0] += 2; }
        resetUnits();
        resetBuildingResources();
        //unitSetup(START_PLAYER);
        player.corpses = new Decimal(START_PLAYER.corpses);
        allDisplay();
        for (var z=2; z<=NUM_UNITS; z++) {
            document.getElementById(units[z].rowID).style.display = 'none';
            units[z].unlocked = false;
        }
        save();
        startInterval();
    }
}

function canUnlock(tier) {
    return player.spaceResets.plus(5).gte(tier);
}

function canAfford(tier) {
    return player.corpses.gte(units[tier].cost);
}

function buySingleUnit(tier) {
    if (canAfford(tier)) {
        player.corpses = player.corpses.minus(units[tier].cost);
        units[tier].amount = units[tier].amount.plus(1);
        units[tier].bought = units[tier].bought.plus(1);
        units[tier].corpseMult = units[tier].corpseMult.times(units[tier].multPer);
        if (units[tier].bought.eq(1) && units[tier].corpseMult.eq(0)) { units[tier].corpseMult = new Decimal(1) }
        units[tier].prodMult = units[tier].corpseMult.sqrt();
        units[tier].cost = units[tier].cost.times(units[tier].costMult);
        allDisplay();
    }
}

function buyMaxUnits(tier) {
    if (canAfford(tier)) {
        var totalBought = calculateMaxUnits(tier);
        player.corpses = player.corpses.minus(calculateMaxUnitsCost(tier));
        units[tier].cost = units[tier].cost.times(units[tier].costMult.pow(totalBought));
        units[tier].amount = units[tier].amount.plus(totalBought);
        units[tier].bought = units[tier].bought.plus(totalBought);
        if (units[tier].bought.gte(1) && units[tier].corpseMult.eq(0)) { 
            units[tier].corpseMult = new Decimal(1);
            totalBought = totalBought.minus(1);
        }
        units[tier].corpseMult = units[tier].corpseMult.times(units[tier].multPer.pow(calculateMaxUnits(tier)));
        units[tier].prodMult = units[tier].corpseMult.sqrt();
        allDisplay();
    }
}

function calculateMaxUnits(tier) {
    var count = 0;
    if (canAfford(tier)) {    
        var leftoverCorpses = player.corpses;
        var newCost = units[tier].cost;
        while (leftoverCorpses.gte(newCost)) {
            leftoverCorpses = leftoverCorpses.minus(newCost);
            newCost = newCost.times(units[tier].costMult);
            count++;
        }
    }
    return count;
}

function calculateMaxUnitsCost(tier) {
    var count = calculateMaxUnits(tier);
    var total = new Decimal(0);
    if (count > 0) {
        for (var i=0; i<count; i++) {
            total = total.plus(units[tier].cost.times(units[tier].costMult.pow(i)));
        }
    }
    return total;
}

function getUnitProdPerSecond(tier) {
    if (tier == NUM_UNITS) { return new Decimal(0); }
    return units[tier+1].amount.times(units[tier+1].prodMult).div(Decimal.pow(tier+1, 1.5));
}

function getTotalProdMult(tier) {
    mult = new Decimal(1);
    if (tier <= NUM_UNITS) {
        for (var i = tier; i<=NUM_UNITS; i++) {
            mult = mult.plus(units[i].prodMult.times(units[i].prodBoost()));
        }
    }
    return mult;
}

function singulizer(tier, number) {
    if (typeof number === 'Decimal') {
        if (number.eq(1)) { return units[tier].single }
        else { return units[tier].plural }
    } else {
        if (number == 1) { return units[tier].single }
        else { return units[tier].plural }
    }
}