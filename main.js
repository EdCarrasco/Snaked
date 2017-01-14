var gameObjects;
var gamePaused;
var gameTime;
var cursor;
var grid;

var player;

function setup() {
	// Game essentials ******************************
	createCanvas(windowWidth*0.95,windowHeight*0.95);
	gameObjects = new GameObjectsHandler();
	//grid = new Grid(10,3);
	// **********************************************
	
	gamePaused = false;
	gameTime = 0;

	//gameObjects.add( new Player(width/2,height/2) );	
	gameObjects.add( new Cursor() );

	player = new Snake(width/4,height/4)
	player.playerControlled = true;
	gameObjects.add( player );

	gameObjects.add( new Snake(width/2, width/2) )
}

function draw() {
	var t0 = performance.now();
	background(210);

 	gameObjects.update();
 	gameTime++;
	gameObjects.display();
	gameObjects.displayDEBUG();
	
	// Create Food objects from time to time
	var len = gameObjects.length();
	if (gameTime%(len*len)==0) {
		gameObjects.add( new Food(random(width),random(height)) );
	}

	//console.log("Performance: "+floor(performance.now()-t0)+" ms")
	//grid.update();

	//console.log(mouseX)
}

function keyPressed() {
	// Arrow/WASD keys: Change direction of players
	if (keyCode === RIGHT_ARROW || keyCode === 68)		{ player.direction = RIGHT_ARROW; } 
	else if (keyCode === LEFT_ARROW || keyCode === 65)	{ player.direction = LEFT_ARROW; } 
	else if (keyCode === UP_ARROW || keyCode === 87) 	{ player.direction = UP_ARROW; } 
	else if (keyCode === DOWN_ARROW || keyCode === 83) 	{ player.direction = DOWN_ARROW; } 
	else if (keyCode === 69) 							{ player.direction = 0; }

	var players = gameObjects.getObjectsByType("PLAYER");
	for (var i = 0; i < players.length; i++) {
		if (keyCode === RIGHT_ARROW || keyCode === 68)		{ players[i].direction = RIGHT_ARROW; } 
		else if (keyCode === LEFT_ARROW || keyCode === 65)	{ players[i].direction = LEFT_ARROW; } 
		else if (keyCode === UP_ARROW || keyCode === 87) 	{ players[i].direction = UP_ARROW; } 
		else if (keyCode === DOWN_ARROW || keyCode === 83) 	{ players[i].direction = DOWN_ARROW; } 
		else if (keyCode === 69) 							{ players[i].direction = 0; }
	}

	// Space bar: Pause/resume the game
	if (keyCode === 32) {
		gamePaused = !gamePaused;
	}

	if (gamePaused) frameRate(1)
	else frameRate(30);
}

function mousePressed() {
	var players = gameObjects.getObjectsByType("PLAYER");
	for (var i = 0; i < players.length; i++) {
		//var index = floor(random(players[i].body.length));
		//players[i].body[index].health--;
		if (mouseButton == LEFT) {
			players[i].cut(1);
		}
		if (mouseButton == CENTER) {
			players[i].grow();
		}
	}
}