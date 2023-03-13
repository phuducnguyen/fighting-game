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

// Define a Sprite class for creating player and enemy objects
class Sprite {
	constructor({ position, velocity, color = 'red', offset }) {
		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.color = color
		this.health = 100
		this.lastKey = ''
		// attackBox object to store the position and dimensions of the attack area
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50
		}
		this.isAttacking = false
	}

	// Draw the sprite
	draw() {
		// Draw the object
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)

		// Draw its attack box if it's attacking
		if (this.isAttacking) {
			c.fillStyle = 'green'
			c.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
			)
		}
	}

	// Update the sprite's position and velocity
	update() {
		this.draw()

		// Update the position of the attack box based on the position of the main object
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

		// Check if sprite is going out of bounds
  	if (this.position.x < 0) {
    	this.position.x = 0
  	} else if (this.position.x + this.width > canvas.width) {
    	this.position.x = canvas.width - this.width
  	}

		// Apply gravity
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Prevent sprite from falling through the ground
		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0
		} else {
			this.velocity.y += gravity
		}
	}

	// Attack action of the character
	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
	}
}

// Create a new player sprite at the top-left corner of the canvas
const player = new Sprite({
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
	}
})

// Create a new enemy sprite at the top-right corner of the canvas
const enemy = new Sprite({
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
      if (!keys.w.pressed && player.position.y + player.height >= canvas.height) {
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
        enemy.velocity.y = -20
        keys.ArrowUp.pressed = true
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
  if (keys.a.pressed) {
    player.velocity.x = -10
  } else if (keys.d.pressed) {
    player.velocity.x = 10
  } else {
    player.velocity.x = 0
  }

  if (keys.ArrowLeft.pressed) {
    enemy.velocity.x = -10
  } else if (keys.ArrowRight.pressed) {
    enemy.velocity.x = 10
  } else {
    enemy.velocity.x = 0
  }
}

// Define the animation loop
function animate() {
	// Request the next animation frame
	window.requestAnimationFrame(animate)

	// Clear the canvas with a black background
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	handleMovement()

	// Update and draw the player and enemy sprites
	player.update()
	enemy.update()

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
}

// Start the animation loop
animate()