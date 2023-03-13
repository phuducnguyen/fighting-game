// Define a Sprite class for creating image fighter
class Sprite {
	constructor({ position, imageSrc }) {
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
	}

	draw() {
		c.drawImage(this.image, this.position.x, this.position.y)

	}

	update() {
		this.draw()
	}
}

// Define a Fighter class for creating player1 and player2 objects
class Fighter {
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

	// Draw the fighter
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

	// Update the fighter's position and velocity
	update() {
		this.draw()

		// Update the position of the attack box based on the position of the main object
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

		// Check if fighter is going out of bounds
  	if (this.position.x < 0) {
    	this.position.x = 0
  	} else if (this.position.x + this.width > canvas.width) {
    	this.position.x = canvas.width - this.width
  	}

		// Apply gravity
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Prevent fighter from falling through the ground
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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