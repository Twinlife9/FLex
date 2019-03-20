let player = 0;
function GameStart() {
  const game = document.querySelector('.screen-game');
  player = document.createElement('div');
  player.className = 'player-idle';
  player.style.top = '100px';
  player.style.left = '100px';
  game.appendChild(player);
  SetupMovement();
}

function mv(e, baseSpeed, dir){
  player.style.left = player.offsetLeft + (e.shiftKey ? baseSpeed*2 : baseSpeed) + 'px';
  player.className = dir;
  if (e.shiftKey) {
    player.className = dir.replace('mv','sprint');
  }
}
let direction = 'r';
function SetupMovement() {
  document.onkeydown = e => {
    console.log(e);
    
    switch (e.keyCode) {
      case 37:
        mv(e,-3,'player-mv');
        if (direction != 'l') {
          player.className = 'player-mv look-left'
          direction = 'l';
        }
        break;
        case 38:
        player.style.top = player.offsetTop - 3 + 'px';
        break;
        case 39:
        mv(e,3,'player-mv');
        break;
        case 40:
        player.style.top = player.offsetTop + 3 + 'px';
        if (direction != 'r') {
          player.className = 'player-mv look-right'
          direction = 'r';
        }
        break;
      default:
        break;
    }
  };
  document.onkeyup = e =>{
    player.className = 'player-idle';  
  };
}
