

// reusable objects

class Planet {
  constructor(game){
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height * 0.5;
    this.radius = 80;
    this.image = document.getElementById('planet');
  }
  draw(context){
    context.drawImage(this.image, this.x - 100, this.y - 100);
    if (this.game.debug){
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }
}

class Player {
  constructor(game){
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height * 0.5;
    this.radius = 40;
    this.image = document.getElementById('player');
    this.aim;
    this.angle = 0;
    
  }
  draw(context){
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(this.image, - this.radius,  - this.radius);
    if (this.game.debug){
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
    context.restore();
  }
  update(){
    this.aim = this.game.calcAim( this.game.planet, this.game.mouse);
    this.x = this.game.planet.x + (this.game.planet.radius + this.radius) * this.aim[0];
    this.y = this.game.planet.y + (this.game.planet.radius + this.radius) * this.aim[1];
    this.angle = Math.atan2(this.aim[3], this.aim[2]);
  }
  shoot(){
    const projectile = this.game.getProgectile();
    if(projectile) projectile.start(this.x + this.radius * this.aim[0], this.y + this.radius * this.aim[1], this.aim[0], this.aim[1]);
  }
}


// pull of reusable objects
class Projectile {
  constructor(game){
    this.game = game;
    this.x;
    this.y;
    this.radius = 5;
    this.speedX = 1;
    this.speedY = 1;
    this.speedModifier = 10;
    this.free = true;


  }
  start(x, y, speedX, speedY){
    this.free = false;
    this.x = x;
    this.y = y;
    this.speedX = speedX * this.speedModifier;
    this.speedY = speedY * this.speedModifier;

  }
  reset(){
    this.free = true;
  }
  draw(context){
    if (!this.free){
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = 'gold';
      context.fill();
      context.restore();
    }
  }
  update(){
    if(!this.free){
      this.x += this.speedX;
      this.y += this.speedY;
    }

  // reset outside visible game area
    if(this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height){
      this.reset();
    }
  }
}

class Enemy {
  constructor(game){
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.radius = 40;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
    this.collided = false;
    this.free = true;
  }
  start(){
    this.free = false;
    this.collided = false;
    this.frameX = 0;
    this.lives = this.maxLives;
    this.frameY = Math.floor(Math.random() * 4);
    if (Math.random() < 0.5) {
        this.x = Math.random() * this.game.width;
        this.y = Math.random() < 0.5 ? -this.radius : this.game.height + this.radius;
    } else {
      this.x = Math.random() < 0.5 ? -this.radius : this.game.width + this.radius;
      this.y = Math.random() * this.game.height;
    }
    const aim = this.game.calcAim(this, this.game.planet);
    this.speedX = aim[0];
    this.speedY = aim[1];
    this.angle = Math.atan2(aim[3], aim[2]) + Math.PI * 0.5;
  }
  reset(){
    this.free = true;
  }

  hit(damage){
    this.lives -= damage;
    if (this.lives >= 1) this.frameX++;
  }
  draw(context){
    if (!this.free){
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,  - this.radius,  - this.radius, this.width, this.height);
      if (this.game.debug){
      context.beginPath();
      context.arc( this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
      context.fillText(this.lives, 0, 0);
      }
      context.restore();
    }
  }
  update(){
    if  (!this.free){
        this.x += this.speedX;
        this.y += this.speedY;

      if (this.game.checkCollision(this, this.game.planet)){
        this.lives = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.collided = true;
      }
      if (this.game.checkCollision(this, this.game.player)){
        this.lives = 0;
        this.collided = true;
      }
      this.game.projectilePool.forEach(projectile => {
        if (!projectile.free && this.game.checkCollision(this, projectile) && this.lives >= 1){
          projectile.reset();
          this.hit(1);
        }
      });

      if (this.lives < 1 && this.game.spriteUpdate ){
        this.frameX++;
      }
      if (this.frameX > this.maxFrame){
        this.reset();
        if(!this.collided) this.game.score += this.maxLives;
      } 
      
    }
  }
}

class Asteroid extends Enemy {
  constructor(game){
    super(game);
    this.image = document.getElementById('asteroid');
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 7;
    this.lives = 1;
    this.maxLives = this.lives;
  }
}
class Lobstermorph extends Enemy {
  constructor(game){
    super(game);
    this.image = document.getElementById('lobstermorph');
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 14;
    this.lives = 2;
    this.maxLives = this.lives;
  }
}

// the playground 
class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.planet = new Planet(this);
    this.player = new Player(this);
    this.debug = true;

    this.projectilePool = [];
    this.numberOfProjectiles = 20;
    this.createProjectilePool();

    this.enemyPool = [];
    this.numberOfEnemies = 20;
    this.createEnemyPool();
    this.enemyPool[0].start();
    this.enemyTimer = 0;
    this.enemyInterval = 1700;

    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 50;

    this.score = 0;
    this.winningScore = 10;


    this.mouse = {
      x: 0,
      y: 0
    }

    window.addEventListener('mousemove', e => {
      // this.mouse.x = e.x;
      // this.mouse.y = e.y;
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });

    window.addEventListener('mousedown', e => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.player.shoot();
    });
    window.addEventListener('keyup', e => {
      if( e.key === 'd') this.debug = !this.debug;
      else if( e.key === 'f') this.player.shoot();
    });
  }
  render(context, deltaTime){
    this.planet.draw(context);
    this.drawStatusText(context);
    this.player.draw(context);
    this.player.update();


    this.projectilePool.forEach(projectile => {
      projectile.draw(context);
      projectile.update();
    });

    this.enemyPool.forEach(enemy => {
      enemy.draw(context);
      enemy.update();
    });

    if (this.enemyTimer < this.enemyInterval){
        this.enemyTimer += deltaTime;
    } else {
      this.enemyTimer = 0;
      const enemy = this.getEnemy();
      if(enemy) enemy.start();
    }


    if (this.spriteTimer < this.spriteInterval){
        this.spriteTimer += deltaTime;
        this.spriteUpdate = false;
    } else {
      this.spriteTimer = 0;
      this.spriteUpdate = true;
    }
    // win or lose
    if (this.score >= this.winningScore){
      this.gameOver = true;
    }

  } 

  drawStatusText(context){
    context.save();
    context.textAligh = 'left';
    context.font = '30px Impact';
    context.fillText('Score:' + this.score, 20, 30);
    context.restore();
    if (this.gameOver){
      context.textAligh = 'center';
      let message1;
      let message2;
      if(this.score >= this.winningScore){
        message1 = 'Victory!';
        message2 = 'Your score is' + this.score + '!';
      }
    }
  }
  // calculate aiming   
    calcAim(a, b){
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const aimX = dx / distance * -1;
    const aimY = dy / distance * -1;
    return [ aimX, aimY, dx, dy ];
  }
  checkCollision(a, b){
    const dx = a.x - b.x;
    const dy = a.y - b.y; 
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.radius + b.radius;
    return distance < sumOfRadii;
  }
  createProjectilePool(){
    for (let i = 0; i < this.numberOfProjectiles; i++){
      this.projectilePool.push(new Projectile(this));
    }
  }
  getProgectile(){
    for (let i = 0; i < this.projectilePool.length; i++){
      if (this.projectilePool[i].free) return this.projectilePool[i];
    }
  }
  createEnemyPool(){
    for (let i = 0; i < this.numberOfEnemies; i++){
      this.enemyPool.push(new Asteroid(this));
      this.enemyPool.push(new Lobstermorph(this));
    }
  }
  getEnemy(){
    for (let i = 0; i < this.enemyPool.length; i++){
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }
}

// canvas settings

window.addEventListener('load', function() {
  const canvas = this.document.getElementById('canva');
  const c = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 800;

  c.strokeStyle = 'aquamarine';
  c.lineWidth = 1;
  c.fillStyle = 'white';
  c.font = '50px Helvetica';
  c.textBaseline = 'middle';
  c.textAligh = 'center';

  const game = new Game(canvas);
  let lastTime = 0;
  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    c.clearRect(0, 0, canvas.width, canvas.height);
    game.render(c, deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  
});