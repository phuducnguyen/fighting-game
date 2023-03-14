// Set up the canvas element from the HTML document and get its 2D rendering context
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Set the dimensions of the canvas element
canvas.width = 1024
canvas.height = 576

// Draw a filled rectangle covering the entire canvas
c.fillRect(0, 0, canvas.width, canvas.height)

// Set the gravity constant for all sprites
const gravity = 0.7

// Track of the ground level
const groundHeight = canvas.height - 96

// // Creating a sprite object for the background image
const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/background.png'
});

// Creating a sprite object for the shop image
const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	imageSrc: './img/shop.png',
	scale: 2.75,
	framesMax: 6
});

// Create a new player fighter at the top-left corner of the canvas
const player = new Fighter({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './img/kenshin/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './img/kenshin/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/kenshin/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenshin/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenshin/Fall.png',
			framesMax: 2
		}
	}
})

// Create a new enemy fighter at the top-right corner of the canvas
const enemy = new Fighter({
	position: {
		x: canvas.width - 50,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	}
})

// Create an object to keep track of which keys are currently pressed
const keys = {
	a: {
		pressed: false
	},
	d: {
    pressed: false
  },
  w: {
  	pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
  	pressed: false
  }
}

window.addEventListener('keydown', (event) => {
  console.log(event.key)
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      if (!keys.w.pressed && player.position.y >= (groundHeight - player.height)) {
        // Set the player's vertical velocity to a negative value to simulate a jump
        player.velocity.y = -20
        keys.w.pressed = true
      }
      break
    case 's':
    	player.attack()
    	break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      if (!keys.ArrowUp.pressed && enemy.position.y + enemy.height >= canvas.height) {
        keys.ArrowUp.pressed = true
        enemy.velocity.y = -20
      }
      break
     case 'ArrowDown':
     	enemy.attack()
     	break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
  }
})

function handleMovement() {
	// Player movement
  if (keys.a.pressed) {
    player.velocity.x = -10
    player.switchSprite('run')
  } else if (keys.d.pressed) {
    player.velocity.x = 10
    player.switchSprite('run')
  } else {
    player.velocity.x = 0
    player.switchSprite('idle')
  }

  // Jumping
  if (keys.w.pressed && player.position.y >= (groundHeight - player.height)) {
  	player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
  	player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed) {
    enemy.velocity.x = -10
  } else if (keys.ArrowRight.pressed) {
    enemy.velocity.x = 10
  } else {
    enemy.velocity.x = 0
  }
}

decreaseTimer()

// Define the animation loop
function animate() {
	// Request the next animation frame
	requestAnimationFrame(animate)

	// Clear the canvas with a black background
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	// Draw the background
	background.update()

	// Draw the shop sprite
	shop.update()

	// Update and draw the player and enemy sprites
	player.update()
	// enemy.update()

	handleMovement()

	// Collision detection
  if (player.position.x + player.width >= enemy.position.x &&
      player.position.x <= enemy.position.x + enemy.width &&
      player.position.y + player.height >= enemy.position.y) {
    console.log('collision!')
  }

  // Detect for attack collisions
  // Player attacks Enemy
  if (attackCollision({
      obj1: player,
      obj2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  // Enemy attacks Player
  if (
    attackCollision({
      obj1: enemy,
      obj2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
  	player.health -= 20
  	document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  // Endgame based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

// Start the animation loop
animate()

