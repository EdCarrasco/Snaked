class Snake extends GameObject {
	constructor(x,y) {
		super("SNAKE","square",x,y,60);

		this.body = [];
		this.color = color(255);

		this.direction = 0;
		this.movespeed = 10;

		this.startingBody = 20;
		this.steps = 0;
		this.collisions = 0;

		this.maxhealth = 3;

		// Start the snake with some segments
		for (var i = 0; i < this.startingBody; i++) {
			this.body.push( new Segment(this, this.x, this.y) );
		}
	}

	grow() {
		if (this.body.length > 0) {
			var x = this.body[this.body.length-1].x;
			var y = this.body[this.body.length-1].y;
			this.body.push( new Segment(this,x,y) );
		} else {
			this.body.push( new Segment(this, this.x, this.y));
		}
	}

	shrink() {
		if (this.body.length >= 2) {
			this.body.pop();
		}
		else {
			// TODO: Kill this object
			this.body.pop();
		}
	}

	cut(index) {
		if (index >= this.body.length || index < 0) 
			return;

		var cutlength = this.body.length-index;
		this.body.splice(index,cutlength);
	}

	cut2(index,amount) {
		if (index >= this.body.length || index < 0) 
			return;

		var cutlength = (this.body.length-index < amount) ? this.body.length-index : amount;
		this.body.splice(index,cutlength);
	}

	display() {
		var colorStart_Green = color(50,150,0);
		var colorEnd_Green = color(25,50,0);

		var colorStart_Yellow = color(200,200,0);
		var colorEnd_Yellow = color(125,125,0);

		var colorStart_Red = color(250,50,0);
		var colorEnd_Red = color(150,50,0);

		var colorStart_Gray = color(80,70,50);
		var colorEnd_Gray = color(30,20,10);

		// For each segment, except the last one
		var len = this.body.length;
		for (var i = len-1; i >= 0; i--) {
			// Calculate the points where each of the curves are attached
			var x1control = (i-2 >= 0) ? this.body[i-2].x : (i-1 >= 0) ? this.body[i-1].x : this.body[i].x;
			var y1control = (i-2 >= 0) ? this.body[i-2].y : (i-1 >= 0) ? this.body[i-1].y : this.body[i].y;
			var xstart = (i-1 >= 0) ? this.body[i-1].x : this.body[i].x;
			var ystart = (i-1 >= 0) ? this.body[i-1].y : this.body[i].y;
			var xend = this.body[i].x;
			var yend = this.body[i].y;
			var x2control = (i+1 < len) ? this.body[i+1].x : this.body[i].x;
			var y2control = (i+1 < len) ? this.body[i+1].y : this.body[i].y;
			
			// Draw the outline of each segment
			push();
			noFill(); 
			var lineWidth = 50;
			stroke(0);
			strokeWeight(lineWidth+10);
			curve(x1control,y1control, xstart,ystart, xend,yend, x2control,y2control);

			// Draw each segment
			if (this.body[i].health >= this.maxhealth) {
				stroke(lerpColor(colorStart_Green,colorEnd_Green, i/len));	// Green (max health or more)
			} else if (this.body[i].health == 1) {
				stroke(lerpColor(colorStart_Red,colorEnd_Red, i/len));		// Red (health = 1)
			} else if (this.body[i].health <= 0) {
				stroke(lerpColor(colorStart_Gray,colorEnd_Gray, i/len));	// Gray (health = 0)
			} else {
				stroke(lerpColor(colorStart_Yellow,colorEnd_Yellow, i/len));// Yellow ( 1 < health < max)
			}
			strokeWeight(lineWidth);
			curve(x1control,y1control, xstart,ystart, xend,yend, x2control,y2control);
			pop();
		}
		
		// Display segments
		for (var i = this.body.length-1; i >= 0; i--) {
			this.body[i].display(i);
		}
	}

	displayDEBUG() {
		for (var i = this.body.length-1;  i >= 0; i--) {
			//this.body[i].displayDEBUG(i);
		}
	}

	update() {
		if (this.body.length > 0) {
			// Update the creature's position and target to that of the first segment
			this.x = this.body[0].x;
			this.y = this.body[0].y;
			this.x_target = this.body[0].x_target;
			this.y_target = this.body[0].y_target;
		}

		// Target has been reached. Make the next move...
		if (this.x === this.x_target && this.y === this.y_target) {

			this.direction = (this.playerControlled) ? this.direction : this.generateDirection();
			switch (this.direction) {
				case RIGHT_ARROW:
					this.updateTargets(this.x+this.size, this.y);
					break;
				case LEFT_ARROW:
					this.updateTargets(this.x-this.size, this.y);
					break;
				case UP_ARROW:
					this.updateTargets(this.x, this.y-this.size);
					break;
				case DOWN_ARROW:
					this.updateTargets(this.x, this.y+this.size);
					break;
			}
		}

		// Update the segments of this object
		for (var i = 0; i < this.body.length; i++) {
			this.body[i].update(i);
		}
	}

	generateDirection() {
		// Create an array of directions to choose from 
		// Some directions are more or less likely to be chosen
		var directions = [RIGHT_ARROW,LEFT_ARROW,UP_ARROW,DOWN_ARROW];
		directions.push(this.direction);
		var opposite;
			if (this.direction == RIGHT_ARROW) 		opposite = LEFT_ARROW;
			else if (this.direction == LEFT_ARROW) 	opposite = RIGHT_ARROW;
			else if (this.direction == UP_ARROW) 	opposite = DOWN_ARROW;
			else if (this.direction == DOWN_ARROW) 	opposite = UP_ARROW;
		directions.splice(directions.indexOf(opposite),1);

		// Return a random direction
		return random(directions);
	}

	updateTargets(x,y) {
		// Update segments
		if (this.body.length > 0) {
			for (var i = this.body.length-1; i > 0; i--) {
				this.body[i].x_target = this.body[i-1].x_target;
				this.body[i].y_target = this.body[i-1].y_target;
			}

			// Update the head
			this.body[0].x_target = x;
			this.body[0].y_target = y;
		}

		// Increase steps
		this.steps++;
	}

	collisionWith(obj) {
		if (obj.type === "FOOD") {
			this.collisions++;
		}
	}

	getSegment(index) {
		if (index >= 0 && index < this.body.length) {
			return this.body[index];
		}
		else if (index < 0) 				console.warn("ERROR: Player.getSegment() --- index < 0")
		else if (index >= this.body.length) console.warn("ERROR: Player.getSegment() --- index >= array length")
		else if (this.body.length <= 0) 	console.warn("ERROR: Player.getSegment() --- empty array");
		return null;
	}
}