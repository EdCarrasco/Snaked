function Player(x,y) {
	
	this.type = "PLAYER";
	this.body = [];

	this.x = x;
	this.y = y;
	this.color = color(255);

	this.size = 60;
	this.direction = 0;
	this.movesPerFrame = 5;
	this.movespeed = 20;

	this.startingBody = 2;
	this.steps = 0;
	this.collisions = 0;

	this.maxhealth = 3;

	this.setup = function() {
		for (var i = 0; i < this.startingBody; i++) {
			this.body.push( new Segment(this, this.x, this.y) );
		}
	}
	this.setup();

	this.grow = function() {
		if (this.body.length > 0) {
			var x = this.body[this.body.length-1].x;
			var y = this.body[this.body.length-1].y;
			this.body.push( new Segment(this,x,y) );
		} else {
			this.body.push( new Segment(this, this.x, this.y));
		}
	}

	this.shrink = function() {
		if (this.body.length >= 2) {
			this.body.pop();
		}
		else {
			// Kill this object
			this.body.pop();
		}
	}

	this.cut = function(index) {
		if (index >= this.body.length || index < 0) 
			return;

		var cutlength = this.body.length-index;
		this.body.splice(index,cutlength);
	}

	this.cut2 = function(index, amount) {
		if (index >= this.body.length || index < 0) 
			return;

		var cutlength = (this.body.length-index < amount) ? this.body.length-index : amount;
		this.body.splice(index,cutlength);
	}

	this.display = function() {
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
			var x1control = (i-2 >= 0) ? this.body[i-2].x : (i-1 >= 0) ? this.body[i-1].x : this.body[i].x;
			var y1control = (i-2 >= 0) ? this.body[i-2].y : (i-1 >= 0) ? this.body[i-1].y : this.body[i].y;
			var xstart = (i-1 >= 0) ? this.body[i-1].x : this.body[i].x;
			var ystart = (i-1 >= 0) ? this.body[i-1].y : this.body[i].y;
			var xend = this.body[i].x;
			var yend = this.body[i].y;
			var x2control = (i+1 < len) ? this.body[i+1].x : this.body[i].x;
			var y2control = (i+1 < len) ? this.body[i+1].y : this.body[i].y;
			
			push();
			
			// Draw the outline of the snake
			noFill(); 
			var lineWidth = 50;
			stroke(0);
			strokeWeight(lineWidth+10);
			curve(x1control,y1control, xstart,ystart, xend,yend, x2control,y2control);

			// Draw the inside of the snake
			
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
		
		for (var i = this.body.length-1; i >= 0; i--) {
			this.body[i].display(i);
		}
		
	} 

	this.displayDEBUG = function() {
		for (var i = this.body.length-1;  i >= 0; i--) {
			this.body[i].displayDEBUG(i);
		}

		fill(255);
		textSize(20);
		textAlign(LEFT,CENTER);
		text("Segments: " + this.body.length, 10,30);
	}

	this.update = function() {

		if (this.body.length > 0) {
			if (this.body[0].x === this.body[0].x_target && this.body[0].y === this.body[0].y_target) {
				if (this.direction === RIGHT_ARROW) {
					this.updateTargets(this.body[0].x+this.size, this.body[0].y);
				} 
				else if (this.direction === LEFT_ARROW) {
					this.updateTargets(this.body[0].x-this.size, this.body[0].y);
				} 
				else if (this.direction === UP_ARROW) {
					this.updateTargets(this.body[0].x, this.body[0].y-this.size);
				} 
				else if (this.direction === DOWN_ARROW) {
					this.updateTargets(this.body[0].x, this.body[0].y+this.size);
				}
			}
			// Move parts towards the head
			for (var i = 0; i < this.body.length; i++) {
				this.body[i].update(i);
			}

			// Update player info
			this.x = this.body[0].x;
			this.y = this.body[0].y;
		}
	}

	this.updateTargets = function(x,y) {
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

	this.collisionWith = function(obj) {
		if (obj.type === "FOOD") {
			this.collisions++;
		}
	}

	this.getSegment = function(index) {
		if (index >= 0 && index < this.body.length) {
			return this.body[index];
		}
		else if (index < 0) 				console.warn("ERROR: Player.getSegment() --- index < 0")
		else if (index >= this.body.length) console.warn("ERROR: Player.getSegment() --- index >= array length")
		else if (this.body.length <= 0) 	console.warn("ERROR: Player.getSegment() --- empty array");
		return null;
	}
	
}