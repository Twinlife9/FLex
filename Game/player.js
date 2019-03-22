function MovePlayer(player, xvel) {
  if (xvel != 0) {
    //Win in the end
    if (player.elem.offsetLeft >= screen.width - player.elem.clientWidth * 2) {
      // console.log('WIN', 'TIME', getTime(iters));
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
        console.log('WALK OR SPRINT', player.elem.offsetLeft, backgroundPos);
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
    'player-attack-one-one ' + player.elem.className.split(' ')[1];
}

function Attack1loop(player) {
  player.elem.className =
    'player-attack-one-loop ' + player.elem.className.split(' ')[1];
}

let startHp = 0;
let once = false;
function Block(player) {
  if (player.mp < 5) {
    return;
  }

  // if (!once) {
  player.isBlocking = true;
  player.mp -= 5;
  once = true;
  // }

  player.elem.className = 'player-block ' + player.elem.className.split(' ')[1];
}

function Die(player) {
  player.elem.className = 'player-die ' + player.elem.className.split(' ')[1];
}
