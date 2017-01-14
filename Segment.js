function Segment(owner,x,y) {
	this.owner = owner;
	this.x = x;
	this.y = y;
	this.x_target = x;
	this.y_target = y;
	this.size = 60;
	this.movesPerFrame = owner.movesPerFrame || 1;
	this.movespeed = owner.movespeed || 1;

	this.x_speed = 0;
	this.y_speed = 0;
	this.distance = 0;

	this.health = 3;

	this.display = function(index) {
		
	}

	this.displayDEBUG = function(index) {
		// Draw collision box
		/*
		stroke(0);
		if (index == 0) fill(255,200);
		else fill(200,100);
		rectMode(CENTER);
		rect(this.x,this.y,this.size,this.size);

		// Draw target

		var size = 0;
		if (index == 0) fill(255,0,0);
		else fill(0,255,0);
		noStroke();
		ellipseMode(CENTER);
		ellipse(this.x_target,this.y_target,10);
		*/

		// Draw the index
		push();
		stroke(0)
		strokeWeight(0)
		fill(255)
		textSize(20)
		text(index,this.x,this.y)
		pop();
	}

	this.update = function(index) {
		this.move_simple();
	}

	this.move_simple = function() {
		/*
		if (this.x < this.x_target) this.x++;
		else if (this.x > this.x_target) this.x--;

		if (this.y < this.y_target) this.y++;
		else if (this.y > this.y_target) this.y--;
		*/
		if (abs(this.x_target-this.x) <= this.movespeed)	this.x = this.x_target;
		else if (this.x < this.x_target)	this.x += this.movespeed;
		else if (this.x > this.x_target)	this.x -= this.movespeed;

		if (abs(this.y_target-this.y) <= this.movespeed)	this.y = this.y_target;
		else if (this.y < this.y_target)	this.y += this.movespeed;
		else if (this.y > this.y_target)	this.y -= this.movespeed;
	}

	this.move_staggered = function() {
		var distX = (this.x_target - this.x) * 0.2;
		this.x += (distX > 0) ? ceil(distX) : floor(distX);
		var distY = (this.y_target - this.y) * 0.2;
		this.y += (distY > 0) ? ceil(distY) : floor(distY);
	}

	this.move_proportional = function() {
		var distance = dist(this.x,this.y, this.x_target,this.y_target);

		// If the distance to the target is very small, just move it there
		if (distance <= this.movespeed) {
			this.x = this.x_target;
			this.y = this.y_target;
		}
		// Otherwise, divide the x and y distance by the slope
		else {
			var distX = this.x_target-this.x;
			var distY = this.y_target-this.y;

			this.x_speed = (distance != 0) ? this.movespeed*distX/distance : 0;
			this.y_speed = (distance != 0) ? this.movespeed*distY/distance : 0;

			this.x += this.x_speed;
			this.y += this.y_speed;
		}
	}
}