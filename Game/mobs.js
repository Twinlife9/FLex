let dogs = [];
function SpawnMobs() {
  for (let i = 0; i < 1; i++) {
    let dog = {
      dmg: 2,
      hp: 15,
      elem: 0,
    };
    dog.elem = document.createElement('div');
    dog.elem.className = 'dog';
    dog.elem.style.top = '778px';
    dog.elem.style.left = '800px';
    dogs.push(dog);
    game.appendChild(dog.elem);
  }
}

function MobsMove(player) {
  dogs.forEach(dog =>{
    if (dog.elem.offsetLeft > player.elem.offsetLeft + 100) {
      dog.elem.style.left = dog.elem.offsetLeft - 3 + 'px'; 
    } else {
      player.hp  =Math.floor(Math.max(player.hp - 0.125*60 ,0));
    }
  })
}