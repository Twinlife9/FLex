let dogs = [];
function DogAttack(dog, player) {
  setTimeout(() => {
    if (!(player.isBlocking || isPause) && dog.doDmg && dog.hp > 0) {
      player.hp = Math.max(player.hp - dog.dmg, 0);
    }
    console.log(dog);
    
    dog.attack(dog, player);
  }, 1000);
}

function SpawnMobs() {
  for (let i = 0; i < 2; i++) {
    let dog = {
      dmg: 2,
      hp: 15,
      elem: 0,
      class: 'dog',
      attack: DogAttack,
      doDmg: false,
    };
    dog.elem = document.createElement('div');
    dog.elem.className = 'dog';
    let availableX = screen.width - player.elem.offsetLeft;
    let startX = Math.floor(
      Math.random() * availableX + player.elem.clientWidth
    );
    // console.log(startX);

    dog.elem.style.top = '778px';
    dog.elem.style.left = startX + 'px';
    dogs.push(dog);
    game.appendChild(dog.elem);
  }
}

function MobsMove(player) {
  dogs.forEach((dog, idx) => {
    if (
      dog.elem.offsetLeft >
      player.elem.offsetLeft + player.elem.clientWidth
    ) {
      dog.elem.style.left = dog.elem.offsetLeft - 3 + 'px';
      dog.elem.className = `${dog.class} look-right`;
      dog.doDmg = false;
    } else if (
      dog.elem.offsetLeft <
      player.elem.offsetLeft - dog.elem.clientWidth
    ) {
      // console.log('behind');
      dog.elem.className = `${dog.class} look-left`;
      dog.elem.style.left = dog.elem.offsetLeft + 3 + 'px';
      dog.doDmg = false;
    } else if (!dog.doDmg) {
      dog.attack(dog, player);
      dog.doDmg = true;
    }

    if (dog.hp <= 0) {
      dog.elem.remove();
      dogs.splice(idx, 1);
    }
  });
}
