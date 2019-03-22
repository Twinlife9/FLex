let dogs = [];
function DogAttack(dog, player) { 
  
  setTimeout(()=>{
    if (!(player.isBlocking || isPause)) {
      player.hp = Math.max(player.hp - dog.dmg, 0);
    }

    dog.attack(dog, player);
  }, 1000);
}

function SpawnMobs() {
  for (let i = 0; i < 2; i++) {
    let dog = {
      dmg: 20,
      hp: 15,
      elem: 0,
      attack: DogAttack,
      doDmg: false
    };
    dog.elem = document.createElement('div');
    dog.elem.className = 'dog';
    dog.elem.style.top = '778px';
    dog.elem.style.left = '800px';
    dogs.push(dog);
    game.appendChild(dog.elem);
  }
}
let damage = false;
function MobsMove(player) {
  dogs.forEach(dog => {
    if (dog.elem.offsetLeft > player.elem.offsetLeft + 100) {
      dog.elem.style.left = dog.elem.offsetLeft - 3 + 'px';
    } else if(!dog.doDmg) {
      dog.attack(dog,player);
      dog.doDmg = true;
    }
  });
}
