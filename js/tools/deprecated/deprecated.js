function updateCorpseDisplay() {
    document.getElementById('corpseAmount').innerHTML = formatDefault(player.corpses);
    document.getElementById('pluralCorpse').innerHTML = corpseSingulizer(false);
    document.getElementById('pluralCorpseG').innerHTML = corpseSingulizer(true);
    document.getElementById('corpseGain').innerHTML = player.astralFlag ? formatWhole(0) : formatDefault(getCorpsesPerSecond())
    document.getElementById('totalMult').innerHTML = `${formatDefault2(getCorpseMultFromUnits())}x`;
    document.getElementById('worldsMult').innerHTML = `${formatDefault2(getWorldsBonus())}x`;
    document.getElementById('worldsNum').innerHTML = `${formatWhole(player.worlds)}`;
    document.getElementById('pluralWorld').innerHTML = worldSingulizer();
    document.getElementById('totalMultAll').innerHTML = `${formatDefault2(getTotalCorpseMult())}x`;
    document.getElementById('normalAstral').innerHTML = player.astralFlag ? 'ASTRAL' : 'NORMAL'
    document.getElementById('normalAstral').style.color = player.astralFlag ? '#42d35a' : 'white'
    document.getElementById('timeMult').innerHTML = `${player.astralFlag ? formatDefault2(getAntiTimeBuff()) : formatDefault2(getTrueTimeBuff())}x`
    document.getElementById('timeMult').style.color = player.astralFlag ? '#42d35a' : 'white'
    document.getElementById('devSpeedDisplay').innerHTML = formatWhole(DEV_SPEED);
    if (DEV_SPEED!=1) { document.getElementById('devSpeedContainer').style.display = 'block'}
    else { document.getElementById('devSpeedContainer').style.display = 'none'}
}

function updateUnitDisplay(tier) {
    document.getElementById(UNITS_DATA[tier].amountID).innerHTML = `<div style="min-width: 35%; float: left;">${formatUnitRow(player.units[tier].amount)}</div><div style="min-width: 35%; float: left;">(${formatWholeUnitRow(player.units[tier].bought)})</div><div style="min-width: 30%; float: left;">${getUnitProdPerSecond(tier).gt(0) ? "(+" + formatDefault(Decimal.times((getUnitProdPerSecond(tier).div(player.units[tier].amount.max(1))), 100), 2) + "%/s)</div>" : ""}`;
    document.getElementById(UNITS_DATA[tier].multID).innerHTML = `<div style="min-width: 45%; float: left;">${formatUnitRow2(UNITS_DATA[tier].corpseMult())}x</div><div style="min-width: 45%; float: left;">(${(tier > 1) ? formatUnitRow2(UNITS_DATA[tier].prodMult()) : "~"}x)</div>`;
    document.getElementById(UNITS_DATA[tier].buttonID).innerHTML = `Cost: ${formatWhole(UNITS_DATA[tier].cost())} corpses`;
    document.getElementById(UNITS_DATA[tier].maxID).innerHTML = canAffordUnit(tier) ? `Max: ${calculateMaxUnits(tier)} for &#162;${formatWhole(calculateMaxUnitsCost(tier))}` : "Max: 0";
}

function updateTimeDimDisplay(tier) {
    document.getElementById(TIME_DATA[tier].amountID).innerHTML = `<div style="min-width: 30%; float: left;">${formatUnitRow(player.timeDims[tier].amount)}</div><div style="min-width: 30%; float: left;">(${formatWholeUnitRow(player.timeDims[tier].bought)})</div><div style="min-width: 40%; float: left;">${getTimeDimProdPerSecond(tier + 1).gt(0) ? "(+" + formatDefault(Decimal.times((getTimeDimProdPerSecond(tier + 1).div(player.timeDims[tier].amount.max(1))), 100), 2) + "%/s)</div>" : ""}`;
    document.getElementById(TIME_DATA[tier].multID).innerHTML = `<div>${formatUnitRow2(TIME_DATA[tier].mult())}x</div>`;
    document.getElementById(TIME_DATA[tier].buttonID).innerHTML = `Cost: ${formatWhole(TIME_DATA[tier].cost())} crystals`;
    document.getElementById(TIME_DATA[tier].maxID).innerHTML = canAffordTime(tier) ? `Max: ${calculateMaxTime(tier)} for &#162;${formatWhole(calculateMaxTimeCost(tier))}` : "Max: 0";
}

function updateTimeDisplay() {
    document.getElementById('trueTimeAmt').innerHTML = formatUnitRow(player.trueEssence);
    document.getElementById('antiTimeAmt').innerHTML = formatUnitRow(player.antiEssence);
    document.getElementById('trueTimeGain').innerHTML = formatUnitRow(getTimeDimProdPerSecond(1).times((100-document.getElementById('timeSlider').value)/100));
    document.getElementById('antiTimeGain').innerHTML = formatUnitRow(getTimeDimProdPerSecond(1).times(document.getElementById('timeSlider').value/100));
    document.getElementById('trueTimeBuff').innerHTML = formatDefault2(getTrueTimeBuff());
    document.getElementById('antiTimeBuff').innerHTML = formatDefault2(getAntiTimeBuff());
    document.getElementById('trueTimeNerf').innerHTML = formatDefault2(getTrueTimeNerf());
    document.getElementById('antiTimeNerf').innerHTML = formatDefault2(getAntiTimeNerf());
    document.getElementById('crystalAmt').innerHTML = ' ' + formatWhole(player.crystals) + ' ';
    if (player.totalCrystals.gte(2000)) { document.getElementById('timePresDesc').style.display = 'none'; }

}

function updateGalaxyDisplay() {
    document.getElementById('galaxyAmount').innerHTML = formatWhole(player.galaxies);
    document.getElementById('totalGalaxyAmount').innerHTML = formatWhole(player.totalGalaxies);
    document.getElementById('ascensionAmount').innerHTML = formatWhole(player.ascended);
}

function updateHTML() {
    var element;
    var elements;
    var bUpgs;
    document.getElementById('versionNumber').innerHTML = GAME_DATA.version;
    for (var tab in UNLOCKS_DATA) {
        for (var key in UNLOCKS_DATA[tab]) {
            if (player.unlocks[tab][key]) {
                for (var id in UNLOCKS_DATA[tab][key].idsToShow) {
                    if (id !== undefined) {    
                        element = document.getElementById(UNLOCKS_DATA[tab][key].idsToShow[id]);
                        if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                        else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                        else { element.style.display = 'block'; }
                    }
                }
                for (var idd in UNLOCKS_DATA[tab][key].idsToHide) {
                    if (UNLOCKS_DATA[tab][key].classNotID) {
                        document.documentElement.style.setProperty(UNLOCKS_DATA[tab][key].cssVar, 'none');
                        elements = document.getElementsByClassName(UNLOCKS_DATA[tab][key].classToEnable);
                        for (var q=0; q<elements.length; q++) {
                            elements[q].removeAttribute('disabled');
                        }
                    } else {
                        document.getElementById(UNLOCKS_DATA[tab][key].idsToHide[idd]).style.display = 'none';
                    }
                }
            } else {
                for (var id in UNLOCKS_DATA[tab][key].idsToShow) {
                    document.getElementById(UNLOCKS_DATA[tab][key].idsToShow[id]).style.display = 'none';
                }
                for (var idd in UNLOCKS_DATA[tab][key].idsToHide) {
                    if (UNLOCKS_DATA[tab][key].classNotID) {
                        document.documentElement.style.setProperty(UNLOCKS_DATA[tab][key].cssVar, 'block');
                        elements = document.getElementsByClassName(UNLOCKS_DATA[tab][key].classToEnable);
                        for (var q=0; q<elements.length; q++) {
                            elements[q].setAttribute('disabled', true);
                        }
                    } else {
                        element = document.getElementById(UNLOCKS_DATA[tab][key].idsToHide[idd]);
                        if (element.tagName == 'TR') { element.style.display = 'table-row'; } 
                        else if (element.tagName == 'TD') { element.style.display = 'table-cell'; }
                        else { element.style.display = 'block'; }
                    }
                }
            }
        }
    }
    for (var i=1; i<=NUM_UNITS; i++) {
        if (player.units[i].unlocked) {
            document.getElementById(UNITS_DATA[i].rowID).style.display = 'table-row';
            document.getElementById(UNITS_DATA[i].buttonID).className = canAffordUnit(i) ? 'unitBut' : 'unclickableUnit';
            document.getElementById(UNITS_DATA[i].maxID).className = canAffordUnit(i) ? "unitMax" : 'unclickableMax';
        }
    }
    for (var i=1; i<=NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].unlocked) {
            document.getElementById(TIME_DATA[i].rowID).style.display = 'table-row';
            document.getElementById(TIME_DATA[i].buttonID).className = canAffordTime(i) ? 'unitButT' : 'unclickableUnit';
            document.getElementById(TIME_DATA[i].maxID).className = canAffordTime(i) ? "unitMaxT" : 'unclickableMax';
        }
    }
    for (var g in GALAXIES_DATA) {
        for (var u in GALAXIES_DATA[g].upgrades) {
            if (player.galaxyUpgs[g][u].locked) {
                document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).className = 'lockedGalaxyUpg';
                document.getElementById(GALAXIES_DATA[g].upgrades[u].textID).style.display = 'none';
            } else {
                if (hasGUpgrade(g, u)) { document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).className = 'boughtGalaxyUpg' + ((player.tooltipsEnabled && isDisplayTooltipG(g, u)) ? ' tooltip' : '') }
                else if (canAffordGUpg(g, u)) { document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).className = 'galaxyUpg' + ((player.tooltipsEnabled && isDisplayTooltipG(g, u)) ? ' tooltip' : '') }
                else { document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).className = 'unclickGalaxyUpg' + ((player.tooltipsEnabled && isDisplayTooltipG(g, u)) ? ' tooltip' : '') }
                document.getElementById(GALAXIES_DATA[g].upgrades[u].textID).innerHTML = "<span style=\"font-weight: 900;\">" + getGUpgName(g, u) + "</span><br>" + getGUpgDesc(g, u) + "<br>Cost: " + formatWhole(getGUpgCost(g, u)) + " " + galaxyTextSingulizer(getGUpgCost(g, u)) + (isDisplayEffectG(g, u) ? ("<br>Currently: " + formatDefault2(getGUpgEffect(g, u)) + "x") : "");
                document.getElementById(GALAXIES_DATA[g].upgrades[u].textID).style.display = 'block';
            }
        }
    }

    for (var s in SHIP_DATA) {
        if (!shipIsUnlocked(s)) {
            document.getElementById(s + 'But').className = 'lockedShipUpg'
            document.getElementById(s + 'Text').style.display = 'none';
        } else {
            document.getElementById(s + 'Text').style.display = 'block';
            if (hasSUpgrade(s)) {
                document.getElementById(s + 'But').className = 'boughtShipUpg' + ((player.tooltipsEnabled && isDisplayTooltipS(s)) ? ' tooltip' : '');
                document.getElementById(s).style.display = 'block';
            } else {
                if (canAffordSUpg(s)) { document.getElementById(s + 'But').className = 'shipUpg' + ((player.tooltipsEnabled && isDisplayTooltipS(s)) ? ' tooltip' : '') }
                else { document.getElementById(s + 'But').className = 'unclickableShipUpg' + ((player.tooltipsEnabled && isDisplayTooltipS(s)) ? ' tooltip' : '') }
                document.getElementById(s + 'Text').innerHTML = "<span style=\"font-weight: 900;\">" + getSUpgName(s) + "</span><br>" + getSUpgDesc(s) + "<br>Cost: " + formatWhole(getSUpgCost(s)) + " astral bricks" + (isDisplayEffectS(s) ? ("<br>Currently: " + formatDefault2(getSUpgEffect(s)) + "x") : "");
                document.getElementById(s).style.display = 'none';
            }
        }
    }

    var timeTextElements = document.getElementsByClassName('timeResourceTexts');
    for (var el=0; el<timeTextElements.length; el++) {
        timeTextElements[el].innerHTML = timeSingulizer(timeTextElements[el].id);
    }
    var galTextElements = document.getElementsByClassName('galaxyResourceTexts');
    for (var el=0; el<galTextElements.length; el++) {
        galTextElements[el].innerHTML = galaxySingulizer(galTextElements[el].id);
    }
    for (var b in BUILDS_DATA) {
        if (canAffordBuilding(b)) { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonClass; }
        else { document.getElementById(BUILDS_DATA[b].buildingButtonID).className = BUILDS_DATA[b].buildingButtonUnclick; }
        if (isBuilt(b)) {
            for (var u in BUILDS_DATA[b].upgrades) {
                if (hasUpgrade(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnBought + ((player.tooltipsEnabled && isDisplayTooltip(b, u)) ? ' tooltip' : '') }
                else if (canAffordBUpg(b, u)) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnClass + ((player.tooltipsEnabled && isDisplayTooltip(b, u)) ? ' tooltip' : '') }
                else { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).className = BUILDS_DATA[b].upgradeBtnUnclick + ((player.tooltipsEnabled && isDisplayTooltip(b, u)) ? ' tooltip' : '') }
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getUpgName(b, u) + "</span><br>" + getUpgDesc(b, u) + "<br>Cost: " + formatWhole(getUpgCost(b, u)) + " " + BUILDS_DATA[b].upgResource + (isDisplayEffect(b, u) ? ("<br>Currently: " + formatDefault2(getUpgEffect(b, u)) + "x") : "");
            }
        }
        var buildingTextElements = document.getElementsByClassName('buildingResourceTexts');
        for (var el=0; el<buildingTextElements.length; el++) {
            buildingTextElements[el].innerHTML = buildingSingulizer(buildingTextElements[el].id);
        }
    }
    for (var c in CONSTR_DATA) {
        if (canAffordCUpg(c)) { document.getElementById(CONSTR_DATA[c].buttonID).className = 'constrUpg' }
        else { document.getElementById(CONSTR_DATA[c].buttonID).className = 'unclickableConstrUpg' }
        if (CONSTR_DATA[c].isTimes) { document.getElementById(CONSTR_DATA[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + formatDefault(getCUpgCost(c)) + " astral bricks" + "<br>Current level: " + formatWhole(player.construction[c]) + (isDisplayEffectC(c) ? ("<br>Currently: " + formatDefault2(getCUpgEffect(c)) + "x") : ""); }
        else { document.getElementById(CONSTR_DATA[c].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getCUpgName(c) + "</span><br>" + getCUpgDesc(c) + "<br>Cost: " + formatDefault(getCUpgCost(c)) + " astral bricks" + "<br>Current level: " + formatWhole(player.construction[c]) + (isDisplayEffectC(c) ? ("<br>Currently: +" + formatDefault2(getCUpgEffect(c))) : ""); }
    }
    for (var t in TIME_DATA.upgrades) {
        if (hasTUpgrade(t)) { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'boughtTimeUpg' + ((player.tooltipsEnabled && isDisplayTooltipT(t)) ? ' tooltip' : '') }
        else if (canAffordTUpg(t)) { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'timeUpg' + ((player.tooltipsEnabled && isDisplayTooltipT(t)) ? ' tooltip' : '') }
        else { document.getElementById(TIME_DATA.upgrades[t].buttonID).className = 'unclickableTimeUpg' + ((player.tooltipsEnabled && isDisplayTooltipT(t)) ? ' tooltip' : '') }
        document.getElementById(TIME_DATA.upgrades[t].buttonID).innerHTML = "<span style=\"font-weight: 900;\">" + getTUpgName(t) + "</span><br>" + getTUpgDesc(t) + ((TIME_DATA.upgrades[t].preReq != null) ? "<br>Requires <span style=\"font-weight: 800;\">" + TIME_DATA.upgrades[TIME_DATA.upgrades[t].preReq].title + "</span>": "") + "<br>Cost: " + formatWhole(getTUpgCost(t)) + " time crystals" + (isDisplayEffectT(t) ? ("<br>Currently: " + formatDefault2(getTUpgEffect(t)) + "x") : "");
    }
    if (player.astralFlag) {
        document.getElementById('brickGainDiv').style.display = 'block';
        document.getElementById('astralToggle').className = 'astralOn';
        document.getElementById('astralText').innerHTML = 'disable';
        document.getElementById('astralNotice').style.display = 'block';
    } else {
        document.getElementById('brickGainDiv').style.display = 'none';
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
        document.getElementById('astralNotice').style.display = 'none';
    }
    if (player.timeLocked) {
        document.getElementById('lockInTimeBut').className = 'unclickSliderBut';
        document.getElementById('respecTimeBut').className = 'timeSliderBut';
        document.getElementById('timeSlider').className = 'sliderLocked';
        document.getElementById('timeSlider').setAttribute('disabled', true);
    } else {
        document.getElementById('lockInTimeBut').className = 'timeSliderBut';
        document.getElementById('respecTimeBut').className = 'unclickSliderBut';
        document.getElementById('timeSlider').className = 'slider';
        document.getElementById('timePrestige').removeAttribute('disabled');
    }
}

function updatePrestige() {
    document.getElementById('spacePrestige').className =  (canSpacePrestige() ? 'prestigeBut' : 'unclickablePrestige');
    if (player.spaceResets.lt(3)) {
        document.getElementById('spacePresDesc').style.display = 'block';
        if (player.spaceResets.gt(1)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Time Warp';
        } else if (player.spaceResets.gt(0)) {
            document.getElementById('spacePresUnlock').innerHTML = 'Construction Upgrades';
        } else {
            document.getElementById('spacePresUnlock').innerHTML = 'Buildings';
        }
    } else { document.getElementById('spacePresDesc').style.display = 'none'; }
    document.getElementById('prestigeReq').innerHTML = "Requires <span style=\"font-size: 17pt; white-space: pre;\"> " + formatWhole(player.nextSpaceReset[0]) + " </span> " + unitSingulizer(player.nextSpaceReset[1], player.nextSpaceReset[0]);
    document.getElementById('timePrestige').className = (player.tooltipsEnabled ? (canTimePrestige() ? 'timePrestigeBut tooltip' : 'unclickablePrestige tooltip') : (canTimePrestige() ? 'timePrestigeBut' : 'unclickablePrestige'));
    if (canTimePrestige()) {
        document.getElementById('timePrestigeReq').style.display = 'none';
        document.getElementById('timePrestigeGainDesc').style.display = 'block';
    } else {
        document.getElementById('timePrestigeReq').style.display = 'block';
        document.getElementById('timePrestigeGainDesc').style.display = 'none';
    }
    document.getElementById('timePrestigeGain').innerHTML = ' ' + formatWhole(calculateCrystalGain()) + ' ';
}

function updateBuildings() {
    document.getElementById('brickDisplay').innerHTML = formatUnitRow(player.bricks);
    document.getElementById('brickGainDisplay').innerHTML = ` ${(player.astralFlag ? formatUnitRow(getBricksPerSecond()) : formatWhole(0))} `;
    document.getElementById('factoryProd').innerHTML = formatDefault(getBuildingProdPerSec(1));
    document.getElementById('factoryAmt').innerHTML = formatDefault(player.buildings[1].amount);
    document.getElementById('factoryBuildLabel').innerHTML = BUILDS_DATA[1].id;
    document.getElementById('factoryCostLabel').innerHTML = formatWhole(BUILDS_DATA[1].cost);
    document.getElementById('necropolisProd').innerHTML = formatDefault(getBuildingProdPerSec(2));
    document.getElementById('necropolisAmt').innerHTML = formatDefault(player.buildings[2].amount);
    document.getElementById('necropolisBuildLabel').innerHTML = BUILDS_DATA[2].id;
    document.getElementById('necropolisCostLabel').innerHTML = formatWhole(BUILDS_DATA[2].cost);
    document.getElementById('sunProd').innerHTML = formatDefault(getBuildingProdPerSec(3));
    document.getElementById('sunAmt').innerHTML = formatDefault(player.buildings[3].amount);
    document.getElementById('sunBuildLabel').innerHTML = BUILDS_DATA[3].id;
    document.getElementById('sunCostLabel').innerHTML = formatWhole(BUILDS_DATA[3].cost);
    document.getElementById('sunGainSpan').style.display = player.astralFlag ? 'block' : 'none'
    document.getElementById('sunGainNotice').style.display = player.astralFlag ? 'none' : 'block'
    document.getElementById('acolyteEff').innerHTML = formatDefault2(BUILDS_DATA[2].resourceEff());
}

function allDisplay() {
    updateUnlocks();
    for (var i=1; i<=(NUM_UNITS); i++) {
        updateUnitDisplay(i);
    }
    for (var i=1; i<=(NUM_TIMEDIMS); i++) {
        updateTimeDimDisplay(i);
    }
    updateCorpseDisplay();
    updateTimeDisplay();
    updateGalaxyDisplay();
    updatePrestige();
    updateBuildings();
    updateAutobuyers();
    updateHTML();
    document.getElementById('sliderValueRight').innerHTML = player.antiPercent;
    document.getElementById('sliderValueLeft').innerHTML = player.truePercent;
    document.getElementById('timeSlider').value = player.antiPercent;
}