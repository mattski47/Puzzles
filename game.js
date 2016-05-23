var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(750, 750);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
var gameContainer = new PIXI.Container();
var menuContainer = new PIXI.Container();
var playerContainer = new PIXI.Container();
var laserContainer = new PIXI.Container();
var onMenu = true;
var onGame = false;

//var instructionPage = new PIXI.Container();
//stage.addChild(instructionPage);

var gameOver = new PIXI.Text("Game Over.");

var score;
var misses;
var cont = true;
var left = false;
var right = false;
var currentMisses = new PIXI.Text("");
var currentScore = new PIXI.Text("");

//target for tween
var target = new PIXI.Sprite(PIXI.Texture.fromImage("laser1.png");

//main menu textures
var playTexture = PIXI.Texture.fromImage("planet5.png");
var menuBackTexture = PIXI.Texture.fromImage("spacebackground.png");

//main menu sprites
var playButton = new PIXI.Sprite(playTexture);
var menuBack = new PIXI.Sprite(menuBackTexture);

//game textures
var gameBackTexture = PIXI.Texture.fromImage("spacebackground.png");
var planetTexture = PIXI.Texture.fromImage("planet1.png");
var playerTexture1 = PIXI.Texture.fromImage("player1.png");
var playerTexture2 = PIXI.Texture.fromImage("player2.png");
var laser1 = PIXI.Texture.fromImage("laser2.png");
	
//game sprites
var gameBack = new PIXI.Sprite(gameBackTexture);
var planetSprite = new PIXI.Sprite(planetTexture);
var playerSprite1 = new PIXI.Sprite(playerTexture1);
var playerSprite2 = new PIXI.Sprite(playerTexture2);

var mainMenu = function () {
	stage.addChild(menuContainer);
	
	//place background
	menuBack.anchor.x = 0.5;
	menuBack.anchor.y = 0.5;
	menuBack.position.x = renderer.width/2;
	menuBack.position.y = renderer.height/2;
	
	//place play button
	playButton.anchor.x = 0.5;
	playButton.anchor.y = 0.5;
	playButton.position.x = renderer.width/2;
	playButton.position.y = renderer.height/2;
	
	menuContainer.addChild(menuBack);
	menuContainer.addChild(playButton);
	
	playButton.interactive = true;
	playButton.mousedown = function(mouseData) {
		onMenu = false;
		stage.removeChild(menuContainer);
		stage.addChild(gameContainer);
		currScene = new playGame();
	}
	
	onMenu = true;
}

var playGame = function() {
	//place background
	gameBack.anchor.x = 0.5;
	gameBack.anchor.y = 0.5;
	gameBack.position.x = renderer.width/2;
	gameBack.position.y = renderer.height/2;

	//place planet
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
	
	target.position.x = renderer.width/2;
	target.position.y = -100;
	
	playerContainer.position.x = renderer.width/2;
	playerContainer.position.y = renderer.height/2;
	
	gameContainer.addChild(gameBack);
	gameContainer.addChild(planetSprite);
	playerContainer.addChild(playerSprite1);
	playerContainer.addChild(target);
	gameContainer.addChild(playerContainer);
	gameContainer.addChild(laserContainer);
	
	onGame = true;
}

//move character while key is down
function move() {
	if (playGame.left) {
		playerContainer.rotation -= 0.05;
	}
	
	if (playGame.right) {
		playerContainer.rotation += 0.05;
	}
}

function playerShoot() {
	newLaser = new PIXI.Sprite("laser1");
	newLaser.position.x = player1.position.x;
	newLaser.position.y = player1.position.y;
	laserContainer.addChild(newLaser);
	moveLaser(newLaser);
}

function moveLaser(laser) {
	
}

//displays gameover message and removes other objects
function endGame() {
	gameOver.position.x = renderer.width/2;
	gameOver.position.y = renderer.height/2 - 15;
	gameOver.anchor.x = 0.5;
	gameOver.anchor.y = 0.5;
	gameContainer.addChild(gameOver);
	
	currentScore.position.x = renderer.width/2;
	currentScore.position.y = renderer.height/2 + 15;
	currentScore.anchor.x = 0.5;
	currentScore.anchor.y = 0.5;
	
	coins.removeChildren();
	gameContainer.removeChild(currentMisses);
	
	playerSprite.interactive = true;
	playerSprite.mousedown = function(mouseData) {
		onGame = false;
		stage.removeChild(gameContainer);
		stage.addChild(menuContainer);
		currScene = new mainMenu();
	}
}

//set direction to true when key is down
function keydownEventHandler(e) {
	e.preventDefault();
	if (onGame) {
		if (e.keyCode == 37 || e.keyCode == 65) { //rotate ccw
			playGame.left = true;
		}

		if (e.keyCode == 39 || e.keyCode == 68) { //rotate cw
			playGame.right = true;
		}
		
		if (e.keyCode == 87 || e.keyCode == 32) { //shoot
			playerContainer.addChild(playerSprite2);
		}
	}
}

//set direction to false when key is up
function keyupEventHandler(e) {
	if (onGame) {
		if (e.keyCode == 37 || e.keyCode == 65) {
			playGame.left = false;
		}
		
		if (e.keyCode == 39 || e.keyCode == 68) {
			playGame.right = false;
		}
		
		if (e.keyCode == 87 || e.keyCode == 32) {
			playerContainer.removeChild(playerSprite2);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	if (onGame) {
		move();
	}
	
	renderer.render(stage);
}

var currScene = new mainMenu();
animate();

document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);