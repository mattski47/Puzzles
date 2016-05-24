var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(750, 750);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var gameContainer = new PIXI.Container();
var menuContainer = new PIXI.Container();
var endContainer = new PIXI.Container();
var playerContainer = new PIXI.Container();
var laserContainer = new PIXI.Container();
var rockContainer = new PIXI.Container();
var explosionContainer = new PIXI.Container();
var onGame = false;
var style = {fill: "white"};
var style2 = {font: '16px Arial', fill: "white", workWrap: true};
var scoreDisplay = new PIXI.Text("", style);
var creditsDisplay = new PIXI.Text("By: Matthew Siewierski", style);

var instructionsDisplay = new PIXI.Text("How to Play:\n Use the left and right arrow keys or the 'a' and 'd' keys to rotate around the planet.\n You can fire your lasers by pressing space or the 'w' key.\n\n Goal:\n Stop the rocks from hitting the planet by destroying them with your laser.\n The number of lasers that can be on the screen at once is limited so use your shots wisely.\n You lose when enough rocks hit the planet to destroy it.", style2);

var instructionsContainer = new PIXI.Container();

//background image
var background = new PIXI.Sprite(PIXI.Texture.fromImage("assets/spacebackground.png"));

//place background
background.anchor.x = 0.5;
background.anchor.y = 0.5;
background.position.x = renderer.width/2;
background.position.y = renderer.height/2;

stage.addChild(background);

//main menu sprites
var playButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/playButton.png"));
var instructionsButton = new PIXI.Sprite(PIXI.Texture.fromImage("assets/instructionsButton.png"));

var currPlanet;

//game sprites
var planetSprite;
var explosion;
var playerSprite1 = new PIXI.Sprite(PIXI.Texture.fromImage("assets/player1.png"));
var playerSprite2 = new PIXI.Sprite(PIXI.Texture.fromImage("assets/player2.png"));

//game target for tween
var target = new PIXI.Sprite(PIXI.Texture.fromImage("assets/laser1.png"));

//planet textures
var planets = [PIXI.Texture.fromImage("assets/planet1.png"), PIXI.Texture.fromImage("assets/planet2.png"), PIXI.Texture.fromImage("assets/planet3.png"), PIXI.Texture.fromImage("assets/planet4.png"), PIXI.Texture.fromImage("assets/planet5.png")];

//laser texture
var laserTexture = new PIXI.Texture.fromImage("assets/laser2.png");

//rock textures
var largeRocks = [PIXI.Texture.fromImage("assets/largerock1.png"), PIXI.Texture.fromImage("assets/largerock2.png"), PIXI.Texture.fromImage("assets/largerock3.png")];
var smallRocks = [PIXI.Texture.fromImage("assets/smallrock1.png"), PIXI.Texture.fromImage("assets/smallrock2.png"), PIXI.Texture.fromImage("assets/smallrock3.png"), PIXI.Texture.fromImage("assets/smallrock4.png"), PIXI.Texture.fromImage("assets/smallrock5.png")];

//impact texture
var impact = PIXI.Texture.fromImage("assets/collision.png");

//explosion texture
var explosions = [PIXI.Texture.fromImage("assets/explosion1.png"), PIXI.Texture.fromImage("assets/explosion2.png"), PIXI.Texture.fromImage("assets/explosion3.png"), PIXI.Texture.fromImage("assets/explosion4.png")];

var gameOver = new PIXI.Sprite(PIXI.Texture.fromImage("assets/gameOver.png"));

//return to menu sprite
var returnHome = new PIXI.Sprite(PIXI.Texture.fromImage("assets/mainMenuButton.png"));

//main menu
var mainMenu = function () {
	creditsDisplay.anchor.x = 0.5;
	creditsDisplay.anchor.y = 0.5;
	creditsDisplay.position.x = renderer.width/2;
	creditsDisplay.position.y = renderer.height-25;
	
	//place play button
	playButton.anchor.x = 0.5;
	playButton.anchor.y = 0.5;
	playButton.position.x = renderer.width/2;
	playButton.position.y = renderer.height/2;
	
	instructionsButton.anchor.x = 0.5;
	instructionsButton.anchor.y = 0.5;
	instructionsButton.position.x = renderer.width/2;
	instructionsButton.position.y = renderer.height/2+100;
	
	playerSprite1.anchor.x = 0.5;
	playerSprite1.anchor.y = 0.5;
	playerSprite1.position.x = renderer.width/2;
	playerSprite1.position.y = renderer.height/2+230;
	
	menuContainer.addChild(playButton);
	menuContainer.addChild(instructionsButton);
	menuContainer.addChild(creditsDisplay);
	menuContainer.addChild(playerSprite1);
	
	playButton.interactive = true;
	instructionsButton.interactive = true;
	
	stage.addChild(menuContainer);
	
	playButton.mousedown = function(mouseData) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(gameContainer);
		currScene = new playGame();
	}
	
	instructionsButton.mousedown = function(mousedata) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(instructionsContainer);
		currScene = new instructionsPage();
	}
}

//play game
var playGame = function() {
	this.left = false;
	this.right = false;
	this.currPlanet = 0;
	this.score = 0;

	//place planet
	planetSprite = new PIXI.Sprite(planets[this.currPlanet++]);
	
	planetSprite.anchor.x = 0.5;
	planetSprite.anchor.y = 0.5;
	planetSprite.position.x = renderer.width/2;
	planetSprite.position.y = renderer.height/2;
	
	//place player
	playerSprite1.anchor.x = 0.5;
	playerSprite1.anchor.y = 0.5;
	playerSprite1.position.x = 0;
	playerSprite1.position.y = -100;
	
	//place player shooting
	playerSprite2.anchor.x = 0.5;
	playerSprite2.anchor.y = 0.5;
	playerSprite2.position.x = 0;
	playerSprite2.position.y = -113;
	
	target.anchor.x = 0.5;
	target.anchor.y = 0.5;
	target.position.x = 0;
	target.position.y = -2000;
	
	scoreDisplay.text = "Score: " + this.score;
	scoreDisplay.position.x = 0;
	scoreDisplay.position.y = 0;
	
	playerContainer.position.x = renderer.width/2;
	playerContainer.position.y = renderer.height/2;
	
	gameContainer.addChild(scoreDisplay);
	gameContainer.addChild(planetSprite);
	playerContainer.addChild(playerSprite1);
	playerContainer.addChild(target);
	gameContainer.addChild(playerContainer);
	gameContainer.addChild(rockContainer);
	gameContainer.addChild(laserContainer);
	gameContainer.addChild(explosionContainer);
	
	onGame = true;
}

//move character while key is down
playGame.prototype.move = function() {
	if (this.left) {
		playerContainer.rotation -= 0.05;
	}
	
	if (this.right) {
		playerContainer.rotation += 0.05;
	}
}

//randomly spawn rocks
playGame.prototype.spawnRock = function() {
	if (Math.random() > 0.992) {
		if (Math.round(Math.random())) {
			newRock = new PIXI.Sprite(largeRocks[Math.floor(Math.random()*largeRocks.length)]);
		} else {
			newRock = new PIXI.Sprite(smallRocks[Math.floor(Math.random()*smallRocks.length)]);
		}
		
		if (Math.round(Math.random())) {
			if (Math.round(Math.random())) {
				newRock.position.x = -7;
			} else {
				newRock.position.x = renderer.width+7;
			}
			
			newRock.position.y = Math.random()*(renderer.height+14)-7;
		} else {
			newRock.position.x = Math.random()*(renderer.width+14)-7;
			
			if (Math.round(Math.random())) {
				newRock.position.y = -7;
			} else {
				newRock.position.y = renderer.height+7;
			}
		}
		
		newRock.anchor.x = 0.5;
		newRock.anchor.y = 0.5;
		rockContainer.addChild(newRock);
		
		createjs.Tween.get(newRock.position).to(gameContainer.toGlobal(planetSprite.position), 2000+(Math.random())*10000);
	}
}

//check if rocks hit something
playGame.prototype.checkRocks = function() {
	var rocks = rockContainer.children;
	var lasers = laserContainer.children;
	var rock;
	
	for (var i=0; i<rocks.length; i++) {
		rock = rocks[i];
		rock.rotation += 0.01;
		for (var j=0; j<lasers.length; j++) {
			if (Math.abs(gameContainer.toGlobal(rock.position).x-gameContainer.toGlobal(lasers[j].position).x) <= rock.width/2+lasers[j].width/2 && Math.abs(gameContainer.toGlobal(rock.position).y-gameContainer.toGlobal(lasers[j].position).y) <= rock.height/2+lasers[j].height/2) {
				rockContainer.removeChild(rock);
				laserContainer.removeChild(lasers[j]);
				this.score++;
				scoreDisplay.text = "Score: " + this.score;
			}
		}
		
		if (rock.parent && Math.abs(gameContainer.toGlobal(rock.position).x-gameContainer.toGlobal(planetSprite.position).x) <= rock.width/2+planetSprite.width/3 && Math.abs(gameContainer.toGlobal(rock.position).y-gameContainer.toGlobal(planetSprite.position).y) <= rock.height/2+planetSprite.height/3) {
			explosion = new PIXI.Sprite(impact);
			explosion.anchor.x = 0.5;
			explosion.anchor.y = 0.5;
			
			explosion.position = gameContainer.toGlobal(rock.position);
			rockContainer.removeChild(rock);
			gameContainer.removeChild(planetSprite);
			planetSprite = new PIXI.Sprite(planets[this.currPlanet++]);
			planetSprite.anchor.x = 0.5;
			planetSprite.anchor.y = 0.5;
			planetSprite.position.x = renderer.width/2;
			planetSprite.position.y = renderer.height/2;
			gameContainer.addChild(planetSprite);
			explosionContainer.addChild(explosion);
			gameContainer.swapChildren(explosionContainer, planetSprite);
			setTimeout(function(toRemove) {if (toRemove.parent) {explosionContainer.removeChild(toRemove)}}, 2000, explosion);
		}
	}
}

//check if lasers left screen
playGame.prototype.checkLasers = function() {
	var lasers = laserContainer.children;
	
	for (var i=0; i<lasers.length; i++) {
		if (lasers[i].toGlobal(gameContainer.position).x < -5 || lasers[i].toGlobal(gameContainer.position).x > renderer.width+5 || lasers[i].toGlobal(gameContainer.position).y < -5 || lasers[i].toGlobal(gameContainer.position).y > renderer.height+5) {
			laserContainer.removeChild(lasers[i]);
		}
	}
}

//create lasers when needed (max. 10)
playGame.prototype.playerShoot = function() {
	if (laserContainer.children.length < 10) {
		newLaser = new PIXI.Sprite(laserTexture);
		newLaser.anchor.x = 0.5;
		newLaser.anchor.y = 0.5;
		newLaser.position = playerSprite1.toGlobal(gameContainer.position);
		newLaser.rotation = playerContainer.rotation;
		laserContainer.addChild(newLaser);
		createjs.Tween.get(newLaser.position).to(target.toGlobal(gameContainer.position), 10000);
	}
}

//displays gameover message and removes other objects
playGame.prototype.endGame = function() {
	rockContainer.removeChildren();
	laserContainer.removeChildren();
	this.blowUpPlanet();
	
	onGame = false;
	setTimeout(function() {currScene = new endScreen}, 5000);
}

//blows up planet
playGame.prototype.blowUpPlanet = function() {
	setTimeout(explFunc, 0, 0);
	setTimeout(explFunc, 1000, 1);
	setTimeout(explFunc, 2000, 2);
	setTimeout(explFunc, 3000, 3);
	
	function explFunc(explNum) {
		explosion = new PIXI.Sprite(explosions[explNum]);
		explosion.anchor.x = 0.5;
		explosion.anchor.y = 0.5;
		explosion.position.x = renderer.width/2;
		explosion.position.y = renderer.height/2;
		explosionContainer.addChild(explosion);
	}
}

var endScreen = function() {
	returnHome.anchor.x = 0.5;
	returnHome.anchor.y = 0.5;
	returnHome.position.x = renderer.width/2;
	returnHome.position.y = renderer.height/2 + 200;
	
	gameOver.anchor.x = 0.5;
	gameOver.anchor.y = 0.5;
	gameOver.position.x = renderer.width/2;
	gameOver.position.y = renderer.height/2 - 200;
	
	explosionContainer.removeChildren();
	gameContainer.removeChildren();
	endContainer.addChild(planetSprite);
	endContainer.addChild(scoreDisplay);
	endContainer.addChild(returnHome);
	endContainer.addChild(gameOver);
	
	stage.removeChild(gameContainer);
	stage.addChild(endContainer);
	
	returnHome.interactive = true;
	returnHome.mousedown = function(mouseData) {
		stage.removeChild(endContainer);
		stage.addChild(menuContainer);
		currScene = new mainMenu();
	}
}

var instructionsPage = function() {
	instructionsDisplay.position.x = 10;
	instructionsDisplay.position.y = 10;
	
	planetSprite = new PIXI.Sprite(planets[0]);
	
	planetSprite.anchor.x = 0.5;
	planetSprite.anchor.y = 0.5;
	planetSprite.position.x = renderer.width/2;
	planetSprite.position.y = renderer.height/2;
	
	playerSprite1.anchor.x = 0.5;
	playerSprite1.anchor.y = 0.5;
	playerSprite1.position.x = renderer.width/2;
	playerSprite1.position.y = renderer.height/2-100;
	
	returnHome.anchor.x = 0.5;
	returnHome.anchor.y = 0.5;
	returnHome.position.x = renderer.width/2;
	returnHome.position.y = renderer.height/2 + 200;
	
	returnHome.interactive = true;
	returnHome.mousedown = function(mouseData) {
		instructionsContainer.removeChildren();
		stage.removeChild(instructionsContainer);
		stage.addChild(menuContainer);
		currScene = new mainMenu();
	}
	
	instructionsContainer.addChild(planetSprite);
	instructionsContainer.addChild(playerSprite1);
	instructionsContainer.addChild(returnHome);
	instructionsContainer.addChild(instructionsDisplay);
}

//set direction to true when key is down
function keydownEventHandler(e) {
	e.preventDefault();
	if (onGame) {
		if (e.keyCode == 37 || e.keyCode == 65) { //rotate ccw
			currScene.left = true;
		}

		if (e.keyCode == 39 || e.keyCode == 68) { //rotate cw
			currScene.right = true;
		}
		
		if (e.keyCode == 87 || e.keyCode == 32) { //shoot
			playerContainer.addChild(playerSprite2);
			currScene.playerShoot();
		}
	}
}

//set direction to false when key is up
function keyupEventHandler(e) {
	if (onGame) {
		if (e.keyCode == 37 || e.keyCode == 65) {
			currScene.left = false;
		}
		
		if (e.keyCode == 39 || e.keyCode == 68) {
			currScene.right = false;
		}
		
		if (e.keyCode == 87 || e.keyCode == 32) {
			playerContainer.removeChild(playerSprite2);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	if (onGame) {
		if (currScene.currPlanet < 5) {
			currScene.move();
			currScene.checkRocks();
			currScene.checkLasers();
			currScene.spawnRock();
		} else {
			currScene.endGame();
		}
	}
	
	renderer.render(stage);
}

var currScene = new mainMenu();
animate();

document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);