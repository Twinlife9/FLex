/////
const DEBUG = true;

let isPause = false;
let player = {
  hp: 100,
  mp: 100,
  elem: 0,
  isBlocking: false
};

let game = 0;
function GameStart() {
  game = document.querySelector('.screen-game');
  player.elem = document.createElement('div');
  player.elem.className = 'player-idle';
  player.elem.style.top = '700px';
  player.elem.style.left = '100px';
  game.appendChild(player.elem);
  SetupMovement();
  SpawnMobs();
  StartTimer();
  setTimeout(() => {
    setInterval(GameLoop, 1000 / 60);
  }, 20);
}

function Pause() {
  let classStates = ['idle', 'mv', 'sprint', 'dog'];
  if (!isPause) {
    //For every animating object ....
    {
      classStates.forEach(el => {
        let target = el + '-static';
        player.elem.className = player.elem.className.replace(el, target);
      });
    }
    isPause = true;
  } else {
    //For every animating object ....
    {
      classStates.forEach(el => {
        let target = el + '-static';
        player.elem.className = player.elem.className.replace(target, el);
      });
    }

    isPause = false;
  }
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
    if (isPause) {
      return;
    }
    let timer = document.querySelector('.timer');
    let time = getTime(iters);
    timer.innerHTML = `Time: ${time}`;
    iters++;
    //HP & MP REGEN
    player.mp = Math.min(Math.max(player.mp + 5, 0), 100);
    player.hp = Math.min(Math.max(player.hp + 2, 0), 100);
  }, 1000);
}

let xvel = 0;
let isShfit = false;
let attackCnt = 0;
function SetupMovement() {
  document.onkeydown = e => {
    console.log(e);
    isShfit = e.shiftKey;
    switch (e.keyCode) {
      case 27:
        Pause();
        break;
      //MOVEMENT
      case 37:
        xvel = -3;
        break;
      case 39:
        xvel = 3;
        break;
      //Attacks
      case 49:
        if (attackCnt < 1) {
          Attack1(player);
        } else {
          Attack1loop(player);
        }
        attackCnt++;
        break;

      case 50:
        if (attackCnt != 50) {
          Block(player);
          attackCnt = e.keyCode;
        }
        break;

        case 80:
          Die(player);

          break;
      default:
        break;
    }
  };

  document.onkeyup = e => {
    if (isPause) {
      return;
    }
    player.elem.className =
      'player-idle ' + player.elem.className.split(' ')[1];
    xvel = 0;
    player.isBlocking = false;
    attackCnt = 0;
  };
}

let backgroundPos = 0;

function GameLoop() {
  //Pause thingy
  if (isPause) {
    return;
  }

  //Keeping track of hp and mp values
  updateMP(player.mp);
  updateHP(player.hp);

  //====================
  //PLAYER MOVEMENT
  //====================
  MovePlayer(player, xvel);
  //====================
  //Enemies movement
  //====================

  MobsMove(player);
}
