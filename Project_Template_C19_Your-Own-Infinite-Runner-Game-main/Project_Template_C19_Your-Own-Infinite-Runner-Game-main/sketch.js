//variables 
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cat, cat_animation;
var ground, invisibleGround, groundImage;
var dog, dog_animation;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound, bgMusic


//preload
function preload(){
    cat_animation = loadAnimation("pusheen-cute-cat.gif");
    dog_animation = loadAnimation("doggo.gif");
    
    groundImage = loadImage("gardenbg.jpeg");
    
    obstacle1 = loadImage("bush 1.png");
    
    obstacle3 = loadImage("bush 3.png");
    
    
    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")
    
    jumpSound = loadSound("sound6.mp3")
    dieSound = loadSound("die.mp3")
    checkPointSound = loadSound("checkPoint.mp3")
    bgMusic = loadSound("bg_music.mp3")

}

//setup
function setup() {
    createCanvas(800, 360);
    bgMusic.loop()
    bgMusic.volume=0.1

    dog = createSprite(120,250,20,50);
    dog.addAnimation("animation", dog_animation);
    dog.depth=1
    dog.scale = 0.5;
    
    cat = createSprite(490,250,20,50);
    cat.addAnimation("lol",cat_animation)
    cat.scale=0.5;

    ground = createSprite(800,150,400,100);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
    ground.depth=-99999999999999
    
    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(300,140);
    restart.addImage(restartImg);
    
    
    gameOver.scale = 0.5;
    restart.scale = 0.5;
    restart.depth=100
    
    invisibleGround = createSprite(200,310,1000,10);
    invisibleGround.visible = false;

    obstaclesGroup = createGroup();

    dog.setCollider("rectangle",0,0,dog.width,dog.height);
    dog.debug = true

    cat.setCollider("rectangle",100,0,cat.width,dog.height);
    cat.debug = true

    
    
    score = 0;
}

//draw
function draw() {
    background(200);
    
    
    
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    //ground moving
    if (ground.x < 180){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& dog.y >= 100) {
        dog.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    dog.velocityY = dog.velocityY + 0.8
  
    //spawn obstacles on the ground
   spawnObstacles();
    
    if(obstaclesGroup.isTouching(dog)){
        gameState = END;
        dieSound.play()
    //}
  }
   else if (gameState === END) {
      gameOver.visible = true;
      gameOver.depth=100
      restart.depth=100
      restart.visible = true;

      ground.velocityX = 0;
      dog.velocityY = 0

      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);

   }
  
 
  //stop dog from falling down
  dog.collide(invisibleGround);
  cat.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }

  
  text("Score: "+ score, 10,350);

  }
  drawSprites();
}

//reset
function reset(){
    obstaclesGroup.destroyEach();
    score=0;
    gameState=PLAY;
}

//spawn bushes
function spawnObstacles(){
   if (frameCount % 60 === 0){
     var obstacle = createSprite(850,350,10,40);
     obstacle.velocityX = -(6 + score/200);
     
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle3);
                break;
        default: break;
      }
     
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.5/2;
  
      obstacle.lifetime = 300;
    
     //add each obstacle to the group
      obstaclesGroup.add(obstacle);
   }
}

  
