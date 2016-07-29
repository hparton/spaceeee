import { genLine, generatePlanetTexture } from './js/backgroundPattern'


var background = '#251b4f'

var colors = {
  green: '#0dffe1',
  orange: '#ffa283',
  pink: '#ff217b',
}

function SpaceBackground() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.background = background;
  this.sunTexture = generatePlanetTexture(600, [
    {
     offset: -40,
     height: 10,
     width: 4,
     fill: '#fbe1d9'
    },
    {
     offset: 140,
     height: 18,
     width: 4,
     fill: '#efbad3'
    },
    {
     offset: 280,
     height: 18,
     width: 4,
     fill: '#e29fc7'
    },
    {
     offset: 420,
     height: 18,
     width: 4,
     fill: '#ce86b5'
    }
  ], 0.9);



  this.init();

  this.sun = new Sun(this.canvas.width / 6, this.canvas.height - ( this.canvas.height / 3), 150)
  this.planets = [];

  var planetCount = 7;
  for (var b = planetCount - 1; b >= 0; b--) {
    var planet = new Planet(
      0,
      0,
      Math.floor(Math.random() * 30) + 15,
      Math.random() >= 0.5
    );
    this.planets.push(planet)
  };

  var self = this;

  function draw(timestamp) {
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.drawSun(self.sun)
    self.updatePlanetPos(self.planets)
    self.drawPlanets(self.planets)
      requestAnimationFrame(function(timestamp) {
        draw(timestamp)
        meter.tick();
      })
  }

  requestAnimationFrame(function(timestamp) {
    draw(timestamp)
  })


}

SpaceBackground.prototype.init = function() {
  this.canvas = document.getElementById('space');
  this.ctx = this.canvas.getContext('2d');

  this.ctx.canvas.width = this.width;
  this.ctx.canvas.height = this.height;

  this.canvas.style.background = this.background;
}

SpaceBackground.prototype.drawSun = function(sun) {
  this.drawCircle({
    x: sun.position.x,
    y: sun.position.y,
    radius: sun.radius,
    background: sun.background,
    atmosphere: {
      color: '#82648B',
      rings: 4
    },
    shadow: {
      color: 'rgba(130,100,139,0.6)',
      blur: 120
    },
    texture: this.sunTexture
  })
}

SpaceBackground.prototype.drawPlanets = function(planets) {

  for (var i = planets.length -1; i >= 0; i--) {
    this.drawTrajectory({
        x: this.sun.position.x,
        y: this.sun.position.y,
        radius: this.sun.radius + 150 + (150 * i)
      })

    this.ctx.save();

      this.ctx.translate(this.sun.position.x, this.sun.position.y);
        // rotate the rect
      this.ctx.rotate(planets[i].angle);

   this.drawCircle({
      x: planets[i].position.x,
      y: planets[i].position.y,
      radius: planets[i].radius,
      background: planets[i].background,
      shadow: {
        color: 'rgba(247,222,226,0.55)',
        blur: 80,
      }
    })
    if (planets[i].moon) {

      this.drawTrajectory({
        x: planets[i].position.x,
        y: planets[i].position.y,
        radius: planets[i].radius * 1.5
      })

      this.ctx.save();

      this.ctx.translate(planets[i].position.x, planets[i].position.y);
        // rotate the rect
      this.ctx.rotate(planets[i].moon.angle);

      this.drawCircle({
        x: planets[i].radius * 1.5,
        y: 0,
        radius: planets[i].moon.radius,
        background: planets[i].moon.background,
        shadow: {
          color: 'rgba(247,222,226,0.2)',
          blur: 10,
        }
      })

      this.ctx.restore();

    }
          this.ctx.restore();

  }

}

SpaceBackground.prototype.updatePlanetPos = function(planets) {
  for (var i = planets.length -1; i >= 0; i--) {
    // this.planets[i].position.y += 0.1;
    this.planets[i].position.x = this.sun.radius + 150 + (150 * i);
    this.planets[i].position.y = 0;
    planets[i].angle+=planets[i].angularSpeed;

    if (planets[i].moon) {
     planets[i].moon.angle+=planets[i].moon.angularSpeed;
    }
  }
}


SpaceBackground.prototype.drawCircle = function({
  x,
  y,
  radius = 20,
  shadow = {},
  atmosphere = {},
  border = {},
  background = 'grey',
  texture
} = {}) {

      if (shadow.color) {
        // this.ctx.shadowColor = shadow.color;
        // this.ctx.shadowBlur = shadow.blur;
        // this.ctx.shadowOffsetX = 0;
        // this.ctx.shadowOffsetY = 0;
      }

      if (atmosphere.rings) {
        for (var i = atmosphere.rings - 1; i >= 0; i--) {
            this.ctx.fillStyle = atmosphere.color;
            this.ctx.globalAlpha = 0.8 - i * 0.2
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius + (20 * i), 0, Math.PI*2, true);
            this.ctx.fill();
            this.ctx.closePath();

        };
        this.ctx.globalAlpha = 1;
      }




      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI*2, true);

      this.ctx.closePath();

      if (texture) {
        this.ctx.fillStyle = 'clear';
        this.ctx.drawImage(texture, x - radius, y - radius, radius * 2, radius * 2);
      } else {
        this.ctx.fillStyle = background;
        this.ctx.fill();
      }


      if (border.width) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = border.width;
        this.ctx.stroke()
      }


     if (shadow.color) {
      this.ctx.shadowBlur = 0;
     }
}

SpaceBackground.prototype.drawTrajectory = function({
  x,
  y,
  radius,
  width = 2,
  color = '#483b67',
} = {}) {

  this.ctx.strokeStyle = '#483b67';

  this.ctx.lineWidth = width;
  this.ctx.beginPath();
  this.ctx.arc(x, y, radius, 0, Math.PI*2, true)
  this.ctx.strokeStyle = color;
  this.ctx.closePath();
  this.ctx.stroke();
}


function Sun(x, y, radius) {
  this.radius = radius;
  this.position = {};
  this.position.x = x;
  this.position.y = y;
  this.children = [];

  this.background = colors.orange;
}

function Planet(x, y, radius, moon) {
  this.radius = radius;

  this.angle = Math.random() * (360 - 0) + 0;
  this.angularSpeed = (100 - this.radius) / 10000;
  this.position = {};
  this.position.x = x;
  this.position.y = y;

  if (moon) {
    this.moon = new Planet(this.position.x * 1.5, this.position.y * 1.5, this.radius / 3.5)
  }

  this.background = fetch_random(colors);
}

function fetch_random(obj) {
    var temp_key, keys = [];
    for(temp_key in obj) {
       if(obj.hasOwnProperty(temp_key)) {
           keys.push(temp_key);
       }
    }
    return obj[keys[Math.floor(Math.random() * keys.length)]];
}

var meter = new FPSMeter({
  theme: 'dark',
  heat:  1,
  graph:   1,
  history: 20 ,
  maxFPS: 100,
});

var space = new SpaceBackground();



