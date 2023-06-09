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
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = { offset: {}, width: undefined, height: undefined }
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
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		}
		this.isAttacking
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.sprites = sprites;		// this Object contain all sprite animations
		this.dead = false;

		for (const sprite in this.sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc;
		}
	}

	// Update the fighter's position and velocity
	update() {
		this.draw()
		if (!this.dead) this.animateFrames()

		// Update the position of the attack box based on the position of the main object
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    // Draw the attack box
    // c.fillRect(
    // 	this.attackBox.position.x, 
    // 	this.attackBox.position.y, 
    // 	this.attackBox.width, 
    // 	this.attackBox.height
    // )

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
			this.position.y = 330		// Ground Height
		} else {
			this.velocity.y += gravity
		}
	}

	// Attack action of the character
	attack() {
		this.switchSprite('attack2')
		this.isAttacking = true
	}

	takeHit() {
		this.health -= 20

		if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
	}

	// Switching between our different sprites
	switchSprite(sprite) {
		// Override when fighter dead
		if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

		// Overriding all other animations with the attack animation
		if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return

    // Override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

		switch (sprite) {
		case 'idle':
			if (this.image != this.sprites.idle.image) {
				this.image = this.sprites.idle.image
				this.framesMax = this.sprites.idle.framesMax
				
				// Resets the current framto 0 whenever the sprite is changed
				// ensuring that the animation starts from the beginning each time
				this.framesCurrent = 0 	
			}
			break
		case 'run':
			if (this.image != this.sprites.run.image) {
				this.image = this.sprites.run.image
				this.framesMax = this.sprites.run.framesMax
				this.framesCurrent = 0
			}
			break
		case 'jump':
			if (this.image != this.sprites.jump.image) {
				this.image = this.sprites.jump.image
				this.framesMax = this.sprites.jump.framesMax
				this.framesCurrent = 0
			}
			break
		case 'fall':
			if (this.image != this.sprites.fall.image) {
				this.image = this.sprites.fall.image
				this.framesMax = this.sprites.fall.framesMax
				this.framesCurrent = 0
			}
			break
		case 'attack1':
			if (this.image != this.sprites.attack1.image) {
				this.image = this.sprites.attack1.image
				this.framesMax = this.sprites.attack1.framesMax
				this.framesCurrent = 0
			}
			break
		case 'attack2':
			if (this.image != this.sprites.attack2.image) {
				this.image = this.sprites.attack2.image
				this.framesMax = this.sprites.attack2.framesMax
				this.framesCurrent = 0
			}
			break
		case 'takeHit': 
			if (this.image !== this.sprites.takeHit.image) {
        this.image = this.sprites.takeHit.image
        this.framesMax = this.sprites.takeHit.framesMax
        this.framesCurrent = 0
      }
      break
	 	case 'death':
      if (this.image !== this.sprites.death.image) {
        this.image = this.sprites.death.image
        this.framesMax = this.sprites.death.framesMax
        this.framesCurrent = 0
      }
      break
		}
	}
}
