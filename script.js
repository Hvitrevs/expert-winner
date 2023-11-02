



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
    context.stroke();
  }

}


class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.planet = new Planet(this);

    this.mouse = {
      x: 0,
      y: 0
    }

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

  }
  render(context){
    this.planet.draw(context);
    context.beginPath();
    context.moveTo(this.planet.x, this.planet.y);
    context.lineTo(this.mouse.x, this.mouse.y);
    context.stroke();
  }
}

window.addEventListener('load', function() {
  const canvas = this.document.getElementById('canva');
  const c = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 800;
  c.strokeStyle = 'aquamarine'
  c.lineWidth = 2;

  const game = new Game(canvas);

  function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    game.render(c);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  
});