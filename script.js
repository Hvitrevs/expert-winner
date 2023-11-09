

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
    this.aim = this.game.calcAim(this.game.mouse, this.game.planet);
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
    this.speedModifier = 5;
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
    this.x = 100;
    this.y = 100;
    this.radius = 40;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.speedX = 0;
    this.speedY = 0;
    this.free = true;
  }
  start(){
    this.free = false;
  }
  reset(){
    this.free = true;
  }
  draw(context){
    if (!this.free){
      context.beginPath();
      context.arc( this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();

    }
  }
  update(){
    if (!this.free){
      this.x += this.speedX;
      this.y += this.speedY;
    }
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
    this.numberOfProjectiles = 15;
    this.createProjectilePool();

    this.enemyPool = [];
    this.numberOfEnemies = 20;
    this.createEnemyPool();

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
      else if (e.key === 'f') this.player.shoot();
    });
  }
  render(context){
    this.planet.draw(context);
    this.player.draw(context);
    this.player.update();
    this.projectilePool.forEach(projectile => {
      projectile.draw(context);
      projectile.update();
    });
    this.enemyPool.forEach(enemy => {
      enemy.draw(context);
      enemy.update();
    })

  } 
  // calculate aiming   
    calcAim(a, b){
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const aimX = dx / distance;
    const aimY = dy / distance;
    return [ aimX, aimY, dx, dy ];
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
      this.enemyPool.push(new Enemy(this));
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

  addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });
  
  window.onresize = function() {
    location.reload();
  }
  if (window.innerWidth <= 480) { 
    canvas.width = 800;
    canvas.height = 800;
  } else if (window.innerWidth <= 1080) { 
      canvas.width = 800;
      canvas.height = 800;
  } else {
    canvas.width = 800; 
    canvas.height = 800; 
  }


  c.strokeStyle = 'aquamarine';
  c.lineWidth = 2;

  const game = new Game(canvas);

  function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    game.render(c);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  
});