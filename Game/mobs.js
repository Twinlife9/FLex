let mobs = [];
function DogAttack(mob, player) {
  setTimeout(() => {
    if (!(player.isBlocking || isPause) && mob.doDmg && mob.hp > 0) {
      player.hp = Math.max(player.hp - mob.dmg, 0);
    }
    // console.log(mob);
    
    mob.attack(mob, player);
  }, 1000);
}

function SpawnMobs() {
  for (let i = 0; i < 2; i++) {
    let mob = {
      dmg: 2,
      hp: 15,
      elem: 0,
      class: 'dog',
      attack: DogAttack,
      doDmg: false,
    };
    mob.elem = document.createElement('div');
    mob.elem.className = mob.class;
    let availableX = screen.width - player.elem.offsetLeft;
    let startX = Math.floor(
      Math.random() * availableX + player.elem.clientWidth
    );
    // console.log(startX);

    mob.elem.style.top = '768px';
    mob.elem.style.left = startX + 'px';
    mobs.push(mob);
    game.appendChild(mob.elem);
  }
}

function MobsMove(player) {
  mobs.forEach((mob, idx) => {
    if (
      mob.elem.offsetLeft >
      player.elem.offsetLeft + player.elem.clientWidth
    ) {
      mob.elem.style.left = mob.elem.offsetLeft - 3 + 'px';
      mob.elem.className = `${mob.class} look-right`;
      mob.doDmg = false;
    } else if (
      mob.elem.offsetLeft <
      player.elem.offsetLeft - mob.elem.clientWidth
    ) {
      // console.log('behind');
      mob.elem.className = `${mob.class} look-left`;
      mob.elem.style.left = mob.elem.offsetLeft + 3 + 'px';
      mob.doDmg = false;
    } else if (!mob.doDmg) {
      mob.attack(mob, player);
      mob.doDmg = true;
    }

    if (mob.hp <= 0) {
      mob.elem.remove();
      mobs.splice(idx, 1);
      UpdateScore(1);
    }
  });
}
