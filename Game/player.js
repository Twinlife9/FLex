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
  player.elem.className = 'player-attack-one-one';
}


function Attack1loop(player) {
  player.elem.className = 'player-attack-one-loop';
}

function Block(player) {
  player.elem.className = 'player-block';
}