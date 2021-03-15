var rumble;
var rumbleCount = 0;
var takeOffInt;
var vert = 0;

function getNumArkUpgs() {
    let count = 0;
    for (let a in ARK_DATA) {
        if (player.ark[a].bought) { count++; }
    }
    return count;
}

function arkIsUnlocked(a) {
    return player.ark[a].unlocked;
}

function getAUpgBrickCost(a) {
    return ARK_DATA[a].brickCost;
}

function getAUpgTimeCost(a) {
    return ARK_DATA[a].timeCost;
}

function getAUpgDesc(a) {
    return ARK_DATA[a].desc;
}

function getAUpgName(a) {
    return ARK_DATA[a].name;
}

function getAUpgEffect(a) {
    return ARK_DATA[a].effect();
}

function hasAUpgrade(a) {
    return player.ark[a].bought;
}

function canAffordAUpg(a) {
    return (player.crystals.gte(ARK_DATA[a].timeCost) && player.bricks.gte(ARK_DATA[a].brickCost) && player.ark[a].unlocked);
}

function isDisplayEffectA(a) {
    return ARK_DATA[a].displayEffect;
}

function isDisplayTooltipA(a) {
    return ARK_DATA[a].displayTooltip;
}

function getEUpgCost(e) {
    return ETH_DATA[e].cost;
}

function getEUpgDesc(e) {
    return ETH_DATA[e].desc();
}

function getEUpgName(e) {
    return ETH_DATA[e].title;
}

function getEUpgEffect(e) {
    return ETH_DATA[e].effect();
}

function hasEUpgrade(e) {
    return player.ethUpgs[e];
}

function canAffordEUpg(e) {
    return player.theorems.gte(ETH_DATA[e].cost);
}

function isDisplayEffectE(e) {
    return ETH_DATA[e].displayEffect;
}

function isDisplayTooltipE(e) {
    return ETH_DATA[e].displayTooltip;
}

function getGUpgCost(g, u) {
    return GALAXIES_DATA[g].upgrades[u].cost();
}

function getGUpgDesc(g, u) {
    return GALAXIES_DATA[g].upgrades[u].desc;
}

function getGUpgName(g, u) {
    return GALAXIES_DATA[g].upgrades[u].title;
}

function getGUpgEffect(g, u) {
    return GALAXIES_DATA[g].upgrades[u].effect();
}

function hasGUpgrade(g, u) {
    return player.galaxyUpgs[g][u].bought;
}

function isDisplayEffectG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayEffect;
}

function isDisplayTooltipG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayTooltip;
}

function getNumCompletedProj() {
    let count = 0;
    for (let i=1; i<=6; i++) {
        if (isResearchCompleted(i)) { count++; }
    }
    return count;
}

function generateExportedGalaxies() {
    let exp = '';
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (player.galaxyUpgs[g][u].bought) { exp += g.toString() + '.' + u.toString() + ', '; }
        }
    }
    return exp.slice(0, -2);
}

function generateFavoriteGalaxies() {
    let favs = new Array();
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (player.galaxyUpgs[g][u].bought) { favs.push(g.toString() + '.' + u.toString()); }
        }
    }
    return favs;
}

function resetAllFavs() {
    if (!confirm('Are you sure? This will erase all three favorites slots and rename them to "Slot 1", "Slot 2", and "Slot 3".')) {
        return;
    }
    player.favGalaxies = [...START_PLAYER.favGalaxies];
    player.favGalNames = [...START_PLAYER.favGalNames];
    for (let i=1; i<4; i++) {
        document.getElementById('slot' + i.toString() + 'Name').innerHTML = 'Slot ' + i.toString();
    }
}

function renameFavorite(i) {
    let rename = prompt("Enter a new name for this favorites slot:");
    if (rename !== undefined && rename.length>0) {
        player.favGalNames[i-1] = rename;
        document.getElementById('slot' + i.toString() + 'Name').innerHTML = rename;
    }
}

function saveFavorite(i) {
    if (player.favGalaxies[i-1].length>0) {
        if (!confirm('You already have favorites in this slot - overwrite?')) {
            return;
        }
    }
    player.favGalaxies[i-1] = [...generateFavoriteGalaxies()];
    document.getElementById('gSpecErr').innerHTML = 'Successfully saved to slot ' + i.toString() + '.';
    /*document.getElementById('favSavedNotice').style.opacity = '1';
    setTimeout(function() {
        document.getElementById('favSavedNotice').style.opacity = '0';
    }, 2000);*/
}

function exportGalaxies() {
    document.getElementById('gExportPopup').style.display = 'block';
    document.getElementById('gExportText').value = generateExportedGalaxies();
    document.getElementById('gExportText').select()
}

function exportFavGalaxies(i) {
    let exp = '';
    if (player.favGalaxies[i-1].length>0) {
        for (let j=0; j<player.favGalaxies.length; j++) {
            exp += player.favGalaxies[i-1][j] + ', ';
        }
        exp = exp.slice(0, -2);
    }
    document.getElementById('favErrPopup').style.display = 'block';
    document.getElementById('favErrExportText').value = exp;
    document.getElementById('favErrExportText').select()
}

function importGalaxies(fav=false, favSlot=0) {
    let gals = verifyGalaxyImp(fav, favSlot);
    if (gals.length == 0) { return; }

    let g=0;
    let u=0;
    let count=0;

    for (let i=0; i<gals.length; i++) {
        g = parseInt(gals[i].slice(0, 1));
        u = parseInt(gals[i].slice(2, 4));
        if (canAffordGUpg(g, u)) { buyGUpg(g, u); }
        else {
            if (fav) {
                document.getElementById('gSpecErr').innerHTML = 'Too expensive; bought ' + formatWhole(count) + '.';
            } else {
                document.getElementById('gImpErr').innerHTML = 'Too expensive; bought ' + formatWhole(count) + '.';
            }
            return;
        }
        count++;
    }

    if (fav) { 
        document.getElementById('gSpecErr').innerHTML = 'Successfully bought ' + formatWhole(count) + ' upgrades.';
        /*document.getElementById('favLoadNotice').style.opacity = '1';
        setTimeout(function() {
            document.getElementById('favLoadNotice').style.opacity = '0';
        }, 2000);*/
    }
    else { document.getElementById('gImpErr').innerHTML = 'Successfully bought ' + formatWhole(count) + ' upgrades.'; }
}

function verifyGalaxyImp(fav=false, favSlot=0) {
    let imp = document.getElementById('gImportText').value
    let gals = new Array();
    let dupes = false;
    let undef = false;
    let g=0;
    let u=0;
    let reg = /^\d\.\d\d(,\s\d\.\d\d)*$/;

    if (getBoughtGUpgs() != 0) {
        if (fav) {
            document.getElementById('gSpecErr').innerHTML = 'You must respec first.';
        } else {
            document.getElementById('gImpErr').innerHTML = 'You must respec first.';
        }
        return [];
    }

    if (imp.length>3 || fav) {
        if (reg.test(imp) || fav) {
            if (fav) { gals = [...player.favGalaxies[favSlot-1]]; }
            else {
                while (imp.length>2) {
                    gals.push(imp.slice(0, 4));
                    imp = imp.slice(6, imp.length);
                }
            }
            if (gals.length<=24) {
                for (let i=0; i<gals.length; i++) {
                    for (let j=i+1; j<gals.length; j++) {
                        if (gals[i] == gals[j]) {
                            i = gals.length;
                            j = gals.length;
                            dupes = true;
                        }
                    }
                }
                if (!dupes) {
                    for (let l=0; l<gals.length; l++) {
                        g = parseInt(gals[l].slice(0, 1));
                        u = parseInt(gals[l].slice(2, 4));
                        if (GALAXIES_DATA[g] === undefined) {
                            undef = true;
                            l = gals.length;
                        } else if (GALAXIES_DATA[g].upgrades[u] === undefined) {
                            undef = true;
                            l = gals.length;
                        }
                    }
                    if (!undef) {
                        for (let k=0; k<gals.length-1; k++) {
                            g = parseInt(gals[k].slice(0, 1));
                            u = parseInt(gals[k].slice(2, 4));
                            if (g > parseInt(gals[k+1].slice(0, 1))) {
                                if (fav) {
                                    document.getElementById('gSpecErr').innerHTML = 'Error: misordered upgrades.';
                                } else {
                                    document.getElementById('gImpErr').innerHTML = 'Error: misordered upgrades.';
                                }
                                return [];
                            } else if (u > parseInt(gals[k+1].slice(2, 4)) && g == parseInt(gals[k+1].slice(0, 1))) {
                                if (fav) {
                                    document.getElementById('gSpecErr').innerHTML = 'Error: misordered upgrades.';
                                } else {
                                    document.getElementById('gImpErr').innerHTML = 'Error: misordered upgrades.';
                                }
                                return [];
                            } else if ((gals.includes(g.toString() + '.21') && gals.includes(g.toString() + '.22')) || (gals.includes(g.toString() + '.31') && gals.includes(g.toString() + '.32'))) {
                                if (fav) {
                                    document.getElementById('gSpecErr').innerHTML = 'Error: both upgrade branches.';
                                } else {
                                    document.getElementById('gImpErr').innerHTML = 'Error: both upgrade branches.';
                                }
                                return [];
                            }
                        }
                        return gals;
                    } else {
                        if (fav) {
                            document.getElementById('gSpecErr').innerHTML = 'Error: undefined upgrades.';
                        } else {
                            document.getElementById('gImpErr').innerHTML = 'Error: undefined upgrades.';
                        }
                        return [];
                    }
                } else {
                    if (fav) {
                        document.getElementById('gSpecErr').innerHTML = 'Error: duplicate upgrades.';
                    } else {
                        document.getElementById('gImpErr').innerHTML = 'Error: duplicate upgrades.';
                    }
                    return [];
                }
            } else {
                if (fav) {
                    document.getElementById('gSpecErr').innerHTML = 'Error: too many upgrades.';
                } else {
                    document.getElementById('gImpErr').innerHTML = 'Error: too many upgrades.';
                }
                return [];
            }
        } else {
            if (fav) {
                document.getElementById('gSpecErr').innerHTML = 'Error: incorrect format.';
            } else {
                document.getElementById('gImpErr').innerHTML = 'Error: incorrect format.';
            }
            return [];
        }
    } else {
        if (fav) {
            document.getElementById('gSpecErr').innerHTML = 'Error: empty or too short code.';
        } else {
            document.getElementById('gImpErr').innerHTML = 'Error: empty or too short code.';
        }
        return [];
    }
}

function closeImpGalaxies() {
    document.getElementById('gImportPopup').style.display = 'none';
    document.getElementById('gImpErr').innerHTML = '';
    document.getElementById('gImportText').value = '';
}

function closeExpGalaxies() {
    document.getElementById('gExportPopup').style.display = 'none';
    document.getElementById('gExportText').value = '';
}

function closeFavPopup() {
    document.getElementById('gSpecsPopup').style.display = 'none';
    document.getElementById('gSpecErr').innerHTML = '';
}

function showFavPopup() {
    document.getElementById('gSpecsPopup').style.display = 'block';
}

function showImportGalaxies() {
    document.getElementById('gImportPopup').style.display = 'block';
    document.getElementById('gImportText').focus();
}

function hasPrereqGUpg(g, u) {
    if (u==11) { return true; }
    else {
        var reqs = GALAXIES_DATA[g].upgrades[u].requires;
        for (var i=0; i<reqs.length; i++) {
            if (hasGUpgrade(g, reqs[i])) { return true; }
        }
        return false;
    }
}

function getGUpgsByRow(row) {
    var upgsByRow = new Array();
    if (row==1 || row == 4) {
        for (let i=1; i<=4; i++) { upgsByRow.push([i.toString(), row.toString() + '1']) }
    } else {
        for (let i=1; i<=4; i++) {
            upgsByRow.push([i.toString(), row.toString() + '1'])
            upgsByRow.push([i.toString(), row.toString() + '2'])
        }
    }
    return upgsByRow;
}

function canAffordGUpg(g, u) {
    if (player.galaxies.gte(GALAXIES_DATA[g].upgrades[u].cost())) {
        if (isResearchActive(6) || isResearchActive(7)) {
            for (let i=1; i<GALAXIES_DATA[g].upgrades[u].row; i++) {
                if (getBoughtGUpgsByRow(i)==0) { return false; }
            }
            return !hasGUpgrade(g, u);
        }
        else { return hasPrereqGUpg(g, u) && !hasGUpgrade(g, u); }
    } else { return false; }
}

function buyGUpg(g, u) {
    if (canAffordGUpg(g, u) && !player.galaxyUpgs[g][u].locked) {
        let thisRow = GALAXIES_DATA[g].upgrades[u].row;
        player.galaxies = player.galaxies.minus(GALAXIES_DATA[g].upgrades[u].cost());
        player.spentGalaxies = player.spentGalaxies.plus(GALAXIES_DATA[g].upgrades[u].cost());
        player.galaxyUpgs[g][u].bought = true;
        GALAXIES_DATA[g].upgrades[u].onBuy();
        addGUpgClass(g, u, 'boughtGalaxyUpg');
        remGUpgClass(g, u, 'galaxyUpg');
        remGUpgClass(g, u, 'unclickGalaxyUpg');

        if (u == 21) {
            player.galaxyUpgs[g][22].locked = true;
            addGUpgClass(g, 22, 'lockedGalaxyUpg');
            remGUpgClass(g, 22, 'galaxyUpg')
            remGUpgClass(g, 22, 'unclickGalaxyUpg')
            player.galaxyUpgs[g][32].locked = true;
            addGUpgClass(g, 32, 'lockedGalaxyUpg');
            remGUpgClass(g, 32, 'galaxyUpg')
            remGUpgClass(g, 32, 'unclickGalaxyUpg')
        } else if (u == 22) {
            player.galaxyUpgs[g][21].locked = true;
            addGUpgClass(g, 21, 'lockedGalaxyUpg');
            remGUpgClass(g, 21, 'galaxyUpg')
            remGUpgClass(g, 21, 'unclickGalaxyUpg')
            player.galaxyUpgs[g][31].locked = true;
            addGUpgClass(g, 31, 'lockedGalaxyUpg');
            remGUpgClass(g, 31, 'galaxyUpg')
            remGUpgClass(g, 31, 'unclickGalaxyUpg')
        }

        for (let gg in GALAXIES_DATA) {
            for (let uu in GALAXIES_DATA[gg].upgrades) {
                if (GALAXIES_DATA[gg].upgrades[uu].row>thisRow || (GALAXIES_DATA[gg].upgrades[uu].row==1 && thisRow==4)) {
                    document.getElementById('gUpgCost' + gg.toString() + '.' + uu.toString()).innerHTML = formatWhole(getGUpgCost(gg, uu)) + ' ' + galaxyTextSingulizer(getGUpgCost(gg, uu));
                }
            }
        }

        if ((isResearchActive(5)) && (getBoughtGUpgs()==1)) {
            for (let gg in GALAXIES_DATA) {
                if (gg!=g) {
                    for (let uu in GALAXIES_DATA[gg].upgrades) {
                        player.galaxyUpgs[gg][uu].locked = true;
                        document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.add('lockedGalaxyUpg');
                        document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.remove('galaxyUpg');
                        document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.remove('unclickGalaxyUpg');
                    }
                }
            }
        }

        if (isResearchActive(6) || isResearchActive(7)) {
            for (let gg in GALAXIES_DATA) {
                if (gg==g) {
                    for (let uu in GALAXIES_DATA[gg].upgrades) {
                        if (uu != u) {
                            player.galaxyUpgs[gg][uu].locked = true;
                            document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.add('lockedGalaxyUpg');
                            document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.remove('galaxyUpg');
                            document.getElementById(GALAXIES_DATA[gg].upgrades[uu].buttonID).classList.remove('unclickGalaxyUpg');
                        }
                    }
                } else {
                    for (let vv in GALAXIES_DATA[gg].upgrades) {
                        if (GALAXIES_DATA[gg].upgrades[vv].row==thisRow) {
                            player.galaxyUpgs[gg][vv].locked = true;
                            document.getElementById(GALAXIES_DATA[gg].upgrades[vv].buttonID).classList.add('lockedGalaxyUpg');
                            document.getElementById(GALAXIES_DATA[gg].upgrades[vv].buttonID).classList.remove('galaxyUpg');
                            document.getElementById(GALAXIES_DATA[gg].upgrades[vv].buttonID).classList.remove('unclickGalaxyUpg');
                        }
                    }
                }
            }
        }
        /*if (thisRow>1) {
            if (!player.galaxyRowsLocked[thisRow-1]) { rowLock(thisRow-1); }
        }
        if (thisRow==4) {
            unlockRows();
        }*/
    }
}

function buyEUpg(e) {
    if (canAffordEUpg(e) && !hasEUpgrade(e)) {
        player.ethUpgs[e] = true;
        player.theorems = player.theorems.minus(getEUpgCost(e));
        remEUpgClass(e, 'ethUpg');
        addEUpgClass(e, 'boughtEthUpg');
        document.getElementById('theoremDisplay').innerHTML = ` ${formatWhole(player.theorems)} `;
        document.getElementById('theoremEffect').innerHTML = ` ^${formatDefault2(getTheoremBoostW())}`;
        document.getElementById('theoremEffectC').innerHTML = ` ^${formatDefault2(getTheoremBoostC())}`;
    }
}

function respecEthereal() {
    for (let e in ETH_DATA) {
        if (player.ethUpgs[e]) {
            player.theorems = player.theorems.plus(1);
            player.ethUpgs[e] = false;
        }
        addEUpgClass(e, 'ethUpg');
        remEUpgClass(e, 'boughtEthUpg');
        remEUpgClass(e, 'unclickableEthUpg');
    }
    document.getElementById('theoremDisplay').innerHTML = ` ${formatWhole(player.theorems)} `;
    document.getElementById('theoremEffect').innerHTML = ` ^${formatDefault2(getTheoremBoostW())}`;
    document.getElementById('theoremEffectC').innerHTML = ` ^${formatDefault2(getTheoremBoostC())}`;

    if (canTimePrestige()) { timePrestigeNoConfirm(); }
    else { timePrestigeReset(); }
}

/*function rowLock(row) {
    let lockedRows = getGUpgsByRow(row);
    let g, u;
    for (let i=0; i<lockedRows.length; i++) {
        g = lockedRows[i][0];
        u = lockedRows[i][1];
        if (!player.galaxyUpgs[g][u].locked && !player.galaxyUpgs[g][u].bought) {
            displayData.push(['addClass', 'galaxyUpg'+g+'.'+u, 'lockedGalaxyRow']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'galaxyUpg']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'unclickGalaxyUpg']);
            displayData.push(['togClass', 'text'+g+'.'+u, 'lockedGalaxySpan']);
            player.galaxyUpgs[g][u].rowLocked = true;
        }
    }
    player.galaxyRowsLocked[row] = true;
}

function unlockRows() {
    for (r=1; r<=4; r++) {
        unlockRow(r);
    }
}

function unlockRow(r) {
    let lockedRows = getGUpgsByRow(r);
    for (let i=0; i<lockedRows.length; i++) {
        g = lockedRows[i][0];
        u = lockedRows[i][1];
        if (player.galaxyUpgs[g][u].rowLocked) {
            displayData.push(['addClass', 'galaxyUpg'+g+'.'+u, 'galaxyUpg']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'lockedGalaxyRow']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'unclickGalaxyUpg']);
            displayData.push(['togClass', 'text'+g+'.'+u, 'lockedGalaxySpan']);
            player.galaxyUpgs[g][u].rowLocked = false;
        }
    }
    player.galaxyRowsLocked[r] = false;
}*/

function buyArkUpgrade(a) {
    if (!player.ark[a].bought && canAffordAUpg(a)) {
        player.bricks = player.bricks.minus(getAUpgBrickCost(a));
        player.crystals = player.crystals.minus(getAUpgTimeCost(a));
        player.ark[a].bought = true;
        document.getElementById(a).style.display = 'none';
        document.getElementById(a + 'Built').style.display = 'block';
        document.getElementById(a + 'But').classList.add('boughtArkUpg');
        document.getElementById(a + 'But').classList.remove('arkUpg');
        document.getElementById(a + 'Text').style.display = 'none';
        document.getElementById(a + 'BoughtText').style.display = 'inline';

        if (checkForWin()) {
            winGame();
        }
    }
}

function checkForWin() {
    for (let a in ARK_DATA) {
        if (!hasAUpgrade(a)) { return false; }
    }
    return true;
}

function winGame() {
    player.win = true;
    document.getElementById('navigationBut').scrollIntoView();
    document.getElementById('fullyBuilt').style.display = 'block';
    for (let a in ARK_DATA) {
        document.getElementById(a + 'Built').style.display = 'none';
        displayData.push(['setProp', a + 'But', 'opacity', '0']);
    }
    document.getElementById('htmlBody').classList.add('hidden-scrollbar');
    rumble = setInterval(rumbleAnim, 100);
    setTimeout(takeOff, 3000);
}

function rumbleAnim() {
    if (rumbleCount >= 30) { clearInterval(rumble) }
    switch (rumbleCount % 4) {
        case 0:
            document.getElementById('fullyBuilt').style.left = "48%";
            break;
        case 1:
            document.getElementById('fullyBuilt').style.left = "50%";
            break;
        case 2:
            document.getElementById('fullyBuilt').style.left = "52%";
            break;
        case 3:
            document.getElementById('fullyBuilt').style.left = "50%";
            break;
    }
    rumbleCount++;
}

function takeOff() {
    takeOffInt = setInterval(takeOffAnim, 5);
    setTimeout(congrats, 5000);
}

function takeOffAnim() {
    vert++;
    if (vert>=1000) { clearInterval(takeOffInt); }
    document.getElementById('fullyBuilt').style.top = (300 - vert).toString() + 'px';
}

function congrats() {
    document.getElementById('fullyBuilt').style.display = 'none';
    document.getElementById('winScreen').style.display = 'block';
    document.getElementById('winScreen').scrollIntoView();
    document.getElementById('winMessage').style.opacity = '1';
}

function continueGame() {
    document.getElementById('arkDescription').style.display = 'none';
    document.getElementById('winDescription').style.display = 'block';
    document.getElementById('fullyBuilt').style.display = 'none';
    document.getElementById('arkSubTab').style.height = '100px';
    for (var a in ARK_DATA) {
        document.getElementById(a).style.display = 'none';
        document.getElementById(a + 'But').style.display = 'none';
        document.getElementById(a + 'Built').style.display = 'none';
    }
    showTab('unitsTab', false, 'unitsTabBut');
    showUnitSubTab('unitsSubTab', 'unitsSubTabBut', 'unitsTabBut');
    document.getElementById('htmlBody').classList.remove('hidden-scrollbar');
    document.getElementById('winScreen').style.opacity = '0';
    setTimeout(function() {
        document.getElementById('winScreen').style.display = 'none';
        player.continue = true;
    }, 2000);
}

function respecGalaxiesClick() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['click']) {
            if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        }
        if (getBoughtGUpgs() == 0 && !hasAchievement(52)) { unlockAchievement(52); }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxiesKey() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['key']) {
            if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        }
        if (getBoughtGUpgs() == 0 && !hasAchievement(52)) { unlockAchievement(52); }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxies() {
    player.galaxies = player.galaxies.plus(player.spentGalaxies);
    player.spentGalaxies = new Decimal(0);
    //unlockRows();
    copyData(player.galaxyUpgs, START_PLAYER.galaxyUpgs);
    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
    displayData.push(['html', 'astralNerfResearch', formatWhole(getAstralNerf())]);
    //copyData(player.galaxyRowsLocked, START_PLAYER.galaxyRowsLocked);
    loadStyles();
}

function galaxyPrestigeClick() {
    if (player.confirmations['galaxyPrestige']['click']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function galaxyPrestigeKey() {
    if (player.confirmations['galaxyPrestige']['key']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function canGalaxyPrestige() {
    return player.worlds.gte(10);
}

function calculateGalaxyGain() {
    if (player.worlds.lt(10)) { return new Decimal(0); }
    let g = new Decimal(player.worlds).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(player.worlds.pow(g.minus(d).plus(isBuilt(4) ? BUILDS_DATA[4].resourceEff() : 0)));
    return gals.plus(getCUpgEffect(6));
}

function calculateGalaxyGainFuture(w) {
    if (w.lt(10)) { return new Decimal(0); }
    let g = new Decimal(w).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(w.pow(g.minus(d).plus(isBuilt(4) ? BUILDS_DATA[4].resourceEff() : 0)));
    return gals.plus(getCUpgEffect(6));
}

function calculateNextGalaxy() {
    let gain = calculateGalaxyGain();
    if (gain.gte(1)) {
        let next = gain.plus(1);
        let nextW = new Decimal(player.worlds);
        let newGain = new Decimal(0);
        let g = new Decimal(0);
        let d = new Decimal(0)
        while (newGain.lt(next)) {
            nextW = nextW.plus(1);
            g = new Decimal(nextW).div(10);
            d = new Decimal(g.sqrt());
            newGain = calculateGalaxyGainFuture(nextW);
        }
        return nextW;
    }
}

function galaxyPrestige(respec=false) {
    if (canGalaxyPrestige()) {
        if (getBoughtGUpgs()==0 && player.ascensions.gt(0) && !hasAchievement(55)) { unlockAchievement(55); }
        if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeNoConfirm(respec=false) {
    if (canGalaxyPrestige()) {
        if (getBoughtGUpgs()==0 && player.ascensions.gt(0) && !hasAchievement(55)) { unlockAchievement(55); }
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        if (document.getElementById('respecOnAsc').checked) {
            document.getElementById('respecOnAsc').checked = false;
        }
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeReset(respec=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked && !player.dontResetSlider) {
        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').disabled = false;
        document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
        document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
        document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
    }
    clearInterval(mainLoop);
    if (player.isInResearch) {
        let id = getActiveResearch();
        player.isInResearch = false;
        player.researchProjects[getActiveResearch()].active = false;
        player.research = new Decimal(0);
        if (id==7) {
            document.getElementById('startResearch' + id.toString()).classList.remove('progressInfResearchButton');
            document.getElementById('startResearch' + id.toString()).classList.add('infResearchButton');
        } else {
            document.getElementById('startResearch' + id.toString()).classList.remove('progressResearchButton');
            document.getElementById('startResearch' + id.toString()).classList.add('researchButton');
        }
        document.documentElement.style.boxShadow = '';
        if (id==6 || id==7) {
            let reqs = document.getElementsByClassName('gUpgRequires');
            for (let i=0; i<reqs.length; i++) {
                reqs[i].style.textDecoration = '';
            }
        }
        respec = true;
    }
    
    if (!hasAchievement(42)) {
        copyData(player.autobuyers, START_PLAYER.autobuyers);
        updateAutobuyersDisplay();
    }

    player.pastAscRuns.lastRun.galaxyGain = calculateGalaxyGain();
    player.pastAscRuns.lastRun.timeSpent = new Date()-player.pastAscRuns.lastRun.timeAscended;
    player.pastAscRuns.lastRun.timeAscended = new Date();
    if (player.pastAscRuns.lastRun.galaxyGain.gt(player.allTimeStats.bestGalaxyGain)) { player.allTimeStats.bestGalaxyGain = new Decimal(player.pastAscRuns.lastRun.galaxyGain) }
    for (var i=9; i>=0; i--) { copyData(player.pastAscRuns.lastTen[i], player.pastAscRuns.lastTen[i-1]); }
    copyData(player.pastAscRuns.lastTen[0], player.pastAscRuns.lastRun);
    copyData(player.pastRuns, START_PLAYER.pastRuns);

    resetTime();
    resetTimeCounts();
    resetUnits();
    resetBuildingResources(false, true);
    resetBuildings(true);
    if (!hasAchievement(42)) { lockElements('unitsTab', 'autobuyers'); }
    if (!hasAchievement(43)) { lockTab('timeTab'); }
    else { lockElements('timeTab', 'mainTab'); }
    
    
    if (document.getElementById('respecOnAsc').checked || respec) {
        respecGalaxies();
    }
    document.getElementById('respecOnAsc').checked = false;

    player.corpses = hasAchievement(41) ? new Decimal(START_PLAYER.corpsesAch41) : new Decimal(START_PLAYER.corpses)
    if (!hasAchievement(42)) { showUnitSubTab('unitsSubTab'); }
    if (!hasMilestone(1)) { showBuildingSubTab('buildingsSubTab'); }
    if (!hasAchievement(43)) { showTimeSubTab('timeDimSubTab'); }
    save();
    loadStyles();
    startInterval();
}

function resetTimeCounts() {
    player.timeResets = new Decimal(START_PLAYER.timeResets);
    player.crystals = new Decimal(hasMilestone(4) ? START_PLAYER.milesCrystals : START_PLAYER.crystals);
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    if (!player.dontResetSlider) {
        player.truePercent = new Decimal(START_PLAYER.truePercent);
        player.antiPercent = new Decimal(START_PLAYER.antiPercent);
    }
    copyData(player.thisAscStats, START_PLAYER.thisAscStats);
    player.thisAscStats.bestCrystals = player.crystals;
    player.thisAscStats.totalCrystals = player.crystals;
}

function toggleAstralResearch() {
    toggleAstral();
    document.getElementById('astralButResearch').innerHTML = player.astralFlag ? 'Toggle Astral: ON' : 'Toggle Astral: OFF'
    document.getElementById('astralButInfResearch').innerHTML = player.astralFlag ? 'Toggle Astral: ON' : 'Toggle Astral: OFF'
}

function researchReset(proj) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked) {
        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').disabled = false;
        document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
        document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
        document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
    }
    clearInterval(mainLoop);

    let tempVortex = {};
    let time4 = [];
    let time5 = [];
    copyData(tempVortex, player.buildings[4]);
    for (let i=1; i<=4; i++) {
        time4[i-1] = player.timeUpgs['4' + i.toString()];
        time5[i-1] = player.timeUpgs['5' + i.toString()];
    }

    copyData(player.units, START_PLAYER.units);
    copyData(player.buildings, START_PLAYER.buildings);
    copyData(player.construction, START_PLAYER.construction);
    copyData(player.timeDims, START_PLAYER.timeDims);
    copyData(player.timeUpgs, START_PLAYER.timeUpgs);
    player.corpses = new Decimal(START_PLAYER.corpses);
    player.bricks = new Decimal(START_PLAYER.bricks);
    player.crystals = new Decimal(START_PLAYER.crystals);
    player.worlds = new Decimal(START_PLAYER.worlds);
    player.spaceResets = new Decimal(START_PLAYER.spaceResets);
    player.timeResets = new Decimal(START_PLAYER.timeResets);
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    player.nextSpaceReset = new Array(1, 5);
    copyData(player.thisSacStats, START_PLAYER.thisSacStats);
    copyData(player.thisAscStats, START_PLAYER.thisAscStats);
    lockElements('buildingsTab', 'factory');
    lockElements('buildingsTab', 'factoryRow2');
    lockElements('buildingsTab', 'necropolis');
    lockElements('buildingsTab', 'necropolisRow2');
    lockElements('buildingsTab', 'sun');
    lockElements('buildingsTab', 'sunRow2');

    copyData(player.buildings[4], tempVortex);
    for (let i=1; i<=4; i++) {
        player.timeUpgs['4' + i.toString()] = time4[i-1];
        player.timeUpgs['5' + i.toString()] = time5[i-1];
    }

    respecGalaxies();
    
    let g = RESEARCH_DATA[proj].galaxyLock;
    if (g>0) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            player.galaxyUpgs[g][u].locked = true;
        }
    } 
    
    showUnitSubTab('unitsSubTab');
    showBuildingSubTab('buildingsSubTab');
    showTimeSubTab('timeDimSubTab');
    save();
    loadStyles();
    startInterval();
}

function getGalaxiesBonus() {
    var b = new Decimal(player.allTimeStats.totalGalaxies)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return getGalaxySoftcap(boost);
}

function getGalaxiesBonusNoSC() {
    var b = new Decimal(player.allTimeStats.totalGalaxies)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return boost;
}

function getGalaxiesBonusFixed(gals) {
    var b = new Decimal(gals)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return boost;
}

function getGalaxySoftcap(eff) {
    let start = getGalaxiesBonusFixed(1000*(2**getNumCompletedProj()));
    let mag = 3;
    if (isSoftcapActive(eff)) {
        return Decimal.pow(10, Decimal.pow(eff.log10(), 1/mag).times(Decimal.pow(start.log10(), Decimal.sub(1, 1/mag))));
    } else { return eff; }
}

function getGalaxyUpgSoftcap(eff) {
    let start = new Decimal(1000*(2**getNumCompletedProj())+1);
    let mag = 3;
    if (eff.gte(start) && !hasAchievement(64)) {
        return Decimal.pow(10, Decimal.pow(eff.log10(), 1/mag).times(Decimal.pow(start.log10(), Decimal.sub(1, 1/mag))));
    } else { return eff; }
}

function isSoftcapActive(val) {
    return (val.gte(getGalaxiesBonusFixed(1000*(2**getNumCompletedProj()))) && !hasAchievement(64));
}

function getBoughtGUpgs() {
    let count = 0;
    let root
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (hasGUpgrade(g, u)) { count++; }
        }
    }
    return count;
}

function getBoughtGUpgsByRow(row) {
    let count = 0;
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (hasGUpgrade(g, u) && GALAXIES_DATA[g].upgrades[u].row == row) { count++; }
        }
    }
    return count;
}

function getResearchPerSecond() {
    if (!player.isInResearch) { return new Decimal(0); }
    var e = 0.2
    var r = getCorpsesPerSecond().pow(e).sqrt();
    if (hasEUpgrade(14)) { r = r.times(getEUpgEffect(14)); }
    return r; 
}

function isResearchActive(proj) {
    return player.researchProjects[proj].active;
}

function getActiveResearch() {
    for (let i=1; i<=7; i++) {
        if (player.researchProjects[i].active) { return i; }
    }
    return 0;
}

function isResearchCompleted(i) {
    return player.researchProjects[i].completed;
}

function canCompleteResearch() {
    let proj = getActiveResearch();
    if (proj==0) { return false; }
    if (proj==7) { return player.research.gte(RESEARCH_DATA[proj].calcGoal()); }
    else { return player.research.gte(RESEARCH_DATA[proj].goal); }
}

function researchButtonClick(id) {
    if (!player.isInResearch) { startResearch(id) }
    else if (canCompleteResearch()) { completeResearch(id) }
}

function completeResearch(id) {
    if (id!=7) { player.researchProjects[id].completed = true; }
    player.researchProjects[id].active = false;
    player.isInResearch = false;
    player.research = new Decimal(0);
    document.getElementById('upgSoftcapNum1').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('upgSoftcapNum2').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('mainSoftcapStart').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('softcapNum').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;

    if (id==6) {
        document.getElementById('upgSoftcapNotice1').style.display = 'none';
        document.getElementById('upgSoftcapNotice1').style.display = 'none';
        document.getElementById('softcapNotice').style.display = 'none';
        document.getElementById('softcapMainDisplay').style.display = 'none';
    }

    if (id==7) {
        player.theorems = player.theorems.plus(1);
        player.infCompletions = player.infCompletions.plus(1);
        document.getElementById('theoremDisplay').innerHTML = ` ${formatWhole(player.theorems)} `;
        document.getElementById('completionsDisplay').innerHTML = ` ${formatWhole(player.infCompletions)} `;
        document.getElementById('theoremEffect').innerHTML = ` ^${formatDefault2(getTheoremBoostW())}`;
        document.getElementById('theoremEffectC').innerHTML = ` ^${formatDefault2(getTheoremBoostC())}`;
        document.getElementById('resGoal7').innerHTML = formatWhole(RESEARCH_DATA[7].calcGoal());
        
    }
    else { unlockArkPart(RESEARCH_DATA[id].unlocks); }

    if (id==6 || id==7) {
        let reqs = document.getElementsByClassName('gUpgRequires');
        for (let i=0; i<reqs.length; i++) {
            reqs[i].style.textDecoration = '';
        }
    }

    document.getElementById('researchSubTabBut').classList.remove('tabButNotify');
    document.getElementById('galaxyTabBut').classList.remove('tabButIndirectNotify');
    document.getElementById(document.getElementById(RESEARCH_DATA[id].buttonID).id).classList.remove('projectNotify');
    document.documentElement.style.boxShadow = player.astralFlag ? 'inset 0px 0px 30px 20px #1c8a2e' : ''
    RESEARCH_DATA[id].onComplete(id);

    respecGalaxies();
}

function startResearch(id) {
    if (player.isInResearch || player.researchProjects[id].completed) { return; }
    player.researchProjects[id].active = true;
    player.isInResearch = true;
    document.documentElement.style.boxShadow = (id==7 ? 'inset 0px 0px 20px 10px #613227' : 'inset 0px 0px 20px 10px #e34805') + (player.astralFlag ? ', inset 0px 0px 30px 20px #1c8a2e' : '');
    if (id==7) { document.getElementById('infResearchGoalDisplay').innerHTML = ` ${formatWholeUnitRow(RESEARCH_DATA[id].calcGoal())} `; } 
    else { document.getElementById('researchGoalDisplay').innerHTML = ` ${formatWholeUnitRow(RESEARCH_DATA[id].goal)} `; }
    if (id==6 || id==7) {
        let reqs = document.getElementsByClassName('gUpgRequires');
        for (let i=0; i<reqs.length; i++) {
            reqs[i].style.textDecoration = 'line-through';
        }
    }
    researchReset(id);
}

function unlockArkPart(name) {
    if (!player.researchProjects[ARK_DATA[name].project].completed || hasAUpgrade(name)) { return; }
    document.getElementById(ARK_DATA[name].buttonID).classList.remove('lockedArkUpg');
    document.getElementById(ARK_DATA[name].buttonID).classList.add(canAffordAUpg(name) ? 'arkUpg' : 'unclickableArkUpg');
    document.getElementById(name).style.display = 'block';
    document.getElementById(ARK_DATA[name].textID).style.display = '';
    player.ark[name].unlocked = true;
}

function getTheoremBoostW() {
    return Decimal.pow(1.2, player.theorems);
}

function getTheoremBoostC() {
    return Decimal.pow(1.01, player.infCompletions);
}

const RESEARCH_DATA = {
    1: {
        galaxyLock: 4,
        goal: new Decimal(1e6),
        buttonID: 'startResearch1',
        unlocks: 'thrusters',
        onComplete: function() {
            return;
        }
    },
    2: {
        galaxyLock: 1,
        goal: new Decimal(1e9),
        buttonID: 'startResearch2',
        unlocks: 'engines',
        onComplete: function() {
            return;
        }
    },
    3: {
        galaxyLock: 2,
        goal: new Decimal(1e12),
        buttonID: 'startResearch3',
        unlocks: 'navigation',
        onComplete: function() {
            return;
        }
    },
    4: {
        galaxyLock: 3,
        goal: new Decimal(1e14),
        buttonID: 'startResearch4',
        unlocks: 'torpedos',
        onComplete: function() {
            return;
        }
    },
    5: {
        galaxyLock: 0,
        goal: new Decimal(1e10),
        buttonID: 'startResearch5',
        unlocks: 'railguns',
        onComplete: function() {
            document.getElementById('staticSacReq').innerHTML = ' 1e15 ';
            document.getElementById('timePrestige').setAttribute('data-title', 'floor(10^(corpses_exponent/15 - 0.65))');
        }
    },
    6: {
        galaxyLocks: 0,
        goal: new Decimal(1e15),
        buttonID: 'startResearch6',
        unlocks: 'support',
        onComplete: function() {
            document.getElementById('researchSubTabBut').style.textDecoration = 'line-through';
        }
    },
    7: {
        galaxyLocks: 0,
        goal: new Decimal(1e16),
        buttonID: 'startResearch7',
        unlocks: '',
        calcGoal: function() {
            return this.goal.times(Decimal.pow(10, player.infCompletions));
        },
        onComplete: function() {
            return;
        }
    },
}

const ARK_DATA = {
    'thrusters': {
        name: 'Thrusters',
        desc: '',
        brickCost: new Decimal(1e100),
        timeCost: new Decimal(1e25),
        buttonID: 'thrustersBut',
        textID: 'thrustersText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 1,
        effect: function() {
            return;
        }
    },
    'engines': {
        name: 'Engines',
        desc: '',
        brickCost: new Decimal(1e125),
        timeCost: new Decimal(5e27),
        buttonID: 'enginesBut',
        textID: 'enginesText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 2,
        effect: function() {
            return;
        }
    },
    'navigation': {
        name: 'Navigation',
        desc: '',
        brickCost: new Decimal(1e150),
        timeCost: new Decimal(1e30),
        buttonID: 'navigationBut',
        textID: 'navigationText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 3,
        effect: function() {
            return;
        }
    },
    'torpedos': {
        name: 'Torpedos',
        desc: '',
        brickCost: new Decimal(1e200),
        timeCost: new Decimal(1e35),
        buttonID: 'torpedosBut',
        textID: 'torpedosText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 4,
        effect: function() {
            return;
        }
    },
    'railguns': {
        name: 'Railguns',
        desc: '',
        brickCost: new Decimal("1e300"),
        timeCost: new Decimal(1e40),
        buttonID: 'railgunsBut',
        textID: 'railgunsText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 5,
        effect: function() {
            return;
        }
    },
    'support': {
        name: 'Death Support',
        desc: '',
        brickCost: new Decimal("1e400"),
        timeCost: new Decimal(1e45),
        buttonID: 'supportBut',
        textID: 'supportText',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        project: 6,
        effect: function() {
            return;
        }
    },
}

const ETH_DATA = {
    11: {
        title: 'Hypertime',
        desc: function() { return `The first time upgrade in the fourth and fifth columns stay active during research.` },
        cost: new Decimal(1),
        displayEffect: false,
        displaySuffix: '',
        displayTooltip: false,
        displayFormula: function() {return ''},
        buttonID: 'ethUpg11',
        effect: function() {
            return new Decimal(1);
        },
        onBuy: function() {
            return;
        },
    },
    12: {
        title: 'Practical Theoretics',
        desc: function() { return `Each Ark component built multiplies corpse production by 10.` },
        cost: new Decimal(1),
        displayEffect: true,
        displaySuffix: 'x',
        displayTooltip: false,
        displayFormula: function() {return ''},
        buttonID: 'ethUpg12',
        effect: function() {
            return Decimal.pow(new Decimal(10), getNumArkUpgs());
        },
        onBuy: function() {
            return;
        },
    },
    13: {
        title: 'Meta-Solar',
        desc: function() { return `<span style="font-weight: bold;">Ultra-Solar</span> stays active during research.` },
        cost: new Decimal(1),
        displayEffect: false,
        displaySuffix: '',
        displayTooltip: false,
        displayFormula: function() {return ''},
        buttonID: 'ethUpg13',
        effect: function() {
            return new Decimal(1);
        },
        onBuy: function() {
            return;
        },
    },
    14: {
        title: 'Quantum Equivalence',
        desc: function() { return `Void Research production is multiplied by the log${hasUpgrade(4, 13) ? ' (ln after Ultra-Solar).' : ''} of your current bricks/sec.` },
        cost: new Decimal(1),
        displayEffect: true,
        displaySuffix: '',
        displayTooltip: false,
        displayFormula: function() {return ''},
        buttonID: 'ethUpg14',
        effect: function() {
            return (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? getBricksPerSecond().ln() : getBricksPerSecond().log10();
        },
        onBuy: function() {
            return;
        },
    },
}

const GALAXIES_DATA = {
    1: {
        name: 'andromeda',
        id: 1,
        upgrades: {
            11: {
                title: '1.11',
                desc: 'Decrease the astral enslavement time nerf from 10x -> 5x.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.11',
                lockImageID: '',
                textID: 'text1.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
                    displayData.push(['html', 'astralNerfResearch', formatWhole(getAstralNerf())]);
                },
            },
            21: {
                title: '1.21',
                desc: 'Increase the exponent on the astral brick production formula from ^0.2 -> ^0.3.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.21',
                lockImageID: 'skull1.21',
                textID: 'text1.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '1.22',
                desc: 'You produce 1% of your corpse production while in astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: true,
                displaySuffix: '/sec',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.22',
                lockImageID: 'skull1.22',
                textID: 'text1.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return player.astralFlag ? getCorpsesPerSecond().times(.01) : new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '1.31',
                desc: 'The astral time nerf doesn\'t apply to nekro-photon production (but you still only produce them during astral).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.31',
                lockImageID: 'skull1.31',
                textID: 'text1.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '1.32',
                desc: 'The square root of the anti time essence boost affects time dimensions while in astral enslavement.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.32',
                lockImageID: 'skull1.32',
                textID: 'text1.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return player.astralFlag ? getAntiTimeBuff().sqrt() : new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '1.41',
                desc: 'Decrease the astral enslavement time nerf even more, 5x -> 2x.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg1.41',
                lockImageID: '',
                textID: 'text1.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
                    displayData.push(['html', 'astralNerfResearch', formatWhole(getAstralNerf())]);
                },
            },
        },
    },
    2: {
        name: 'circinus',
        id: 2,
        upgrades: {
            11: {
                title: '2.11',
                desc: 'The base zombie corpse multiplier is increased, 1.75 -> 2.5.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg2.11',
                lockImageID: '',
                textID: 'text2.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '2.21',
                desc: 'Each unit tier produces the tier below it at a rate of 1/unit/sec instead of (1/tier)/unit/sec.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg2.21',
                lockImageID: 'skull2.21',
                textID: 'text2.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '2.22',
                desc: 'Start every sacrifice with one free exterminated world that doesn\'t increase the world prestige requirement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg2.22',
                lockImageID: 'skull2.22',
                textID: 'text2.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '2.31',
                desc: 'Your total galaxies multiply unit production multipliers.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: true,
                displayFormula: function() { return `1 + x` },
                buttonID: 'galaxyUpg2.31',
                lockImageID: 'skull2.31',
                textID: 'text2.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return getGalaxyUpgSoftcap(e.plus(1));
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '2.32',
                desc: 'Exponential cost scaling for all units starts after twice as many bought.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg2.32',
                lockImageID: 'skull2.32',
                textID: 'text2.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '2.41',
                desc: 'First time dimensions also produce Sun Eaters at a greatly reduced rate.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: '/sec',
                displayTooltip: true,
                displayFormula: function() { return `${hasUpgrade(4, 13) ? "ln(x)" : "log(x)"}` },
                buttonID: 'galaxyUpg2.41',
                lockImageID: '',
                textID: 'text2.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? getEssenceProdPerSecond().ln() : getEssenceProdPerSecond().log10();
                },
                onBuy: function() {
                    return;
                },
            },
        },
    },
    3: {
        name: 'sculptor dwarf',
        id: 3,
        upgrades: {
            11: {
                title: '3.11',
                desc: 'Cube the <span style=\"font-weight: 800;\">Industrialize</span> effect.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.11',
                lockImageID: '',
                textID: 'text3.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(3);
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '3.21',
                desc: 'The effect of each second row Necropolis upgrade directly applies to the effect of the upgrade above it.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.21',
                lockImageID: 'skull3.21',
                textID: 'text3.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '3.22',
                desc: 'Exponential cost scaling for the first four construction upgrades starts after twice as many levels.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.22',
                lockImageID: 'skull3.22',
                textID: 'text3.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '3.31',
                desc: 'Square your acolyte gain.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.31',
                lockImageID: 'skull3.31',
                textID: 'text3.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '3.32',
                desc: 'The effects of the first four construction upgrades are each 20% stronger.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.32',
                lockImageID: 'skull3.32',
                textID: 'text3.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1.2);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '3.41',
                desc: 'The <span style=\"font-weight: 800;\">Lightspeed</span> effect squared also applies to the production of corpses and astral bricks.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg3.41',
                lockImageID: '',
                textID: 'text3.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return hasTUpgrade(23) ? getTUpgEffect(33).pow(2) : new Decimal(1)
                },
                onBuy: function() {
                    return;
                },
            },
        },
    },
    4: {
        name: 'triangulum',
        id: 4,
        upgrades: {
            11: {
                title: '4.11',
                desc: 'Your total galaxies multiply time essence production.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: true,
                displayFormula: function() { return `1 + x` },
                buttonID: 'galaxyUpg4.11',
                lockImageID: '',
                textID: 'text4.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return getGalaxyUpgSoftcap(e.plus(1));
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '4.21',
                desc: 'Quadruple your time crystal gain.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg4.21',
                lockImageID: 'skull4.21',
                textID: 'text4.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(4);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '4.22',
                desc: 'The square root of the true time essence boost affects time dimensions outside of astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg4.22',
                lockImageID: 'skull4.22',
                textID: 'text4.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return player.astralFlag ? new Decimal(1) : getTrueTimeBuff().sqrt()
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '4.31',
                desc: 'Both time essence boosts are based on log(x)^2 instead of log(x).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg4.31',
                lockImageID: 'skull4.31',
                textID: 'text4.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(2);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '4.32',
                desc: 'You passively produce your astral brick production ^0.9 outside of astral enslavement (still affected by the astral time nerf).',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: true,
                displaySuffix: '/sec<br>(real time)',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg4.32',
                lockImageID: 'skull4.32',
                textID: 'text4.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return player.astralFlag ? new Decimal(0) : getBricksPerSecond().pow(0.9).div(getAstralNerf())
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '4.41',
                desc: 'True and anti time essence no longer nerf the other\'s effect.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() {return ''},
                buttonID: 'galaxyUpg4.41',
                lockImageID: '',
                textID: 'text4.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return (player.isInResearch ? 3*c : c);
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    if (hasUpgrade(4, 22)) {
                        document.getElementById('antiNerfDivText').style.display = 'none';
                        document.getElementById('trueNerfDivText').style.display = 'none';
                        document.getElementById('antiNerfTimesText').style.display = 'inline';
                        document.getElementById('trueNerfTimesText').style.display = 'inline';
                    }
                }
            },
        },
    },
}