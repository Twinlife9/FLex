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

  if (player.mp < 30) {
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

let shashlik = { block: -1, rot: 0, slength: -1 };
let shashlikCooldown = false;

function AttackShashlik(player) {
  if (shashlikCooldown) {
    return;
  }

  if (player.mp < 30) {
    return;
  }

  mobs.forEach((mob)=>{
    mob.hitted = false;
  })
  player.mp -= 10;
  if (typeof shashlik.block === 'object') {
    shashlik.block.remove();
    shashlik.block = -1;
    shashlik.rot = 0;
  }

  let block = document.createElement('div');
  block.className = 'player-shashlik ' + player.elem.className.split(' ')[1];
  let rot = player.elem.className.split(' ')[1] == 'look-left' ? -1 : 1;

  block.style.left =
    player.elem.offsetLeft + rot * player.elem.clientWidth + 'px';
  block.style.top = '750px';

  shashlik.block = block;
  shashlik.rot = rot;
  shashlik.slength = mobs.length;

  game.appendChild(shashlik.block);

  shashlikCooldown = true;
  setTimeout(() => {
    shashlikCooldown = false;
  }, 3000);
}

function ShaslikUpdate() {
  if (shashlik.block == -1 || shashlik.rot == 0) {
    return;
  }
  shashlik.block.style.left = shashlik.block.offsetLeft + (shashlik.rot*10) + 'px';

  if(shashlik.block.offsetLeft > screen.width||
    shashlik.block.offsetLeft < 0 - shashlik.block.clientWidth){
      shashlik.block.remove();
      shashlik.block = -1;
      shashlik.rot = 0;
    }

    mobs.forEach((mob,idx)=>{
      if (mob.hitted) {
         return;
      }

      if (idx > shashlik.slength - 1) {
        return;
      }

      if (shashlik.block.offsetLeft + shashlik.block.clientWidth > mob.elem.offsetLeft && shashlik.rot > 0) {
        mob.hitted = true;
        mob.hp -= 40;
        // console.log('hit',mob);
        
      }
      // console.log(shashlik);
      
      if (shashlik.block.offsetLeft < mob.elem.offsetLeft && shashlik.rot < 0) {
        mob.hitted = true;
        mob.hp -= 40;
        // console.log(mob,'hit');
        
      }
    })
}

function Die(player) {
  player.elem.className = 'player-die ' + player.elem.className.split(' ')[1];
}
