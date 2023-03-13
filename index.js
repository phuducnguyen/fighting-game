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
	}

	// Draw the sprite as a red rectangle
	draw() {
		c.fillStyle = 'red'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	// Update the sprite's position and velocity
	update() {
		this.draw()
		this.position.y += this.velocity.y

		// If the sprite hits the ground, set its velocity to 0
		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0
		} else {
			// Otherwise, increase the sprite's velocity due to gravity
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

// Define the animation loop
function animate() {
	// Request the next animation frame
	window.requestAnimationFrame(animate)

	// Clear the canvas with a black background
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	// Update and draw the player and enemy sprites
	player.update()
	enemy.update()
}

// Start the animation loop
animate()
