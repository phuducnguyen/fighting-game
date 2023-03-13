// Detect attack collisions between two objects
function attackCollision({ obj1, obj2 }) {
	return (
		obj1.attackBox.position.x + obj1.attackBox.width >=
      obj2.position.x &&
    obj1.attackBox.position.x <=
      obj2.position.x + obj2.width &&
    obj1.attackBox.position.y + obj1.attackBox.height >=
      obj2.position.y &&
    obj1.attackBox.position.y <= obj2.position.y + obj2.height
	)
}

const displayText = document.querySelector('#displayText')
const timerEl = document.querySelector('#timer')

function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);

	displayText.style.display = 'flex';

	if (player.health === enemy.health) {
    displayText.innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    displayText.innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    displayText.innerHTML = 'Player 2 Wins'
  }
}

let timer = 60
let timerId

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    timerEl.innerHTML = timer;
  } 

  if (timer === 0) {
  	determineWinner({ player, enemy, timerId });
  }
}