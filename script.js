



class Planet {
  constructor(){
    this.x = 200;
    this.y = 200;
    this.radius = 80;
  }
  draw(context){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}


window.addEventListener('load', function() {
  const canvas = this.document.getElementById('canva');
  const c = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 800;
})