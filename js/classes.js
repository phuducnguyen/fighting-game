// The Sprite class represents an image that can be drawn to a canvas
class Sprite {
	// Constructor function that sets up the properties of the Sprite object
	constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
		// The position of the sprite on the canvas
		this.position = position;

		// The width and height of the sprite
		this.width = 50;
		this.height = 150;

		// The image object that will be drawn to the canvas
		this.image = new Image();
		this.image.src = imageSrc;

		// The scale of the sprite (default is 1)
		this.scale = scale;

		// The number of frames in the sprite's animation
		this.framesMax = framesMax;

		// The current frame of the sprite's animation
		this.framesCurrent = 0;

		// The number of frames that have elapsed since the last frame change
		this.framesElapsed = 0;

		// The number of frames to hold each frame of the animation
		this.framesHold = 5;

		this.offset = offset;
	}

	// Draws the sprite to the canvas
	draw() {
		const { x, y } = this.position;
		const { width, height, framesMax, framesCurrent, image } = this;
		const frameWidth = this.image.width / this.framesMax;
		c.drawImage(
			image,
			framesCurrent * frameWidth,
			0,
			frameWidth,
			image.height, 
			x - this.offset.x, 
			y - this.offset.y, 
			frameWidth * this.scale, 
			image.height * this.scale
		)
	}

	animateFrames() {
		this.framesElapsed++;
		if (this.framesElapsed % this.framesHold === 0) {
			// using the modulus operator to cycle through the animation frames
			this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
		}
	}

	// Updates the sprite's animation
	update() {
		this.draw();
		this.animateFrames();
	}
}

// Define a Fighter class for creating characters
class Fighter extends Sprite {
	constructor({ 
		position, 
		velocity, 
		color = 'red', 
		imageSrc, 
		scale = 1, 
		framesMax = 1,
		offset = { x: 0, y: 0 }
	}) {
		super({ 
			position, 
			imageSrc, 
			scale, 
			framesMax,
			offset
		})
		this.velocity = velocity
		this.color = color
		this.width = 50
		this.height = 150
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
		this.isAttacking
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
	}

	// // Draw the fighter
	// draw() {
	// 	// Draw the object
	// 	c.fillStyle = this.color
	// 	c.fillRect(this.position.x, this.position.y, this.width, this.height)

	// 	// Draw its attack box if it's attacking
	// 	if (this.isAttacking) {
	// 		c.fillStyle = 'green'
	// 		c.fillRect(
	// 			this.attackBox.position.x,
	// 			this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
	// 		)
	// 	}
	// }

	// Update the fighter's position and velocity
	update() {
		this.draw()
		this.animateFrames()

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