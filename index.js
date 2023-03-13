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
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey = ''
	}

	// Draw the sprite as a red rectangle
	draw() {
		c.fillStyle = 'red'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	// Update the sprite's position and velocity
	update() {
		this.draw()

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
}

// Start the animation loop
animate()