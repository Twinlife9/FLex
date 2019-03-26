let mobs = [];
function MobAttack(mob, player) {
  setTimeout(() => {
    if (mob.hp <= 0) {
      return;
    }
    if (!(player.isBlocking || isPause) && mob.doDmg) {
      player.hp = Math.max(player.hp - mob.dmg, 0);
    }
    //  console.log(mob);

    mob.attack(mob, player);
  }, 1000);
}
function ElfAttack(mob, player) {
  
    mob.elem.className = 'elf-attack ' + mob.elem.className.split(' ')[1];
    MobAttack(mob, player);
}

function SpawnMobs() {
  let dog = {
    dmg: 2,
    hp: 15,
    ms: 3,
    elem: undefined,
    class: 'dog',
    attack: MobAttack,
    doDmg: false,
  };

  let elf = {
    dmg: 5,
    hp: 30,
    ms: 2,
    elem: undefined,
    class: 'elf-run',
    attack: ElfAttack,
    doDmg: false,
  };

  let mobtypes = [dog, elf];
  for (let i = 0; i < 2; i++) {
    let mob = mobtypes[i];
    mob.elem = document.createElement('div');
    mob.elem.className = mob.class;
    let availableX =
      screen.width - player.elem.offsetLeft - player.elem.clientWidth;

    let startX = Math.floor(
      Math.random() * availableX + player.elem.offsetLeft
    );
    // console.log(startX);
    setTimeout(() => {
      mob.elem.style.top = 853 - mob.elem.clientHeight + 'px';
      mob.elem.style.left = startX + 'px';
    }, 1);

    let hpBar = document.createElement('div');
    hpBar.className = 'hp-bar';

    mob.maxHp = mob.hp;

    mob.hpBar = hpBar;
    mob.elem.appendChild(hpBar);

    mobs.push(mob);
    game.appendChild(mob.elem);
  }
}

function MobsMove(player) {
  mobs.forEach((mob, idx) => {
    let bgpos = parseInt(game.style.backgroundPositionX.replace('px',''));
    if (
      mob.elem.offsetLeft >
      player.elem.offsetLeft + player.elem.clientWidth
    ) {
      mob.elem.style.left = mob.elem.offsetLeft - mob.ms + 'px';
      mob.elem.className = `${mob.class} look-right`;
      mob.doDmg = false;
    } else if (
      mob.elem.offsetLeft <
      player.elem.offsetLeft - mob.elem.clientWidth
    ) {
      // console.log('behind');
      mob.elem.className = `${mob.class} look-left`;
      mob.elem.style.left = mob.elem.offsetLeft + mob.ms + 'px';
      mob.doDmg = false;
    } else if (!mob.doDmg) {
      mob.attack(mob, player);
      mob.doDmg = true;
    }

    let precentHp = (mob.hp / mob.maxHp) * 100;
    mob.hpBar.style.width = `${precentHp}%`;

    if (mob.hp <= 0) {
      mob.elem.remove();
      mobs.splice(idx, 1);
      UpdateScore(1);
    }
  });
}
