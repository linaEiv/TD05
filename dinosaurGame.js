const canvas = document.getElementById('jump');
const context = canvas.getContext('2d');
document.body.style.display="flex";
document.body.style.justifyContent="center";
// Variables
let score;
let scoreText;
let highscore;
let highscoreText;
let dino;
let gravity;
let objects = [];
let speedGame;
let keyPress = {};
let gameOver = 1;

// Event Listeners
document.addEventListener('keydown', function (event) {
    keyPress[event.code] = true;
    // console.log(event.key)
  });
  document.addEventListener('keyup', function (event) {
    keyPress[event.code] = false;
  });
// dinosaur
function drawDino(x,y,width,height,color){
    return{
        x:x,
        y:y,
        w:width,
        h:height,
        c:color,

        dy:0,
        jumpUp:12,
        originHeightDino:height,
        ground:false,
        jumpTime:0,
        update:function(){
            //jump condition 
            if (keyPress['ArrowUp'] || keyPress['Space'] || keyPress['KeyW'] ) {
                this.jump();
            } else {
            this.jumpTime = 0;
            }
        
            if (keyPress['ArrowDown']||keyPress['KeyS']) {
            this.h = this.originHeightDino / 2;
            } else {
            this.h = this.originHeightDino;
            }
        
            this.y += this.dy;
        
            if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.ground = false;
            } else {
            this.dy = 0;
            this.ground = true;
            this.y = canvas.height - this.h;
            }
            this.draw();
        },
        jump:function(){
            if (this.ground && this.jumpTime == 0) {
                this.jumpTime = 1;
                this.dy = -this.jumpUp;
            } else if (this.jumpTime > 0 && this.jumpTime < 15) {
                this.jumpTime++;
                this.dy = -this.jumpUp - (this.jumpTime / 50);
            }
        },
        draw:function(){
            context.beginPath();
            context.fillStyle = this.c;
            context.fillRect(this.x, this.y, this.w, this.h);
            context.closePath();
        }
    }
}
function drawObjects(x,y,width,height,color){
    return{
        x:x,
        y:y,
        w:width,
        h:height,
        c:color,

        dx:-speedGame,
        update:function(){
            this.x += this.dx;
            this.draw();
            this.dx = -speedGame;
        },
        draw:function(){
            context.beginPath();
            context.fillStyle = this.c;
            context.fillRect(this.x, this.y, this.w, this.h);
            context.closePath();
        }
    }
}
function drawText(score,x,y,area,color,pixel){
    return{
        t:score,
        x:x,
        y:y,
        a:area,
        c:color,
        s:pixel,
        draw:function(){
            context.beginPath();
            context.fillStyle = this.c;
            context.font = this.s + "px sans-serif";
            context.textAlign = this.a;
            context.fillText(this.t, this.x, this.y);
            context.closePath();
        }
    }
}

//game condition for objects that spawn the location and size
function respawnObjects(){
    let sizeObject = randomRange(20, 70);
    let typeObject = randomRange(0, 1);
    let object = drawObjects(canvas.width + sizeObject, canvas.height - sizeObject, sizeObject, sizeObject, '#C24641');
  
    if (typeObject == 1) {
      object.y -= dino.originHeightDino - 10;
    }
    objects.push(object);
}

//random function in range
function randomRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
//running game
function startGame(){
    canvas.width = 800;
    canvas.height = 500;
    
    context.font = "20px sans-serif";
  
    speedGame = 3;
    gravity = 1;
  
    score = 0;
    highscore = 0;
    //use localStorage to store high score
    if (localStorage.getItem('highscore')) {
      highscore = localStorage.getItem('highscore');
    }
    //dino object
    dino = drawDino(25, 25, 25, 25, '#FF8040');
  
    scoreText = drawText("Score: " + score, 25, 25, "left", "white", "20");
    highscoreText = drawText("Highscore: " + highscore, canvas.width - 25, 25, "right", "white", "20");
    requestAnimationFrame(updateGame);
    
}
function drawBackground(color){
    context.beginPath();
    context.fillStyle=color;
    context.fillRect(0,0,canvas.width,canvas.height);
    context.closePath();
}
let initialRespawnTimer = 200;
let RespawnTimer = initialRespawnTimer;

//action of the game
function updateGame(){
    // requestAnimationFrame(updateGame);
    if(gameOver==1){
        requestAnimationFrame(updateGame)
    }
    context.clearRect(0, 0, canvas.width, canvas.height);  
    if(score<highscore){
        drawBackground("gray");
    }else if(score>highscore&&score<highscore+500){
        drawBackground("#283747");
    }else{
        drawBackground("#424949");
    }
    RespawnTimer--;
    if (RespawnTimer <= 0) {
      respawnObjects();
      console.log(objects);
      RespawnTimer = initialRespawnTimer - speedGame * 8;
      
      if (RespawnTimer < 60) {
        RespawnTimer = 60;
      }
    }
  
    // respawn object Enemies
    for (let i = 0; i < objects.length; i++) {
      let ob = objects[i];
  
      if (ob.x + ob.w < 0) {
        objects.splice(i, 1);
      }
      //set score to origin like 0,time and object
      if (isCollision(dino,ob)) {
        objects = [];
        // score = 0;
        RespawnTimer = initialRespawnTimer;
        speedGame = 3;

        window.localStorage.setItem('highscore', highscore);
        gameOver=0;
      }
  
      ob.update();
    }
  
    dino.update();
  
    score++;
    scoreText.t = "Score: " + score;
    scoreText.draw();
  
    if (score > highscore) {
      highscore = score;
      highscoreText.t = "Highscore: " + highscore;
    }
    
    highscoreText.draw();
    speedGame += 0.003;
}
//global collision for object and dino
//we can use that to any game which need collision
function isCollision(dino,ob){
    return (dino.x < ob.x + ob.w &&
    dino.x + dino.w > ob.x &&
    dino.y < ob.y + ob.h &&
    dino.y + dino.h > ob.y);
}
// startGame();
function makeGameOver(score){
    canvas.width = 800;
    canvas.height = 500;
    drawBackground("#FFC0CB");
    let game = drawText("Congratulation You got score:"+score+"!",canvas.width/2,150,"center","black","40");
    game.draw();
    let anothergame = drawText("Please Press Enter to replay the game",canvas.width/2,canvas.height/2,"center","black","35");
    anothergame.draw();
}
function beforeStartGame(){
    canvas.width = 800;
    canvas.height = 500;
    canvas.style.borderRadius="10px";
    drawBackground("#00FFFF");
    let welcome = drawText("Welcome to Jump Game",canvas.width/2,150,"center","black","40");
    welcome.draw();
    let startGame = drawText("Lets press Enter button to start game!",canvas.width/2,220,"center","black","38");
    startGame.draw();
    let note = drawText("**** NOTE! ****",canvas.width/2,320,"center","red","40");
    note.draw();
    let naruto = drawText("Instruction: Press W/Space/ArrowUp Jump and S/ArrowDown crouch down",canvas.width/2,450,"center","black","22");
    naruto.draw();
    let instruction=drawText("Press Enter only one Time or You will speed up your cube!",canvas.width/2,400,"center","black","25");
    instruction.draw();
}

//there is bugs in this game just press T only start game dont press while playing
//it is against the rule
function startEnd(){
   beforeStartGame();
   setTimeout(startEnd,100);
    if(keyPress['Enter']){
        gameOver=1;
        startGame();
    }
    if(gameOver==0){
        makeGameOver(score);
    }
}
startEnd();