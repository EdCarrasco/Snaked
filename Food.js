class Food extends GameObject {
	constructor(x,y) {
		super("FOOD", "square", x,y, 30);
		this.color = color(215,175,125);
		this.angle = 0;
		this.angular_speed = 0.005;

		this.owner;
		this.isInside = false;
		this.insideIndex = -1;
		this.isUsed = false;
		this.decayTimer = 0;
	}

	display() {
		// Handle the rocking motion of the object
		push();
		var yoffset = this.size/2;
		translate(this.x,this.y+yoffset);
		if (this.angle >= 0.2 || this.angle <= -0.2) this.angular_speed *= -1;
		if (!gamePaused) this.angle += this.angular_speed;
		rotate(this.angle);

		// Draw the object
		fill(this.color);
		stroke(0)
		strokeWeight(5);
		ellipseMode(CENTER);
		ellipse(0,-yoffset, this.size*0.7,this.size*1.0);
		//ellipse(this.x,this.y, this.size*0.7,this.size*1.0); // use this when not using translate()
		pop();

		
	}

	displayDEBUG() {
		/*
		// Draw the collision box
		push();
		fill(255,0,255,100);
		rectMode(CENTER);
		rect(this.x,this.y,this.size,this.size);
		pop();
		*/

		// Draw a line pointing to the target
		if (this.x != this.x_target || this.y != this.y_target) {
			push()
			stroke(255)
			strokeWeight(2)
			line(this.x,this.y, this.x_target,this.y_target);
			pop()
		}

		/*
		// Display the index inside the object that ate it
		push();
		fill(0,0,255);
		textAlign(CENTER,CENTER);
		textSize(20);
		text(this.insideIndex,this.x,this.y);
		pop();
		*/
	}

	update() {
		// Movement
		if (this.owner) this.movespeed = this.owner.movespeed;
		this.move_proportional(this.movespeed*1.2);

		if (this.owner && this.x === this.x_target && this.y === this.y_target) {
			this.insideIndex++;
		}

		if (this.owner && this.owner.body.length > 0) {
			// Determine the next segment to move towards
			var next_segment;
			if (this.insideIndex < this.owner.body.length-1) 
				next_segment = this.owner.body[this.insideIndex+1];
			else if (this.insideIndex >= this.owner.body.length-1) 
				next_segment = this.owner.body[this.owner.body.length-1];

			this.x_target = next_segment.x;
			this.y_target = next_segment.y;

			

			if (this.insideIndex >= 0 && this.insideIndex < this.owner.body.length) {
				var segment = this.owner.body[this.insideIndex];
				if (segment.health < this.owner.maxhealth) {
					segment.health++;
					this.consumed();
					this.color = color(0,0,255);
				}
			}
			else if (this.insideIndex >= this.owner.body.length) {
				this.owner.grow();
				this.color = color(0);
				this.consumed();
			}
		}

		// If inside an object and has reached the target segment, move onto the next segment
		

		// If the food was eaten and then exited the object
		if (this.isUsed) {
			this.decayTimer++; 
			if (this.decayTimer >= 0) {
				gameObjects.remove(this);
			}
		}
	}

	eaten(obj) {
		this.isInside = true;
		this.insideIndex = -1;
		this.owner = obj;
		this.x_target = this.owner.x;
		this.y_target = this.owner.y;
	}

	consumed() {
		// Set some values to their default
		this.owner = undefined;
		this.insideIndex = -1;
		// After being eaten, it is permanently altered
		this.isUsed = true;
	}

	collisionWith(obj) {
		// Determine the object type
		if (obj.type === "PLAYER" || obj.type === "SNAKE") {
			if (!this.isInside) {
				this.eaten(obj);
			}
		}
		else if (obj.type === "CURSOR") {
			var players = gameObjects.getObjectsByType("PLAYER");

			if (!this.isInside) {
				this.eaten(player);
			}
		}
	}
}