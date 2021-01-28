const START_BUILDS = {

}

var astralFlag = false;

function toggleAstral() {
    if (!astralFlag) {
        astralFlag = true;
        document.getElementById('astralToggle').className = 'astralOn';
        document.getElementById('astralText').innerHTML = 'disable';
    } else {
        astralFlag = false;
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
    }
}