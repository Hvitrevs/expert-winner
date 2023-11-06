

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
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.stroke();
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
    
  }
  draw(context){
    context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.stroke();
  }
  update(){
    this.aim = this.game.calcAim(this.game.mouse, this.game.planet);
    this.x = this.game.planet.x + (this.game.planet.radius + this.radius) * this.aim[0];
    this.y = this.game.planet.y + (this.game.planet.radius + this.radius) * this.aim[1];
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
  }
  render(context){
    this.planet.draw(context);
    this.player.draw(context);
    this.player.update();
    context.beginPath();
    context.moveTo(this.planet.x, this.planet.y);
    context.lineTo(this.mouse.x, this.mouse.y);
    context.stroke();
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