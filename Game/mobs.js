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
  if (mob.doDmg) {
    mob.elem.className = 'elf-attack ' + mob.elem.className.split(' ')[1];
    MobAttack(mob, player);
  }
}

function GreenchAttack(mob, player) {
  if (mob.doDmg) {
    mob.elem.className = 'greench-attack ' + mob.elem.className.split(' ')[1];
    MobAttack(mob, player);
  }
}
function MobDie(mob, idx) {
  mob.elem.remove();
  mobs.splice(idx, 1);
  UpdateScore(1);
}

function ElfDie(mob, idx) {
  // mobs.splice(idx, 1);
  // mob.elem.className = 'elf-die ' + mob.elem.className.split(' ')[1];
  // setTimeout(() => {
  // mob.elem.remove();
  // UpdateScore(1);
  MobDie(mob, idx);
  // }, 1000);
}

function SpawnMobs() {
  let dog = {
    dmg: 2,
    hp: 15,
    ms: 3,
    elem: undefined,
    class: 'dog',
    attack: MobAttack,
    die: MobDie,
    doDmg: false,
  };

  let elf = {
    dmg: 5,
    hp: 30,
    ms: 2.5,
    elem: undefined,
    class: 'elf-run',
    attack: ElfAttack,
    die: ElfDie,
    doDmg: false,
  };
  
  let greench = {
    dmg: 10,
    hp: 60,
    ms: 1.9,
    elem: undefined,
    class: 'greench-run',
    attack: GreenchAttack,
    die: ElfDie,
    doDmg: false,
  };

  let mobtypes = [dog, elf, greench];
  for (let i = 0; i < 3; i++) {
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
      mob.doDmg = true;
      mob.attack(mob, player);
    }

    let precentHp = (mob.hp / mob.maxHp) * 100;
    mob.hpBar.style.width = `${precentHp}%`;

    if (mob.hp <= 0) {
      mob.die(mob, idx);
    }
  });
}
