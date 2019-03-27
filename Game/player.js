function MovePlayer(player, xvel) {
  if (xvel != 0) {
    //Win in the end
    if (player.elem.offsetLeft >= screen.width - player.elem.clientWidth * 2) {
      // console.log('WIN', 'TIME', getTime(iters));
      Pause();
      return;
    }
    //left border
    if (player.elem.offsetLeft > 0 || xvel > 0) {
      let speed_mp = DEBUG ? 10 : 2;
      //if moved more than half of the screen wdith
      //scroll the backgound
      if (
        player.elem.offsetLeft <
          screen.width / 2 - player.elem.clientWidth / 2 ||
        backgroundPos >= 6500 ||
        backgroundPos == 1
      ) {
        // console.log('WALK OR SPRINT', player.elem.offsetLeft, backgroundPos);
        if (backgroundPos == 1) {
          backgroundPos = 0;
        }
        //Sprint stuff...
        if (isShfit) {
          player.elem.style.left =
            player.elem.offsetLeft + xvel * speed_mp + 'px';
        } else {
          player.elem.style.left = player.elem.offsetLeft + xvel + 'px';
        }
      } else {
        //Scroll da backround
        backgroundPos += isShfit ? xvel * speed_mp : xvel;
        if (backgroundPos < 0) {
          backgroundPos = 1;
        }
        game.style.backgroundPositionX = -backgroundPos + 'px';
        mobs.forEach(mob => {
          mob.elem.style.left =
            mob.elem.offsetLeft - (isShfit ? xvel * speed_mp : xvel) + 'px';
        });
      }

      //animations
      player.elem.className =
        'player-mv ' + (xvel > 0 ? 'look-right' : 'look-left');
      if (isShfit) {
        player.elem.className = player.elem.className.replace('mv', 'sprint');
      }
    }
  }
}

function updateBar(polygon, textValue, pp) {
  textValue.innerHTML = pp;
  if (polygon.className == 'panel-mp') {
    textValue.style.left = `${pp - 20}px`;
  } else {
    textValue.style.left = `${pp}px`;
  }
  polygon.style.clipPath = `polygon(0% 0%, ${pp}% 0%, ${pp -
    10}% 100%, 0% 100%)`;
  if (polygon.className == 'panel-mp' && pp < 40) {
    textValue.style.display = 'none';
  } else if (pp < 20) {
    textValue.style.display = 'none';
  } else {
    textValue.style.display = 'block';
  }
}

function updateHP(hp) {
  if (hp == 0) {
    Die(player);
  }
  let polygon = document.querySelector('.panel-xp');
  let textValue = document.querySelector('.panel-xp > div > span');
  updateBar(polygon, textValue, hp);
}

function updateMP(mp) {
  let polygon = document.querySelector('.panel-mp');
  let textValue = document.querySelector('.panel-mp > div > span');
  updateBar(polygon, textValue, mp);
}

function Attack1(player) {
  player.elem.className =
    'player-attack-one-loop ' + player.elem.className.split(' ')[1];
  // let idx = parseInt(player.elem.nextSibling.id);
  // console.log(idx, dogs[idx], dogs);

  mobs.forEach(mob => {
    if (
      !(
        mob.elem.offsetLeft >
        player.elem.offsetLeft + player.elem.clientWidth
      ) &&
      !(mob.elem.offsetLeft < player.elem.offsetLeft - mob.elem.clientWidth)
    ) {
      setTimeout(() => {
        mob.hp -= 15;
      }, 500);
    }
  });
}

let startHp = 0;
let once = false;
function Block(player) {
  if (player.mp < 5) {
    return;
  }

  player.isBlocking = true;
  player.mp -= 5;

  player.elem.className = 'player-block ' + player.elem.className.split(' ')[1];
  setTimeout(() => {
    player.elem.className = player.elem.className.replace(
      'block ',
      'blocking '
    );
  }, 460);
}

let aoeCooldown = false;
function AttackAoe(player) {
  if (aoeCooldown) {
    return;
  }

  player.mp -= 30;
  let aoeDispaly = document.createElement('div');
  aoeDispaly.className = 'player-aoe';
  let rot = player.elem.className.split(' ')[1] == 'look-left' ? -1.2 : 1;

  aoeDispaly.style.left =
    player.elem.offsetLeft + rot * player.elem.clientWidth + 'px';
  aoeDispaly.style.top = '700px';
  game.appendChild(aoeDispaly);

  setTimeout(() => {
    mobs.forEach(mob => {
      if (
        mob.elem.offsetLeft + mob.elem.clientWidth <=
          aoeDispaly.offsetLeft + aoeDispaly.clientWidth &&
        mob.elem.offsetLeft <= aoeDispaly.offsetLeft + aoeDispaly.clientWidth
      ) {
        mob.hp -= 100;
      }
    });
    aoeDispaly.style.transition = 'all 0.5s';
    aoeDispaly.style.opacity = '0';
    setTimeout(() => {
      aoeDispaly.remove();
    }, 500);
  }, 2000);
  aoeCooldown = true;
  setTimeout(() => {
    aoeCooldown = false;
  }, 15000);
}
let shashlik_obj = { shashlik: undefined, rot: 1 };
let shashlikCooldown = false;
function AttackShahslik(player) {
  if (shashlikCooldown) {
    return;
  }
  //player.mp -= 10;
  if (shashlik_obj.shashlik) {
    shashlik_obj.shashlik.remove();
  }
  pMob = 0;
  let shashlik = document.createElement('div');
  shashlik.className = 'player-shashlik ' + player.elem.className.split(' ')[1];
  let rot = player.elem.className.split(' ')[1] == 'look-left' ? -1 : 1;

  shashlik.style.left =
    player.elem.offsetLeft + rot * player.elem.clientWidth + 'px';
  shashlik.style.top = '750px';
  shashlik_obj.shashlik = shashlik;
  shashlik_obj.rot = rot;
  game.appendChild(shashlik);

/*  shashlikCooldown = true;
  setTimeout(() => {
    shashlikCooldown = false;
  }, 3000);*/
}
let pMob = 0;
let frame = 0;
function ShaslikUpdate() {
  let shashlik = shashlik_obj.shashlik;
  let rot = shashlik_obj.rot;
  if (typeof shashlik === 'undefined') {
    return;
  }
  if (
    shashlik.offsetLeft >= screen.width ||
    shashlik.offsetLeft < 0 - shashlik.clientWidth
  ) {
    shashlik_obj.shashlik.remove();
    shashlik_obj.shashlik = undefined;
    return;
  }
  let mobIdx = frame % mobs.length;
  let mob = mobs[mobIdx];
  if (!mob) {
    return;
  }
  shashlik.style.left = shashlik.offsetLeft + rot * 20 + 'px';
  // mobs.forEach(mob => {
    if (mob == pMob) {
      return;
    }
    if (
      rot > 0 &&
      shashlik.offsetLeft > mob.elem.offsetLeft + mob.elem.clientWidth
    ) {
      mob.hp -= 40;
      pMob = mob;
    } else if (
      rot < 0 &&
      shashlik.offsetLeft < mob.elem.offsetLeft
    ) {
      mob.hp -= 40;
      pMob = mob;
    }

  mobs[mobIdx] = mob;
  // });
  frame++
}

function Die(player) {
  player.elem.className = 'player-die ' + player.elem.className.split(' ')[1];
}
