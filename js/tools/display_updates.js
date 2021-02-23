//main update loop functions

function updateDisplay(timestamp) {
    updateBuyables();
    updateResourceDisplays();
    updateTierDisplays();
    updatePrestigeDisplays();
    
    for (let z=0; z<displayData.length; z++) {
        updateElement(displayData[z]);
    }

    displayData = new Array(0);
    /*document.getElementById('testBox').innerHTML = `<h2>log(x) -> sqrt(x)</h2>
                                                    <br>Industrialize: ${formatDefault2(Decimal.pow(player.buildings[1].amount.sqrt(), 0.5).times(2).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.buildings[1].amount.sqrt(), 0.5).times(2).plus(1).div(getUpgEffect(1, 11)))}x stronger<br>
                                                    Part Time Jobs: ${formatDefault2(Decimal.pow(player.units[2].amount.sqrt(), 0.5).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.units[2].amount.sqrt(), 0.5).plus(1).div(getUpgEffect(1, 21)))}x stronger<br>
                                                    Arm the Dead: ${formatDefault2(player.corpses.plus(1))}x boost,<br>
                                                    ${formatDefault2(player.corpses.plus(1).div(getUpgEffect(1, 23)))}x stronger<br>
                                                    Astral Forges: ${formatDefault2(Decimal.sqrt(player.bricks.sqrt().plus(1)))}x boost,<br>
                                                    ${formatDefault2(Decimal.sqrt(player.bricks.sqrt().plus(1)).div(getUpgEffect(2, 12)))}x stronger<br>
                                                    Astral Siege Engines: ${formatDefault2(Decimal.sqrt(player.bricks.sqrt().plus(1)))}x boost,<br>
                                                    ${formatDefault2(Decimal.sqrt(player.bricks.sqrt().plus(1)).div(getUpgEffect(2, 13)))}x stronger<br>
                                                    Astral Kiln Kilns: ${formatDefault2(player.bricks.plus(1))}x boost,<br>
                                                    ${formatDefault2(player.bricks.plus(1).div(getUpgEffect(2, 21)))}x stronger<br>
                                                    Astral Time Machine: ${formatDefault2(player.bricks.plus(1))}x boost,<br>
                                                    ${formatDefault2(player.bricks.plus(1).div(getUpgEffect(2, 22)))}x stronger<br>
                                                    Astral Magnifying: ${formatDefault2(player.bricks.sqrt().div(4).plus(1))}x boost,<br>
                                                    ${formatDefault2(player.bricks.sqrt().div(4).plus(1).div(getUpgEffect(2, 23)))}x stronger<br>`

    document.getElementById('testBoxL').innerHTML = `<h2>log(x) -> log(x)^2</h2>
                                                    <br>Industrialize: ${formatDefault2(Decimal.pow(Decimal.pow(player.buildings[1].amount.log10(), 2), 0.5).times(2).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(Decimal.pow(player.buildings[1].amount.log10(), 2), 0.5).times(2).plus(1).div(getUpgEffect(1, 11)))}x stronger<br>
                                                    Part Time Jobs: ${formatDefault2(Decimal.pow(Decimal.pow(player.units[2].amount.log10(), 2), 0.5).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(Decimal.pow(player.units[2].amount.log10(), 2), 0.5).plus(1).div(getUpgEffect(1, 21)))}x stronger<br>
                                                    Arm the Dead: ${formatDefault2(Decimal.pow(player.corpses.log10(), 2).pow(2).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.corpses.log10(), 4).plus(1).div(getUpgEffect(1, 23)))}x stronger<br>
                                                    Astral Forges: ${formatDefault2(Decimal.sqrt(Decimal.pow(player.bricks.log10(), 2).plus(1)))}x boost,<br>
                                                    ${formatDefault2(Decimal.sqrt(Decimal.pow(player.bricks.log10(), 2).plus(1)).div(getUpgEffect(2, 12)))}x stronger<br>
                                                    Astral Siege Engines: ${formatDefault2(Decimal.sqrt(Decimal.pow(player.bricks.log10(), 2).plus(1)))}x boost,<br>
                                                    ${formatDefault2(Decimal.sqrt(Decimal.pow(player.bricks.log10(), 2).plus(1)).div(getUpgEffect(2, 13)))}x stronger<br>
                                                    Astral Kiln Kilns: ${formatDefault2(Decimal.pow(player.bricks.log10(), 4).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.bricks.log10(), 4).plus(1).div(getUpgEffect(2, 21)))}x stronger<br>
                                                    Astral Time Machine: ${formatDefault2(Decimal.pow(player.bricks.log10(), 4).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.bricks.log10(), 4).plus(1).div(getUpgEffect(2, 22)))}x stronger<br>
                                                    Astral Magnifying: ${formatDefault2(Decimal.pow(player.bricks.log10(), 2).div(4).plus(1))}x boost,<br>
                                                    ${formatDefault2(Decimal.pow(player.bricks.log10(), 2).div(4).plus(1).div(getUpgEffect(2, 23)))}x stronger<br>`*/
}

function updateElement(data) {
    if (data[0] == 'addClass') {
        document.getElementById(data[1]).classList.add(data[2]);
    } else if (data[0] == 'remClass') {
        document.getElementById(data[1]).classList.remove(data[2]);
    } else if (data[0] == 'togClass') {
        document.getElementById(data[1]).classList.toggle(data[2]);
    } else if (data[0] == 'setAttr') {
        document.getElementById(data[1]).setAttribute(data[2], data[3]);
    } else if (data[0] == 'setProp') {
        document.getElementById(data[1]).style.setProperty(data[2], data[3]);
    } else if (data[0] == 'togDisplay') {
        document.getElementById(data[1]).style.display = document.getElementById(data[1]).style.display === 'none' ? '' : 'none'
    } else if (data[0] == 'html') {
        document.getElementById(data[1]).innerHTML = data[2];
    }
}

function updateBuyables() {
    updateBuildingUpgs();
    updateConstrUpgs();
    updateTimeUpgs();
}

function updateBuildingUpgs() {
    for (let b in BUILDS_DATA) {
        if (!isBuilt(b)) {
            if (canAffordBuilding(b) && !document.getElementById(BUILDS_DATA[b].buildingButtonID).classList.contains(BUILDS_DATA[b].buildingButtonClass)) {
                addBButtonClass(b, BUILDS_DATA[b].buildingButtonClass);
                remBButtonClass(b, BUILDS_DATA[b].buildingButtonUnclick);
            } else if (!canAffordBuilding(b) && document.getElementById(BUILDS_DATA[b].buildingButtonID).classList.contains(BUILDS_DATA[b].buildingButtonClass)) {
                remBButtonClass(b, BUILDS_DATA[b].buildingButtonClass);
                addBButtonClass(b, BUILDS_DATA[b].buildingButtonUnclick);
            }
        }
        for (let u in BUILDS_DATA[b].upgrades) {
            if (!hasUpgrade(b, u)) {
                if (canAffordBUpg(b, u) && !document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.contains(BUILDS_DATA[b].upgradeBtnClass)) {
                    addBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnClass);
                    remBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnUnclick);
                } else if (!canAffordBUpg(b, u) && document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.contains(BUILDS_DATA[b].upgradeBtnClass)) {
                    addBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnUnclick);
                    remBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnClass);
                }
            }
            writeHTMLBUpg(b, u, `<span style="font-weight: 900;">${getUpgName(b, u)}</span><br>${getUpgDesc(b, u)}<br>Cost: ${formatWhole(getUpgCost(b, u))} ${BUILDS_DATA[b].upgResource}${isDisplayEffect(b, u) ? ("<br>Currently: " + formatDefault2(getUpgEffect(b, u)) + "x") : ""}`);
        }
    }
}

function updateConstrUpgs() {
    for (let c in CONSTR_DATA) {
        if (canAffordCUpg(c) && !document.getElementById(CONSTR_DATA[c].buttonID).classList.contains('constrUpg')) {
            addCUpgClass(c, 'constrUpg');
            remCUpgClass(c, 'unclickableConstrUpg');
        } else if (!canAffordCUpg(c) && document.getElementById(CONSTR_DATA[c].buttonID).classList.contains('constrUpg')) {
            remCUpgClass(c, 'constrUpg');
            addCUpgClass(c, 'unclickableConstrUpg');
        }
        if (CONSTR_DATA[c].isTimes) { writeHTMLCUpg(c, `<span style="font-weight: 900;">${getCUpgName(c)}</span><br>${getCUpgDesc(c)}<br>Cost: ${formatDefault(getCUpgCost(c))} astral bricks<br>Current level: ${formatWhole(player.construction[c])}${isDisplayEffectC(c) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(c)) + "x") : ""}`); }
        else { writeHTMLCUpg(c, `<span style="font-weight: 900;">${getCUpgName(c)}</span><br>${getCUpgDesc(c)}<br>Cost: ${formatDefault(getCUpgCost(c))} astral bricks<br>Current level: ${formatWhole(player.construction[c])}${isDisplayEffectC(c) ? ("<br>Currently: +" + formatDefault2(getCUpgEffect(c))) : ""}`); }
    }
}

function updateTimeUpgs() {
    for (let t in TIME_DATA.upgrades) {
        if (!hasTUpgrade(t)) {
            if (canAffordTUpg(t) && !document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.contains('timeUpg')) {
                addTUpgClass(t, 'timeUpg');
                remTUpgClass(t, 'unclickableTimeUpg');
            } else if (!canAffordTUpg(t) && document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.contains('timeUpg')) {
                remTUpgClass(t, 'timeUpg');
                addTUpgClass(t, 'unclickableTimeUpg');
            }
        }
        writeHTMLTUpg(t, `<span style="font-weight: 900;">${getTUpgName(t)}</span><br>${getTUpgDesc(t)}${(TIME_DATA.upgrades[t].preReq != null) ? "<br>Requires <span style=\"font-weight: 800;\">" + TIME_DATA.upgrades[TIME_DATA.upgrades[t].preReq].title + "</span>" : ""}<br>Cost: ${formatWhole(getTUpgCost(t))} time crystals${isDisplayEffectT(t) ? ("<br>Currently: " + formatDefault2(getTUpgEffect(t)) + "x") : ""}`);
    }
}

function updateResourceDisplays() {
    displayData.push(['html', 'achBoost', formatDefault2(getAchievementBoost())]);
    displayData.push(['html', 'numAch', formatWhole(getNumAchievements())]);
    updateCorpseDisplays();
    updateBuildingDisplays();
    updateTimeDisplays()
}

function updateCorpseDisplays() {
    displayData.push(['html', 'corpseAmount', formatDefault(player.corpses)]);
    displayData.push(['html', 'pluralCorpse', corpseSingulizer(false)]);
    displayData.push(['html', 'pluralCorpseG', corpseSingulizer(true)]);
    displayData.push(['html', 'corpseGain', player.astralFlag ? formatWhole(0) : formatDefault(getCorpsesPerSecond())]);
    displayData.push(['html', 'totalMult', `${formatDefault2(getCorpseMultFromUnits())}x`]);
    displayData.push(['html', 'worldsMult', `${formatDefault2(getWorldsBonus())}x`]);
    displayData.push(['html', 'worldsNum', `${formatWhole(player.worlds)}`]);
    displayData.push(['html', 'pluralWorld', worldSingulizer()]);
    displayData.push(['html', 'totalMultAll', `${formatDefault2(getTotalCorpseMult())}x`]);
    displayData.push(['html', 'normalAstral', player.astralFlag ? 'ASTRAL' : 'NORMAL']);
    //displayData.push(['setProp', 'normalAstral', 'color', player.astralFlag ? '#42d35a' : 'white']);
    //displayData.push(['setProp', 'normalAstral', player.astralFlag ? '#42d35a' : 'white']);
    displayData.push(['html', 'timeMult', `${player.astralFlag ? formatDefault2(getAntiTimeBuff()) : formatDefault2(getTrueTimeBuff())}x`]);
    displayData.push(['html', 'devSpeedDisplay', formatWhole(DEV_SPEED)]);
}

function updateBuildingDisplays() {
    displayData.push(['html', 'brickDisplay', formatUnitRow(player.bricks)]);
    displayData.push(['html', 'brickGainDisplay', ` ${(player.astralFlag ? formatUnitRow(getBricksPerSecond()) : formatWhole(0))} `]);
    displayData.push(['html', 'factoryProd', formatDefault(getBuildingProdPerSec(1))]);
    displayData.push(['html', 'factoryAmt', formatDefault(player.buildings[1].amount)]);
    //displayData.push(['html', 'factoryBuildLabel', BUILDS_DATA[1].id]);
    //displayData.push(['html', 'factoryCostLabel', formatWhole(BUILDS_DATA[1].cost)]);
    displayData.push(['html', 'necropolisProd', formatDefault(getBuildingProdPerSec(2))]);
    displayData.push(['html', 'necropolisAmt', formatDefault(player.buildings[2].amount)]);
    //displayData.push(['html', 'necropolisBuildLabel', BUILDS_DATA[2].id]);
    //displayData.push(['html', 'necropolisCostLabel', formatWhole(BUILDS_DATA[2].cost)]);
    displayData.push(['html', 'sunProd', formatDefault(getBuildingProdPerSec(3))]);
    displayData.push(['html', 'sunAmt', formatDefault(player.buildings[3].amount)]);
    //displayData.push(['html', 'sunBuildLabel', BUILDS_DATA[3].id]);
    //displayData.push(['html', 'sunCostLabel', formatWhole(BUILDS_DATA[3].cost)]);
    //document.getElementById('sunGainSpan').style.display = player.astralFlag ? 'block' : 'none'
    //document.getElementById('sunGainNotice').style.display = player.astralFlag ? 'none' : 'block'
    displayData.push(['html', 'acolyteEff', formatDefault2(BUILDS_DATA[2].resourceEff())]);
    displayData.push(['html', 'brickKeepDisplay', ` ${formatUnitRow(getAchievementEffect(15))} `]);
    var buildingTextElements = document.getElementsByClassName('buildingResourceTexts');
    for (var el=0; el<buildingTextElements.length; el++) {
        displayData.push(['html', buildingTextElements[el].id, buildingSingulizer(buildingTextElements[el].id)]);
    }
}

function updateTimeDisplays() {
    displayData.push(['html', 'trueTimeAmt', formatUnitRow(player.trueEssence)]);
    displayData.push(['html', 'antiTimeAmt', formatUnitRow(player.antiEssence)]);
    displayData.push(['html', 'trueTimeGain', formatUnitRow(getTimeDimProdPerSecond(1).times(player.truePercent/100))]);
    displayData.push(['html', 'antiTimeGain', formatUnitRow(getTimeDimProdPerSecond(1).times(player.antiPercent/100))]);
    displayData.push(['html', 'trueTimeBuff', formatDefault2(getTrueTimeBuff())]);
    displayData.push(['html', 'antiTimeBuff', formatDefault2(getAntiTimeBuff())]);
    displayData.push(['html', 'trueTimeNerf', formatDefault2(getTrueTimeNerf())]);
    displayData.push(['html', 'antiTimeNerf', formatDefault2(getAntiTimeNerf())]);
    displayData.push(['html', 'crystalAmt', ' ' + formatDefault(player.crystals) + ' ']);
    if (player.allTimeStats.totalCrystals.gte(2000)) {
        displayData.push(['setProp', 'timePresDesc', 'display', 'none']);
        displayData.push(['setProp', 'crystalRateDesc', 'display', 'block']);
        displayData.push(['html', 'crystalRateDesc', '(' + formatDefault(calculateCrystalsPerMin()) + '/min)'])
    }
    let timeTextElements = document.getElementsByClassName('timeResourceTexts');
    for (let el=0; el<timeTextElements.length; el++) {
        displayData.push(['html', timeTextElements[el].id, timeSingulizer(timeTextElements[el].id)]);
    }
}

function updatePrestigeDisplays() {
    updateSpacePrestigeDisplay();
    updateTimePrestigeDisplay();
}

function updateSpacePrestigeDisplay() {
    if (canSpacePrestige() && !document.getElementById('spacePrestige').classList.contains('spacePrestigeBut')) {
        addPresClass('space', 'spacePrestigeBut');
        remPresClass('space', 'unclickablePrestige');
    } else if (!canSpacePrestige() && document.getElementById('spacePrestige').classList.contains('spacePrestigeBut')) {
        remPresClass('space', 'spacePrestigeBut');
        addPresClass('space', 'unclickablePrestige');
    }
    if (player.spaceResets.lt(3)) {
        displayData.push(['setProp', 'spacePresDesc', 'display', 'block']);
        if (player.spaceResets.gt(1)) {
            displayData.push(['html', 'spacePresUnlock', 'Time Warp']);
        } else if (player.spaceResets.gt(0)) {
            displayData.push(['html', 'spacePresUnlock', 'Construction Upgrades']);
        } else {
            displayData.push(['html', 'spacePresUnlock', 'Buildings']);
        }
    } else { displayData.push(['setProp', 'spacePresDesc', 'display', 'none']); }
    displayData.push(['html', 'prestigeReq', `Requires <span style="font-size: 17pt; white-space: pre;"> ${formatWhole(player.nextSpaceReset[0])} </span> ${unitSingulizer(player.nextSpaceReset[1], player.nextSpaceReset[0])}`]);
}

function updateTimePrestigeDisplay() {
    if (canTimePrestige() && !document.getElementById('timePrestige').classList.contains('timePrestigeBut')) {
        addPresClass('time', 'timePrestigeBut');
        remPresClass('time', 'unclickablePrestige');
        displayData.push(['setProp', 'timePrestigeReq', 'display', 'none']);
        displayData.push(['setProp', 'timePrestigeGainDesc', 'display', '']);
    } else if (!canTimePrestige() && document.getElementById('timePrestige').classList.contains('timePrestigeBut')) {
        remPresClass('time', 'timePrestigeBut');
        addPresClass('time', 'unclickablePrestige');
        displayData.push(['setProp', 'timePrestigeReq', 'display', '']);
        displayData.push(['setProp', 'timePrestigeGainDesc', 'display', 'none']);
    }
    displayData.push(['html', 'timePrestigeGain', ` ${formatDefault(calculateCrystalGain())} `]);
}

function updateTierDisplays() {
    updateUnitTiers();
    updateTDimTiers();
}

function updateUnitTiers() {
    for (var i=1; i<=NUM_UNITS; i++) {
        if (player.units[i].unlocked && canAffordUnit(i) && !document.getElementById(UNITS_DATA[i].buttonID).classList.contains('unitBut')) {
            addUnitClass(i, 'unitBut');
            remUnitClass(i, 'unclickableUnit');
            displayData.push(['addClass', UNITS_DATA[i].maxID, 'unitMax']);
            displayData.push(['remClass', UNITS_DATA[i].maxID, 'unclickableMax']);
        } else if (player.units[i].unlocked && !canAffordUnit(i) && document.getElementById(UNITS_DATA[i].buttonID).classList.contains('unitBut')) {
            remUnitClass(i, 'unitBut');
            addUnitClass(i, 'unclickableUnit');
            displayData.push(['remClass', UNITS_DATA[i].maxID, 'unitMax']);
            displayData.push(['addClass', UNITS_DATA[i].maxID, 'unclickableMax']);
        }
        displayData.push(['html', UNITS_DATA[i].amountID, `<div style="min-width: 35%; float: left;">${formatUnitRow(player.units[i].amount)}</div><div style="min-width: 35%; float: left;">(${formatWholeUnitRow(player.units[i].bought)})</div><div style="min-width: 30%; float: left;">${getUnitProdPerSecond(i).gt(0) ? "(+" + formatDefault(Decimal.times((getUnitProdPerSecond(i).div(player.units[i].amount.max(1))), 100), 2) + "%/s)</div>" : ""}`]);
        displayData.push(['html', UNITS_DATA[i].multID, `<div style="min-width: 45%; float: left;">${formatUnitRow2(UNITS_DATA[i].corpseMult())}x</div><div style="min-width: 45%; float: left;">(${(i > 1) ? formatUnitRow2(UNITS_DATA[i].prodMult()) : "~"}x)</div>`]);
        displayData.push(['html', UNITS_DATA[i].buttonID, `Cost: ${formatWhole(UNITS_DATA[i].cost())} corpses`]);
        displayData.push(['html', UNITS_DATA[i].maxID, canAffordUnit(i) ? `Max: ${calculateMaxUnits(i)} for &#162;${formatWhole(calculateMaxUnitsCost(i))}` : "Max: 0"]);
    }
}

function updateTDimTiers() {
    for (var i=1; i<=NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].unlocked && canAffordTime(i) && !document.getElementById(TIME_DATA[i].buttonID).classList.contains('unitButT')) {
            addTDimClass(i, 'unitButT');
            remTDimClass(i, 'unclickableUnitT');
            displayData.push(['addClass', TIME_DATA[i].maxID, 'unitMaxT']);
            displayData.push(['remClass', TIME_DATA[i].maxID, 'unclickableMaxT']);
        } else if (player.timeDims[i].unlocked && !canAffordTime(i) && document.getElementById(TIME_DATA[i].buttonID).classList.contains('unitButT')) {
            remTDimClass(i, 'unitButT');
            addTDimClass(i, 'unclickableUnitT');
            displayData.push(['remClass', TIME_DATA[i].maxID, 'unitMaxT']);
            displayData.push(['addClass', TIME_DATA[i].maxID, 'unclickableMaxT']);
        }
        displayData.push(['html', TIME_DATA[i].amountID, `<div style="min-width: 30%; float: left;">${formatUnitRow(player.timeDims[i].amount)}</div><div style="min-width: 30%; float: left;">(${formatWholeUnitRow(player.timeDims[i].bought)})</div><div style="min-width: 40%; float: left;">${getTimeDimProdPerSecond(i + 1).gt(0) ? "(+" + formatDefault(Decimal.times((getTimeDimProdPerSecond(i + 1).div(player.timeDims[i].amount.max(1))), 100), 2) + "%/s)</div>" : ""}`]);
        displayData.push(['html', TIME_DATA[i].multID, `<div>${formatUnitRow2(TIME_DATA[i].mult())}x</div>`]);
        displayData.push(['html', TIME_DATA[i].buttonID, `Cost: ${formatWhole(TIME_DATA[i].cost())} crystals`]);
        displayData.push(['html', TIME_DATA[i].maxID, canAffordTime(i) ? `Max: ${calculateMaxTime(i)} for &#162;${formatWhole(calculateMaxTimeCost(i))}` : "Max: 0"]);
    }
}

//style/display updaters for unlocks

function unlockElements(mainTab, subTab) {
    let data = UNLOCKS_DATA[mainTab][subTab];
    let element;
    player.unlocks[mainTab][subTab] = true;
    if (data.idsToShow.length > 0) {
        for (let i=0; i<data.idsToShow.length; i++) {
            element = document.getElementById(data.idsToShow[i]);
            if (element.tagName == 'TR') { displayData.push(['setProp', element.id, 'display', 'table-row']); } 
            else if (element.tagName == 'TD') { displayData.push(['setProp', element.id, 'display', 'table-cell']); }
            else { displayData.push(['setProp', element.id, 'display', 'block']); }
        }
    }
    if (data.idsToHide.length > 0) {
        for (let i=0; i<data.idsToHide.length; i++) {
            displayData.push(['setProp', data.idsToHide[i], 'display', 'none']);
        }
    }
    if (data.classToHide !== undefined) {
        let els = document.getElementsByClassName(data.classToHide);
        for (let i=0; i<els.length; i++) { displayData.push(['setProp', els[i].id, 'display', 'none']); }
    }
    if (data.classToEnable !== undefined) {
        let els = document.getElementsByClassName(data.classToEnable);
        for (let i=0; i<els.length; i++) { els[i].disabled = false; }
    }

    if (UNLOCKS_DATA[mainTab][subTab].shouldNotify()) {
        if (data.notifyID !== undefined) { displayData.push(['addClass', data.notifyID, 'tabButNotify']); }
        if (data.parentNotify !== undefined) { displayData.push(['addClass', data.parentNotify, 'tabButIndirectNotify']); }
    } 
}

function unlockElementsOnLoad(mainTab, subTab) {
    let data = UNLOCKS_DATA[mainTab][subTab];
    let element;
    player.unlocks[mainTab][subTab] = true;
    if (data.idsToShow.length > 0) {
        for (let i=0; i<data.idsToShow.length; i++) {
            element = document.getElementById(data.idsToShow[i]);
            if (element.tagName == 'TR') { displayData.push(['setProp', element.id, 'display', 'table-row']); } 
            else if (element.tagName == 'TD') { displayData.push(['setProp', element.id, 'display', 'table-cell']); }
            else { displayData.push(['setProp', element.id, 'display', 'block']); }
        }
    }
    if (data.idsToHide.length > 0) {
        for (let i=0; i<data.idsToHide.length; i++) {
            displayData.push(['setProp', data.idsToHide[i], 'display', 'none']);
        }
    }
    if (data.classToHide !== undefined) {
        let els = document.getElementsByClassName(data.classToHide);
        for (let i=0; i<els.length; i++) { displayData.push(['setProp', els[i].id, 'display', 'none']); }
    }
    if (data.classToEnable !== undefined) {
        let els = document.getElementsByClassName(data.classToEnable);
        for (let i=0; i<els.length; i++) { els[i].disabled = false; }
    }
}

function lockElements(mainTab, subTab) {
    let data = UNLOCKS_DATA[mainTab][subTab];
    let element;
    player.unlocks[mainTab][subTab] = false;
    if (data.idsToShow.length > 0) {
        for (let i=0; i<data.idsToShow.length; i++) {
            displayData.push(['setProp', data.idsToShow[i], 'display', 'none']);
        }
    }
    if (data.idsToHide.length > 0) {
        for (let i=0; i<data.idsToHide.length; i++) {
            element = document.getElementById(data.idsToHide[i]);
            if (element.tagName == 'TR') { displayData.push(['setProp', element.id, 'display', 'table-row']); } 
            else if (element.tagName == 'TD') { displayData.push(['setProp', element.id, 'display', 'table-cell']); }
            else { displayData.push(['setProp', data.idsToHide[i], 'display', 'block']); }
        }
    }
    if (data.classToHide !== undefined) {
        let els = document.getElementsByClassName(data.classToHide);
        for (let i=0; i<els.length; i++) { displayData.push(['setProp', els[i].id, 'display', '']); }
    }
    if (data.classToEnable !== undefined) {
        let els = document.getElementsByClassName(data.classToEnable);
        for (let i=0; i<els.length; i++) { els[i].disabled = true; }
    }
}

function lockTab(mainTab) {
    copyData(player.unlocks[mainTab], START_PLAYER.unlocks[mainTab]);
    for (let subTab in UNLOCKS_DATA[mainTab]) {
        lockElements(mainTab, subTab);
    }
}

//misc style/display updaters

function formatCrystalsPerSec() {
    let crys = calculateCrystalsPerSec();


}

function toggleAstralDisplay() {
    displayData.push(['togDisplay', 'brickGainDiv']);
    displayData.push(['togClass', 'astralToggle', 'astralBut']);
    displayData.push(['togClass', 'astralToggle', 'astralOn']);
    displayData.push(['html', 'astralText', player.astralFlag ? 'disable' : 'enable']);
    displayData.push(['togDisplay', 'astralNotice']);
    displayData.push(['html', 'normalAstral', player.astralFlag ? 'ASTRAL' : 'NORMAL']);
    displayData.push(['setProp', 'normalAstral', 'color', player.astralFlag ? '#42d35a' : 'white']);
    displayData.push(['setProp', 'normalAstral', 'color', player.astralFlag ? '#42d35a' : 'white']);
    displayData.push(['togDisplay', 'sunGainSpan']);
    displayData.push(['togDisplay', 'sunGainNotice']);
}

function toggleTimeLockDisplay() {
    displayData.push(['togClass', 'lockInTimeBut', 'unclickSliderBut']);
    displayData.push(['togClass', 'lockInTimeBut', 'timeSliderBut']);
    displayData.push(['togClass', 'respecTimeBut', 'timeSliderBut']);
    displayData.push(['togClass', 'respecTimeBut', 'unclickSliderBut']);
    displayData.push(['togClass', 'timeSlider', 'sliderLocked']);
    displayData.push(['togClass', 'timeSlider', 'slider']);
}

function updateSingleBuyer(id, option, button) {
    player.autobuyers[id][option] = !player.autobuyers[id][option];
    if(player.autobuyers[id][option]) {
        document.getElementById(button).innerHTML = (option == 'on' ? 'ON' : (option == 'fast' ? 'FAST' : 'MAX'));
    } else {
        document.getElementById(button).innerHTML = (option == 'on' ? 'OFF' : (option == 'fast' ? 'SLOW' : 'SINGLE'));
    }
}

function updateBuyerOrder(tier, id) {
    let pri = parseInt(document.getElementById(id).value);
    let index = newPriority.indexOf(tier);
    if (newPriority[pri-1] === undefined) { newPriority[pri-1] = parseInt(tier); }
    else {
        if (index>=0) { newPriority.splice(index, 1); }
        newPriority.splice(pri-1, 0, tier);
    }
}

function updateSacBuyer() {
    let sacMethod = document.getElementById('sacrificeBuyerAdvancedList');
    document.getElementById('sacrificeBuyerAmountLabel').innerHTML = sacMethod.options[sacMethod.selectedIndex].text;
    player.autobuyers[9]['amount'] = new Decimal(document.getElementById('sacrificeBuyerAmount').value);
    player.autobuyers[9]['type'] = document.getElementById('sacrificeBuyerAdvancedList').value;
}

function updatePrestigePriority() {
    player.autobuyers[10]['priority'] = !player.autobuyers[10]['priority'];
    document.getElementById('prestigeBuyerPriorityBut').innerHTML = player.autobuyers[10]['priority'] ? 'YES' : 'NO'
}

function updateAutobuyersDisplay() {
    for (var i=1; i<9; i++) {
        document.getElementById(player.autobuyers.priority[i-1].toString() + (i).toString()).selected = true;
        var unitName = UNITS_DATA[i].single.replace(' ', '');
        document.getElementById(unitName + 'EnabledBut').innerHTML = player.autobuyers[i]['on'] ? 'ON' : 'OFF'
        document.getElementById(unitName + 'SpeedBut').innerHTML = player.autobuyers[i]['fast'] ? 'FAST' : 'SLOW'
        document.getElementById(unitName + 'BulkBut').innerHTML = player.autobuyers[i]['bulk'] ? 'MAX' : 'SINGLE'
    }

    document.getElementById('sacrificeEnabledBut').innerHTML = player.autobuyers[9]['on'] ? 'ON' : 'OFF'
    document.getElementById('sacrificeSpeedBut').innerHTML = player.autobuyers[9]['fast'] ? 'FAST' : 'SLOW'
    document.getElementById('sacrificeBuyerAmount').value = formatWholeNoComma(player.autobuyers[9]['amount']);
    document.getElementById('sacrificeBuyerAdvancedList').options.namedItem(player.autobuyers[9]['type']).selected = true;
    let sacMethod = document.getElementById('sacrificeBuyerAdvancedList');
    document.getElementById('sacrificeBuyerAmountLabel').innerHTML = sacMethod.options[sacMethod.selectedIndex].text;

    document.getElementById('prestigeEnabledBut').innerHTML = player.autobuyers[10]['on'] ? 'ON' : 'OFF'
    document.getElementById('prestigeSpeedBut').innerHTML = player.autobuyers[10]['fast'] ? 'FAST' : 'SLOW'
    document.getElementById('prestigeBuyerPriorityBut').innerHTML = player.autobuyers[10]['priority'] ? 'YES' : 'NO'
}

function updateSliderDisplay() {
    player.truePercent = 100 - Number(document.getElementById('timeSlider').value);
    player.antiPercent = Number(document.getElementById('timeSlider').value);
    displayData.push(['html', 'sliderValueRight', player.antiPercent]);
    displayData.push(['html', 'sliderValueLeft', player.truePercent]);
}

//generic UI stuff (tabs, toggles, popups etc)

function toggleTooltips() {
    player.tooltipsEnabled = !player.tooltipsEnabled;
    if (player.tooltipsEnabled) { document.getElementById('toggleTooltips').innerHTML = 'TOGGLE FORMULA TOOLTIPS: ON'; }
    else { document.getElementById('toggleTooltips').innerHTML = 'TOGGLE FORMULA TOOLTIPS: OFF'; }

    document.getElementById('brickTooltip').classList.toggle('tooltip');
    document.getElementById('trueTooltip').classList.toggle('tooltip');
    document.getElementById('antiTooltip').classList.toggle('tooltip');
    document.getElementById('factoryTooltip').classList.toggle('tooltip');
    document.getElementById('necropolisTooltip').classList.toggle('tooltip');
    document.getElementById('sunTooltip').classList.toggle('tooltip');
    document.getElementById('timePrestige').classList.toggle('tooltip');
    document.getElementById('achBoostTooltip').classList.toggle('tooltip');
    for (let b in BUILDS_DATA) {
        for (let u in BUILDS_DATA[b].upgrades) {
            if (BUILDS_DATA[b].upgrades[u].displayTooltip) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.toggle('tooltip'); }
        }
    }
    for (let t in TIME_DATA.upgrades) {
        if (TIME_DATA.upgrades[t].displayTooltip) { document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.toggle('tooltip'); }
    }
}

function showChangelog(divID) {
    var allDivs = document.getElementsByClassName('changelogPageDiv');
    var tab;
    for (var i=0; i<allDivs.length; i++) {
        tab = allDivs.item(i);
        if (tab.id === divID) {
            (tab.style.display == 'block') ? tab.style.display = 'none': tab.style.display = 'block'
        } else {
            tab.style.display = 'none';
        }
    }
}

function toggleConfirmations(action, method, id) {
    player.confirmations[action][method] = !player.confirmations[action][method];
    if (player.confirmations[action][method]) {
        document.getElementById(id).innerHTML = "ON";
    } else {
        document.getElementById(id).innerHTML = "OFF";
    }
}

function openConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'block';
}

function closeConfirmationsPopup() {
    document.getElementById('confirmationsPopup').style.display = 'none';
}

function showTab(tabName, buttonName) {
    let bName = tabName + 'But'
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
        }
    }
    if (document.getElementById('helpDiv').style.display != 'none') {
        displayData.push(['togDisplay', 'helpDiv']);
        displayData.push(['togClass', 'helpTabBut', 'tabButSelected'])
    }
    displayData.push(['addClass', bName, 'tabButSelected'])
    player.activeTabs[0] = tabName;
    if (buttonName !== undefined) { document.getElementById(buttonName).classList.remove('tabButNotify'); }
}

function showStatsSubTab(subTabName) {
    let bName = subTabName + 'But'
    var allSubTabs = document.getElementsByClassName('statSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
        }
    }
    displayData.push(['addClass', bName, 'tabButSelected'])
    player.activeTabs[4] = subTabName;
}

function showUnitSubTab(subTabName, buttonName, parentButton) {
    let bName = subTabName + 'But'
    var allSubTabs = document.getElementsByClassName('unitSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
        }
    }
    player.activeTabs[1] = subTabName;
    if (buttonName !== undefined) {
        document.getElementById(buttonName).classList.remove('tabButNotify');
        document.getElementById(parentButton).classList.remove('tabButIndirectNotify');
    }
    displayData.push(['addClass', bName, 'tabButSelected'])
}

function showBuildingSubTab(subTabName, buttonName, parentButton) {
    let bName = subTabName + 'But'
    var allSubTabs = document.getElementsByClassName('buildingSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
        }
    }
    player.activeTabs[2] = subTabName;
    if (buttonName !== undefined) {
        document.getElementById(buttonName).classList.remove('tabButNotify');
        document.getElementById(parentButton).classList.remove('tabButIndirectNotify');
    }
    displayData.push(['addClass', bName, 'tabButSelected'])
}

function showTimeSubTab(subTabName, buttonName, parentButton) {
    let bName = subTabName + 'But'
    var allSubTabs = document.getElementsByClassName('timeSubTab');
    var tab;
    for (var i=0; i<allSubTabs.length; i++) {
        tab = allSubTabs.item(i);
        if (tab.id === subTabName) {
            tab.style.display = 'block';
            tab.classList.remove('tabButSelected');
        } else {
            tab.style.display = 'none';
            document.getElementById(tab.id + 'But').classList.remove('tabButSelected');
        }
    }
    player.activeTabs[3] = subTabName;
    if (buttonName !== undefined) {
        document.getElementById(buttonName).classList.remove('tabButNotify');
        document.getElementById(parentButton).classList.remove('tabButIndirectNotify');
    }
    displayData.push(['addClass', bName, 'tabButSelected'])
}

function isActiveTab(tabName) {
    return (document.getElementById(tabName).style.display == 'block');
}

function getActiveTab() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            return tab.id;
        }
    }
    return null;
}

function getActiveTabs() {
    var allTabs = document.getElementsByClassName('pageTab');
    var tab;
    var allSubTabs = document.getElementsByClassName('subTab');
    var subTab;
    var aTabs = [];
    for (var i=0; i<allTabs.length; i++) {
        tab = allTabs.item(i);
        if (tab.style.display === 'block') {
            aTabs.push(tab.id);
        }
    }
    for (var j=0; j<allSubTabs.length; j++) {
        subTab = allSubTabs.item(j);
        if (subTab.style.display === 'block') {
            aTabs.push(subTab.id);
        }
    }
    return aTabs;
}

function updateUnlocks() {
    for (var tab in UNLOCKS_DATA) {
        for (var key in UNLOCKS_DATA[tab]) {
            if (!player.unlocks[tab][key] && UNLOCKS_DATA[tab][key].condition()) { unlockElements(tab, key) }
            else if (!player.unlocks[tab][key] && key == 'mainTab') { break; }
        }
    }
    for (var i=1; i<NUM_UNITS; i++) {
        if (player.units[i].bought.gte(1) && canUnlock(i+1)) {
            player.units[i+1].unlocked = true;
            displayData.push(['setProp', UNITS_DATA[i+1].rowID, 'display', 'table-row']);
        } 
    }
    for (var i=1; i<NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].bought.gte(1) && !player.timeDims[i+1].unlocked) {
            player.timeDims[i+1].unlocked = true;
            displayData.push(['setProp', TIME_DATA[i+1].rowID, 'display', 'table-row']);
        } 
    }
}

function updateAchievements() {
    for (let id in ACH_DATA) {
        if (!player.achievements[id].unlocked && ACH_DATA[id].canUnlock()) {
            ACH_DATA[id].onUnlock();
            player.achievements[id].unlocked = true;
            player.achievements[id].new = true;
            displayData.push(['addClass', ACH_DATA[id].divID, 'achievementUnlocked']);
            displayData.push(['addClass', ACH_DATA[id].divID, 'achievementNew']);
            displayData.push(['remClass', ACH_DATA[id].divID, 'achievement']);
            displayData.push(['addClass', 'achSubTabBut', 'tabButNotify']);
            displayData.push(['addClass', 'statsTabBut', 'tabButIndirectNotify']);
            displayData.push(['setProp', 'achUnlockPopup', 'opacity', '1']);
            popupShownTime = (new Date).getTime();
        }
    }
}

function mouseoverAchievement(ach) {
    if (player.achievements[ach].new) {
        player.achievements[ach].new = false;
        displayData.push(['remClass', ACH_DATA[ach].divID, 'achievementNew']);
        for (let id in player.achievements) {
            if (player.achievements[id].new) { return; }
        }
        displayData.push(['remClass', 'achSubTabBut', 'tabButNotify']);
        displayData.push(['remClass', 'statsTabBut', 'tabButIndirectNotify']);
    }
}

function closeOfflinePopup() {
    document.getElementById('offlineGainPopup').style.display = 'none';
}

//singulizers

function buildingSingulizer(id) {
    var firstFour = id.slice(0,4);
    var gain = (id.slice(-1) == 'n');
    switch (firstFour) {
        case 'astr':
            if (gain) {
                if (getBricksPerSecond().eq(1)) { return "astral brick"; }
                else { return "astral bricks"; }
            } else {
                if (player.bricks.eq(1)) { return "astral brick"; }
                else { return "astral bricks"; }
            }
        case 'arma':
            if (gain) {
                if (BUILDS_DATA[1].prod().eq(1)) { return "armament"; }
                else { return "armaments"; }
            } else {
                if (player.buildings[1].amount.eq(1)) { return "armament"; }
                else { return "armaments"; }
            }
        case 'acol':
            if (gain) {
                if (BUILDS_DATA[2].prod().eq(1)) { return "acolyte"; }
                else { return "acolytes"; }
            } else {
                if (player.buildings[2].amount.eq(1)) { return "acolyte"; }
                else { return "acolytes"; }
            }
        case 'phot':
            if (gain) {
                if (BUILDS_DATA[3].prod().eq(1)) { return "nekro-photon"; }
                else { return "nekro-photons"; }
            } else {
                if (player.buildings[3].amount.eq(1)) { return "nekro-photon"; }
                else { return "nekro-photons"; }
            }      
        case 'bric':
            if (gain) {
                if (getBricksPerSecond().eq(1)) { return "brick"; }
                else { return "bricks"; }
            } else {
                if (player.bricks.eq(1)) { return "brick"; }
                else { return "bricks"; }
            }
    }
}

function corpseSingulizer(gain=true) {
    if (gain) {
        if (getCorpsesPerSecond().eq(1)) { return "corpse"; }
        else { return "corpses"; }
    } else {
        if (player.corpses.eq(1)) { return "corpse"; }
        else { return "corpses"; }
    }
}

function worldSingulizer() {
    if (player.worlds.eq(1)) { return "world"; }
    else { return "worlds"; }
}

function timeSingulizer(id) {
    var firstFour = id.slice(0,4);
    var gain = (id.slice(-1) == 'n');
    switch (firstFour) {
        case 'crys':
            if (gain) {
                if (calculateCrystalGain().eq(1)) { return "time crystal"; }
                else { return "time crystals"; }
            } else {
                if (player.crystals.eq(1)) { return "time crystal"; }
                else { return "time crystals"; }
            }
    }
}

function unitSingulizer(tier, number) {
    if (typeof number === 'Decimal') {
        if (number.eq(1)) { return UNITS_DATA[tier].single }
        else { return UNITS_DATA[tier].plural }
    } else {
        if (number == 1) { return UNITS_DATA[tier].single }
        else { return UNITS_DATA[tier].plural }
    }
}

//help text generators + related

function checkUnlocked(tab, unlock) {
    return player.unlocks[tab][unlock];
}

function showHelp() {
    displayData.push(['togDisplay', 'helpDiv']); 
    displayData.push(['togClass', 'helpTabBut', 'tabButSelected'])
    var active = getActiveTab();
        
    if (HELP_TEXTS[active] === undefined) {return;}
    document.getElementById('helpText').innerHTML = generateHelpText(active);
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

function statsTabClick() {
    generateLastRuns();
    updateStatsTab();
    showTab('statsTab', 'statsTabBut');
    showStatsSubTab(player.activeTabs[4], player.activeTabs[4] + 'But');
}

function statsSubTabClick(tabName='statSubTab', butName='statSubTabBut') {
    generateLastRuns();
    updateStatsTab();
    showTab('statsTab', 'statsTabBut');
    showStatsSubTab(tabName, butName);
}

function generateLastRuns() {
    let totalGain = new Decimal(0);
    let totalTime = 0;
    let runGain = new Decimal(0);
    let data = player.pastRuns.lastTen;
    let count = 0;

    for (let i=0; i<10; i++) {
        if (data[i].timeSpent == 0) {break}
        runGain = data[i].crystalGain.div(data[i].timeSpent/(1000*60));
        document.getElementById('last' + (i+1).toString()).innerHTML = `${formatTime(data[i].timeSpent, 'num')}; ${formatDefault2(data[i].crystalGain)} crystals; ${ formatDefault2(runGain) + " crystals/min" }`;
        totalGain = totalGain.plus(data[i].crystalGain);
        totalTime += data[i].timeSpent;
        count++;
    }
    if (count==0) {
        document.getElementById('last1').innerHTML = "you don't have any past runs!";
        return;
    }

    document.getElementById('statAvgs').innerHTML = `${formatTime(totalTime/count, 'num')}; ${formatDefault2(totalGain/count)} crystals; ${ formatDefault2(totalGain.div(totalTime/(60*1000))) + " crystals/min" }`;
}

function updateStatsTab() {
    document.getElementById('totCorpses').innerHTML = formatWhole(player.allTimeStats.totalCorpses);
    document.getElementById('totBricks').innerHTML = formatWhole(player.allTimeStats.totalBricks);
    document.getElementById('totWorlds').innerHTML = formatWhole(player.allTimeStats.totalWorlds);
    document.getElementById('totCrystals').innerHTML = formatWhole(player.allTimeStats.totalCrystals);
    document.getElementById('bestCorpses').innerHTML = formatWhole(player.allTimeStats.bestCorpses);
    document.getElementById('bestBricks').innerHTML = formatWhole(player.allTimeStats.bestBricks);
    document.getElementById('bestWorlds').innerHTML = formatWhole(player.allTimeStats.bestWorlds);
    document.getElementById('bestCrystals').innerHTML = formatWhole(player.allTimeStats.bestCrystals);
    document.getElementById('totPrestige').innerHTML = formatWhole(player.allTimeStats.totalSpaceResets);
    document.getElementById('totSacrifice').innerHTML = formatWhole(player.allTimeStats.totalTimeResets);
    document.getElementById('bestGain').innerHTML = formatWhole(player.bestCrystalGain);
    document.getElementById('bestRate').innerHTML = formatWhole(player.bestCrystalRate);

    document.getElementById('totCorpsesRun').innerHTML = formatWhole(player.thisSacStats.totalCorpses);
    document.getElementById('totBricksRun').innerHTML = formatWhole(player.thisSacStats.totalBricks);
    document.getElementById('totWorldsRun').innerHTML = formatWhole(player.thisSacStats.totalWorlds);
    document.getElementById('bestCorpsesRun').innerHTML = formatWhole(player.thisSacStats.bestCorpses);
    document.getElementById('bestBricksRun').innerHTML = formatWhole(player.thisSacStats.bestBricks);
    document.getElementById('bestWorldsRun').innerHTML = formatWhole(player.thisSacStats.bestWorlds);
    document.getElementById('totPrestigeRun').innerHTML = formatWhole(player.thisSacStats.totalSpaceResets);
}

//add/remove/set/toggle etc for QoL

function addBButtonClass(b, className) {
    displayData.push(['addClass', BUILDS_DATA[b].buildingButtonID, className]);
}

function remBButtonClass(b, className) {
    displayData.push(['remClass', BUILDS_DATA[b].buildingButtonID, className]);
}

function togBButtonClass(b, className) {
    displayData.push(['remClass', BUILDS_DATA[b].buildingButtonID, className]);
}

function setAttrBButton(b, attr, val) {
    displayData.push(['setAttr', BUILDS_DATA[b].buildingButtonID, attr, val]);
}

function setPropBButton(b, prop, val) {
    displayData.push(['setProp', BUILDS_DATA[b].buildingButtonID, prop, val]);
}

function togDisplayBButton(b) {
    displayData.push(['togDisplay', BUILDS_DATA[b].buildingButtonID]);
}

function writeHTMLBButton(b, text) {
    displayData.push(['html', BUILDS_DATA[b].buildingButtonID, text]);
}

function addBUpgClass(b, u, className) {
    displayData.push(['addClass', BUILDS_DATA[b].upgrades[u].buttonID, className]);
}

function remBUpgClass(b, u, className) {
    displayData.push(['remClass', BUILDS_DATA[b].upgrades[u].buttonID, className]);
}

function togBUpgClass(b, u, className) {
    displayData.push(['remClass', BUILDS_DATA[b].upgrades[u].buttonID, className]);
}

function setAttrBUpg(b, u, attr, val) {
    displayData.push(['setAttr', BUILDS_DATA[b].upgrades[u].buttonID, attr, val]);
}

function setPropBUpg(b, u, prop, val) {
    displayData.push(['setProp', BUILDS_DATA[b].upgrades[u].buttonID, prop, val]);
}

function togDisplayBUpg(b, u) {
    displayData.push(['togDisplay', BUILDS_DATA[b].upgrades[u].buttonID]);
}

function writeHTMLBUpg(b, u, text) {
    displayData.push(['html', BUILDS_DATA[b].upgrades[u].buttonID, text]);
}

function addCUpgClass(c, className) {
    displayData.push(['addClass', CONSTR_DATA[c].buttonID, className]);
}

function remCUpgClass(c, className) {
    displayData.push(['remClass', CONSTR_DATA[c].buttonID, className]);
}

function togCUpgClass(c, className) {
    displayData.push(['remClass', CONSTR_DATA[c].buttonID, className]);
}

function setAttrCUpg(c, attr, val) {
    displayData.push(['setAttr', CONSTR_DATA[c].buttonID, attr, val]);
}

function setPropCUpg(c, prop, val) {
    displayData.push(['setProp', CONSTR_DATA[c].buttonID, prop, val]);
}

function togDisplayCUpg(c) {
    displayData.push(['togDisplay', CONSTR_DATA[c].buttonID]);
}

function writeHTMLCUpg(c, text) {
    displayData.push(['html', CONSTR_DATA[c].buttonID, text]);
}

function addTUpgClass(t, className) {
    displayData.push(['addClass', TIME_DATA.upgrades[t].buttonID, className]);
}

function remTUpgClass(t, className) {
    displayData.push(['remClass', TIME_DATA.upgrades[t].buttonID, className]);
}

function togTUpgClass(t, className) {
    displayData.push(['remClass', TIME_DATA.upgrades[t].buttonID, className]);
}

function setAttrTUpg(t, attr, val) {
    displayData.push(['setAttr', TIME_DATA.upgrades[t].buttonID, attr, val]);
}

function setPropTUpg(t, prop, val) {
    displayData.push(['setProp', TIME_DATA.upgrades[t].buttonID, prop, val]);
}

function togDisplayTUpg(t) {
    displayData.push(['togDisplay', TIME_DATA.upgrades[t].buttonID]);
}

function writeHTMLTUpg(t, text) {
    displayData.push(['html', TIME_DATA.upgrades[t].buttonID, text]);
}

function addUnitClass(tier, className) {
    displayData.push(['addClass', UNITS_DATA[tier].buttonID, className]);
}

function remUnitClass(tier, className) {
    displayData.push(['remClass', UNITS_DATA[tier].buttonID, className]);
}

function togUnitClass(tier, className) {
    displayData.push(['remClass', UNITS_DATA[tier].buttonID, className]);
}

function setAttrUnit(tier, attr, val) {
    displayData.push(['setAttr', UNITS_DATA[tier].buttonID, attr, val]);
}

function setPropUnit(tier, prop, val) {
    displayData.push(['setProp', UNITS_DATA[tier].buttonID, prop, val]);
}

function togDisplayUnit(tier) {
    displayData.push(['togDisplay', UNITS_DATA[tier].rowID]);
}

function writeHTMLUnit(tier, text) {
    displayData.push(['html', UNITS_DATA[tier].buttonID, text]);
}

function addTDimClass(tier, className) {
    displayData.push(['addClass', TIME_DATA[tier].buttonID, className]);
}

function remTDimClass(tier, className) {
    displayData.push(['remClass', TIME_DATA[tier].buttonID, className]);
}

function togTDimClass(tier, className) {
    displayData.push(['togClass', TIME_DATA[tier].buttonID, className]);
}

function setAttrTDim(tier, attr, val) {
    displayData.push(['setAttr', TIME_DATA[tier].buttonID, attr, val]);
}

function setPropTDim(tier, prop, val) {
    displayData.push(['setProp', TIME_DATA[tier].buttonID, prop, val]);
}

function togDisplayTDim(tier) {
    displayData.push(['togDisplay', TIME_DATA[tier].rowID]);
}

function writeHTMLTDim(tier, text) {
    displayData.push(['html', TIME_DATA[tier].buttonID, text]);
}

function addPresClass(presType, className) {
    displayData.push(['addClass', presType + 'Prestige', className]);
}

function remPresClass(presType, className) {
    displayData.push(['remClass', presType + 'Prestige', className]);
}

function togPresClass(presType, className) {
    displayData.push(['togClass', presType + 'Prestige', className]);
}

function setAttrPres(presType, attr, val) {
    displayData.push(['setAttr', presType + 'Prestige', attr, val]);
}

function setPropPres(presType, prop, val) {
    displayData.push(['setProp', presType + 'Prestige', prop, val]);
}

function togDisplayPres(presType) {
    displayData.push(['togDisplay', presType + 'Prestige']);
}

function writeHTMLPres(presType, text) {
    displayData.push(['html', presType + 'Prestige', text]);
}