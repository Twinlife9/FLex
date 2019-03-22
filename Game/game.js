/////
const DEBUG = true;

let player = 0;
let game = 0;
function GameStart() {
  game = document.querySelector('.screen-game');
  player = document.createElement('div');
  player.className = 'player-idle';
  player.style.top = '100px';
  player.style.left = '100px';
  game.appendChild(player);
  SetupMovement();
  StartTimer();
  setTimeout(() => {
    setInterval(GameLoop, 1000 / 60);
  }, 20);
}

function getTime(start) {
  let date = new Date(start * 1000);
  let date_str = date.toString().split(' ');
  let MinsSecs = date_str[4].split(':');
  MinsSecs.shift();
  return MinsSecs.join(':');
}

let iters = 0;
function StartTimer() {
  setInterval(() => {
    let timer = document.querySelector('.timer');
    let time = getTime(iters);
    timer.innerHTML = `Time: ${time}`;
    iters++;
  }, 1000);
}

let xvel = 0;
let isShfit = false;
function SetupMovement() {
  document.onkeydown = e => {
    console.log(e);
    isShfit = e.shiftKey;
    switch (e.keyCode) {
      case 37:
        xvel = -3;
        break;
      case 38:
        player.style.top = player.offsetTop - 3 + 'px';
        break;
      case 39:
        xvel = 3;
        break;
      default:
        break;
    }
  };
  document.onkeyup = e => {
    player.className = player.className
      .replace('sprint', 'mv')
      .replace('mv', 'idle');
      xvel = 0;
  };
}

let backgroundPos = 0;

function GameLoop() {
  ///
  ///PLAYER MOVEMENT
  ///

  if (xvel != 0) {
    //Win in the end
    if (player.offsetLeft >= (screen.width - player.clientWidth * 2)) {
    console.log('WIN', 'TIME', getTime(iters));
    return;
    }
    //left border
    if (player.offsetLeft > 0 || xvel > 0) {
      let speed_mp = DEBUG ? 10 : 2;
      //if moved more than half of the screen wdith
      //scroll the backgound
      if (
         player.offsetLeft < (screen.width / 2 - player.clientWidth / 2)   
         ||  backgroundPos >= 6500 || backgroundPos == 1  
      ) {
        console.log('WALK OR SPRINT',player.offsetLeft, backgroundPos );
        if (backgroundPos == 1) {
          backgroundPos = 0;
        }
        //Sprint stuff...
        if (isShfit) {
          player.style.left = player.offsetLeft + xvel * speed_mp + 'px';
        } else {
          player.style.left = player.offsetLeft + xvel + 'px';
        }
      } else {
        //Scroll da backround
        backgroundPos += isShfit ? xvel * speed_mp : xvel;
        if (backgroundPos < 0) {
          backgroundPos = 1;
        }
        game.style.backgroundPositionX = -backgroundPos + 'px';
      }

      //animations
      player.className = 'player-mv ' + (xvel > 0 ? 'look-right' : 'look-left');
      if (isShfit) {
        player.className = player.className.replace('mv', 'sprint');
      }
    }
  }
}
