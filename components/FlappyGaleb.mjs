/** THE COMPONENT **/

//the .mjs extension means it's a module

import { Seagull, levels, Pipe, Physics } from "../scripts/gameSettings.mjs";
//the template is used as the component's rendered html
const template = document.createElement("template");
template.innerHTML = `
<style>
*,
*::after,
*::before {
  box-sizing: border-box;
}

:host,canvas{
  display: block;
  width: 100%;
  height: auto;
}

canvas {
  background-image: url("assets/pucisca.jpg");
  /* width: 1366px;
  height: 800px;*/
  width: 100%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.canvas-container {
  height: 100%;
  width: 100%;
  position: relative;
}
#overlay {
  z-index: 4;
  position: absolute;
  height: 90%;
  width: 90%;
}

/*TODO: refactor*/
#overlay.shown {
  pointer-events: none;
  z-index: 5;
  background: hsla(130, 50%, 50%, 0.9);
}


</style>
<div class="canvas-container flexCC">
<div id="overlay" class="">
  <span id="scoreDisplay">0</span>
  <span id="collisionTest"></span>
</div>
<canvas id="canvas" width="1000" height="100"></canvas>
</div>`;

class FlappyGaleb extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(template.content.cloneNode(true));
    //TODO: refactor into a web component (maybe)
    this.canvas = this.$root.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  connectedCallback() {
    let isRunning = false;
    let distance = 0;
    let pipes = [];

    //TODO: add max distance to levels
    let currentLevel = levels.get(1);

    const { ctx, canvas } = this;

    //setting up the canvas
    canvas.style.backgroundImage = `url(${currentLevel.backgroundUrl})`;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const toggleButton = document.getElementById("toggleButton");
    const scoreDisplay = this.$root.getElementById("scoreDisplay");

    const { gravity, speed } = currentLevel;
    const physics = new Physics({ gravity, speed });

    const seagullImg = new Image(300, 300);
    seagullImg.src = "assets/galeb.svg";
    const seagull = new Seagull({
      ctx,
      img: seagullImg,
      x: 0,
      y: 0,
      width: canvas.clientHeight / 2
    });

    const hasCollided = ({ seagull, object }) => {
      //calculating approximate distances between the centres of the seagull and the object on both axes
      //the results are suprisingly accurate
      return (
        Math.sqrt((seagull.y - object.y) ** 2 + (seagull.x - object.x) ** 2) <
        //the factor by which the height is multiplied effectively signifies collision sensitivity
        object.height * 0.75
      );
    };

    //advancing to the next level
    const nextLevel = () => {
      if (currentLevel && currentLevel.next) {
        const next = levels.get(currentLevel.next);
        //if there is no next level (if it's undefinded) the function does nothing
        if (!next) {
          return;
        }
        //if there is a next level it sets it as the current level and updates the background and the physics variables
        currentLevel = next;
        canvas.style.backgroundImage = `url(${next.backgroundUrl})`;
        physics.speed = next.speed;
        physics.gravity = next.gravity;
        return next;
      }
    };

    const reset = () => {
      let first = levels.get(1);
      currentLevel = first;
      distance = 0;
      isRunning = false;
      //TODO: move this setup to a new function
      canvas.style.backgroundImage = `url(${first.backgroundUrl})`;
      physics.speed = first.speed;
      physics.gravity = first.gravity;
    };

    const drawPipes = () => {
      //removing the first pipe reached if it reached the left edge
      if (pipes[0] && pipes[0].x === 0) {
        pipes.shift();
      }
      //moving and drawing all pipes
      //using forEach and not map because the function returns nothing

      pipes.forEach(pipe => {
        pipe.draw({});
        pipe.x -= 2 * physics.speed;
        if (hasCollided({ seagull, object: pipe })) {
          this.$root.getElementById("collisionTest").textContent = "COLLISION";
          reset();
        }
      });
    };

    const generatePipe = () =>
      pipes.push(
        new Pipe({
          canvasHeight: canvas.clientHeight,
          ctx,
          //TODO: random multipliers (and randomize height in gameSettings)
          x: canvas.clientWidth,
          width: 100,
          position: Math.round(Math.random()) ? "top" : "bottom"
        })
      );

    const areLastNPipesOnTheSameSide = (n = 3) => {
      let lastNPipes = [...pipes].splice(n);
      return (
        lastNPipes.every(pipe => pipe.position === "top") ||
        lastNPipes.every(pipe => pipe.position === "bottom")
      );
    };
    pipes.length >= 2 &&
      pipes[pipes.length - 1].position === pipes[pipes.length - 2].position;
    const notEnoughSpace =
      pipes.length > 3 &&
      //TODO
      pipes[pipes.length - 1].x - pipes[pipes.length - 2].x <
        //dividing by the modifier set in the levels map
        //higher modifier means smaller minimum distance between pipes
        150 / currentLevel.pipeFrequencyModifier;
    //the animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //drawing the seagull first so it's in the bottom layer

      seagull.draw({});
      seagull.y += physics.gravity;
      distance += Math.round(1 * currentLevel.speed);
      //displaying the current distance ("" + number implicit converts it to a string)
      scoreDisplay.textContent = "" + distance;
      if (distance === currentLevel.totalDistance) {
        nextLevel();
      }

      //a random integer between lower than 1000 generated on every redraw used to randomly create pipes
      const randomizer = Math.floor(Math.random() * 1000);

      if (randomizer < 6 * currentLevel.pipeFrequencyModifier) {
        //if there are any pipes, it generates a pipe only if the distance between the last one
        //and the new one would be sufficient
        pipes.length ? !notEnoughSpace && generatePipe() : generatePipe();
      }
      //the movement of the seagull forward is simulated by moving the pipes further to the left
      drawPipes();

      const req = requestAnimationFrame(animate);
      if (!isRunning) {
        cancelAnimationFrame(req);
      }
    };

    const run = () => {
      if (!isRunning) {
        isRunning = true;
      }
      animate();
    };

    const stop = () => {
      if (isRunning) {
        isRunning = false;
      }
    };

    //sets up the keyboard events
    const listenToKB = () =>
      window.addEventListener("keydown", e => {
        //(the spacebar)
        if (e.keyCode === 32) {
          if (!isRunning) {
            run();
          }
          seagull.jump({ multiplier: 2 / physics.gravity });
        } else if (e.key === "p") {
          toggleActive();
        } else if (e.key === "l") {
          nextLevel();
        }
      });

    const toggleActive = () => {
      isRunning ? stop() : run();
    };

    seagullImg.onload = () => {
      listenToKB();
    };
  }
}

window.customElements.define("ie-flappy-galeb", FlappyGaleb);
