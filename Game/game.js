/////
const DEBUG = true;

let isPause = false;
let player = {
  hp: 100,
  mp: 100,
  elem: 0,
  isBlocking: false,
};

let score = 0;
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
  let classStates = ['idle', 'mv', 'sprint', 'dog', 'run', 'attack'];
  if (!isPause) {
    //For every animating object ....
    {
      classStates.forEach(el => {
        let target = el + '-static';
        player.elem.className = player.elem.className.replace(el, target);
        mobs.forEach(mob => {
          // console.log(mob, el, target);
          mob.elem.className = mob.elem.className.replace(el, target);
        });
      });
    }
    isPause = true;
  } else {
    //For every animating object ....
    {
      classStates.forEach(el => {
        let target = el + '-static';
        player.elem.className = player.elem.className.replace(target, el);
        mobs.forEach(mob => {
          // console.log(mob, el, target);
          mob.elem.className = mob.elem.className.replace(target, el);
        });
      });
    }

    isPause = false;
  }
}
function UpdateScore(pts) {
  score += pts;
  let scoreCounter = document.querySelector('.kills');
  scoreCounter.innerHTML = `Killed: ${score}`;
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
    //
    if (mobs.length === 0) {
      SpawnMobs();
    }
    if (mobs.length < 9) {
      let hits = 0;
      mobs.forEach((mob)=>{
        if (mob.elem.offsetLeft < 0 || mob.elem.offsetLeft > screen.width) {
          hits++;
        }
      });
      if (hits >= 3) {
        SpawnMobs();
      }
    }
  }, 1000);
}

let xvel = 0;
let isShfit = false;
let attackCnt = 0;
function SetupMovement() {
  document.onkeydown = e => {
    // console.log(e);
    isShfit = e.shiftKey;
    if (isPause && e.keyCode != 27) {
      return;
    }

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
        Attack1(player);
        break;

      case 50:
        if (attackCnt != 50) {
          Block(player);
          attackCnt = e.keyCode;
        }
        break;

      case 51:
        AttackShahslik(player);
        break;

      case 52:
        AttackAoe(player);
        break;

      default:
        break;
    }
  };

  document.onkeyup = e => {
    if (isPause) {
      return;
    }
    if (e.keyCode == 49) {
      setTimeout(() => {
        document.onkeyup({ ...e, keyCode: 777 });
      }, 700);
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
  if (isPause) {
    return;
  }

  updateMP(player.mp);
  updateHP(player.hp);

  MovePlayer(player, xvel);
  MobsMove(player);

  ShaslikUpdate()
  
}
