class GameObject {
	constructor(type,shape,x,y,size) {
		this.type = type || "GAMEOBJECT";
		this.shape = shape || "square"; // square | circle
		this.x = x || width/2;
		this.y = y || height/2;
		this.size = size || 50;
		this.x_target = this.x;
		this.y_target = this.y;
		this.playerControlled = false;
	}

	update() {
	}

	display() {
		push();
		fill(255);
		noStroke();
		rectMode(CENTER);
		rect(this.x,this.y,this.size,this.size);
		pop();
	}

	displayDEBUG() {
	}

	collisionWith(obj) {
	}

	move_simple(multiplier) {
		if (abs(this.x_target-this.x) <= 1*multiplier)	this.x = this.x_target;
		else if (this.x < this.x_target)				this.x += multiplier;
		else if (this.x > this.x_target)				this.x -= multiplier;

		if (abs(this.y_target-this.y) <= 1*multiplier)	this.y = this.y_target;
		else if (this.y < this.y_target)				this.y += multiplier;
		else if (this.y > this.y_target)				this.y -= multiplier;
	}

	move_proportional(multiplier) {
		// If the distance to the target is very small, just move it there
		var distance = dist(this.x,this.y, this.x_target,this.y_target);
		if (distance <= 1*multiplier) {
			this.x = this.x_target;
			this.y = this.y_target;
		}
		// Otherwise, divide the x and y distance by the slope
		else {
			this.x += (distance != 0) ? ((this.x_target-this.x)/distance)*multiplier : 0;
			this.y += (distance != 0) ? ((this.y_target-this.y)/distance)*multiplier : 0;
		}
	}
}

//****************************************************

class Cursor extends GameObject {
	constructor() {
		super("CURSOR", "circle", mouseX, mouseY, 10);
	}

	update() {
		this.x = mouseX;
		this.y = mouseY;
	}

	display() {
	}
}

//******************************************************

class Grid {
	constructor(rows,cols) {
		this.x = 0;
		this.y = 0;
		this.margin = 0;
		this.size = this.determineSize(rows,cols);
		this.offset = this.margin + this.size/2;
		this.array = [];

		for (var row = 0; row < rows; row++) {
			var rowArray = [];
			for (var col = 0; col < cols; col++) {
				var x = floor(this.x + row*this.size + this.offset);
				var y = floor(this.y + col*this.size + this.offset);
				rowArray.push(new p5.Vector(x,y));
			}
			this.array.push(rowArray);

		}
		console.log(this.size)
	}

	determineSize(rows,cols) {
		
		var biggerGrid = (rows >= cols) ? rows : cols;
		var smaller = (rows <= cols) ? rows : cols;
		var biggerDimension = (width >= height) ? width : height;
		//console.log(biggerDimension);

		var scale = biggerDimension/biggerGrid;


		if (width >= height) {
			if (rows >= cols)	scale = height/biggerGrid;
			else 				scale = height/biggerGrid;
		}
		else {
			if (rows >= cols)	scale = width/biggerGrid;
			else 				scale = width/biggerGrid;
		}
		/*
		if (rows >= cols) {
			if (width >= height) scale = height/rows;
			else 				 scale = width/rows;

			//this.margin = scale%10;
			//scale -= this.margin;
			//this.margin = this.margin*rows/2;
		}
		else {
			if (width >= height) scale = height/cols;
			else 				 scale = width/cols;

			//this.margin = scale%10;
			//scale -= this.margin;
			//console.log(scale)
			//this.margin = this.margin*cols/2;
		}
		*/
		console.log(biggerDimension + "  " + scale)
		return scale;
	}

	update() {
		for (var row = 0; row < this.array.length; row++) {
			for (var col = 0; col < this.array[row].length; col++) {
				this.drawCell(this.array[row][col]);
			}
		}
	}

	drawCell(vector) {
		push();
		// Draw a rectangle
		fill(255,0,0,100);
		stroke(0)
		strokeWeight(2);
		var x = vector.x - this.offset + this.margin;
		var y = vector.y - this.offset + this.margin;
		rect(x,y,this.size,this.size);

		// Draw the exact coordinates
		point(vector.x,vector.y);
		pop();
	}
}