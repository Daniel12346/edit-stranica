//TODO: prevest

//proporcije nisu uvijek idealne, ali igra funkcionira na svim uređajima

/*POSTAVKE */

//sve postavke razina su definirane u ovoj mapi
const levels = new Map();
levels.set(1, {
  //trenutna razina
  current: 1,
  //sljedeća razina
  next: 2,
  //pozadinska slika razine
  backgroundUrl: "assets/pucisca.jpg",
  gravity: 1.1,
  speed: 1.1,
  //određuje broj stvorenih cijevi
  pipeFrequencyModifier: 1,
  //total distance is the overall distance passed through all the levels, including the current one,
  //ukupna udaljenost prijeđena kroz sve razine, uključujući trenutnu, koja je potrebna za prelazak na novu razinu
  totalDistance: 1000
});

levels.set(2, {
  current: 2,
  next: 3,
  backgroundUrl: "assets/postira.jpg",
  gravity: 1.4,
  speed: 1.7,
  pipeFrequencyModifier: 1.6,
  totalDistance: 1500
});

levels.set(3, {
  current: 3,
  next: 1,
  backgroundUrl: "assets/supetar.JPG",
  gravity: 1.9,
  speed: 2.3,
  pipeFrequencyModifier: 2,
  totalDistance: 200
});

class Physics {
  constructor({ gravity, speed }) {
    //određuje brzinu padanja galeba
    this.gravity = gravity;
    //određuje brzinu kretanja cijevi (privid brzine kretanja galeba)
    this.speed = speed;
  }
}
//klasa od koje naslijeđuju sve ostale klase koje pretstavljaju objekte koji su vidljivi na canvasu

//u konstruktoru klase se svi parametri vezuju za objekt koji nastaje
class Drawable {
  //ctx je kontekst canvas koji je potreban za crtanje, img je Image objekt
  constructor({ ctx, img, x = 0, y = 0, width, height }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.img = img;
    this.width = width;
    this.height = height;
  }
  //crta sliku predmeta na canvas
  draw({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    this.ctx.drawImage(this.img, x, y, width, height);
  }
  //the multiplier will be calculated using gravity
  flap({ multiplier }) {
    this.y -= multiplier * 15;
  }
}

//klasa koja predstavlja galeba
class Seagull extends Drawable {
  constructor({ ctx, img, x = 0, y = 0, width = 300, height = 300 }) {
    //metoda super poziva konstruktor klase Drawable
    super({ ctx, img, x, y, width, height });
  }
  //galeb "skače" tako da se njegova pozicija na y-osi smanjuje jer se 0 nalazi na vrhu canvasa
  flap({ multiplier }) {
    this.y -= multiplier * 15;
  }
  //metoda draw je naslijeđena od klase Drawable i nisu potrebne promjene
}

//cijev
class Pipe extends Drawable {
  //pozicija cijevi može biti na vrhu - top ili dnu - bottom
  constructor({ ctx, position = "top", width = 20, height, canvasHeight, x }) {
    super({ ctx, width, x });
    this.position = position;
    this.canvasHeight = canvasHeight;
    //visinu cijevi određuje visina canvasa, zbog čega je ona responzivna pa je igra igriva na zaslonima različitih veličina (uključujući neke mobilne)
    this.height =
      //visina svake cijevi je slična, ali u osnovi nasumična
      canvasHeight / 3.5 + Math.round(Math.random() * canvasHeight * 0.1);
    this.y =
      this.position === "top"
        ? //ako se cijev nalazi na vrhu, udaljenost na y-osi je 0,
          0
        : //inače je vrijednost y velika pa se nalzi blizu dnu canvasa
          0.75 * canvasHeight + Math.floor(Math.random() * 30);
  }
  //metoda draw ove klase se razlikuje od metode klase od koje naslijeđuje
  draw({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    //gradient boje na cijevima zbog manje jednoličnosti
    const gradient = this.ctx.createLinearGradient(x, y, width, height);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.6, "black");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
    //ovaj dio funkcije crta vrh cijevi
    this.ctx.fillRect(
      //x je različit zbog centriranja otrova čija širina nije jednaka širini cijevi
      x - 20,
      this.position === "top" ? y + height : y,
      //širina otvora
      1.4 * width,
      //visina je jednaka desetini visine cijevi
      height / 10
    );
  }
}

//plastične vrećice
class Bag extends Drawable {
  constructor({ ctx, img, x = 0, y = 0, width = 300, height = 300 }) {
    super({ ctx, img, x, y, width, height });
  }
}

/*KOMPONENTA */

//html template-a predstavlja html koji komponenta stvara,
//slično render metodi u reactjs klasama ili vrijednosti koju vraćaju funkcijske komponente
const template = document.createElement("template");
//postavljanje html-a (i css-a)

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
  display: flex;
  justify-content: center;
  align-items: center;
}
#overlay {
  z-index: 4;
  position: absolute;
  height: 90%;
  width: 60%;
  min-width: 250px;
}

.display{
  padding: 0.6rem;
  background: hsla(130,60%,30%,0.9);
  border-radius: 4px;
  color: white;
  box-shadow: 0px 1px 1px rgba(0,0,0,0.2);
 }
#scoreCounter,#levelCounter{
  font-weight: bold;
  font-family: roboto;
  font-size: 1.2rem;
}


.info-display{
  box-shadow: 0 2px 2px 2px rgba(0,0,0,0.4);
  background: hsla(130,60%,30%,0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  flex-flow: row wrap;
  opacity: 1;
}

.info-display>*{
  flex: 1 0 100%;
  display: block;
}

.game-info{
  width: 90%;
  background: hsla(130,60%,22%,0.95); 
}


.info-display.hidden{
  opacity:0;
}

.info-button, #resetButton{
  background: hsla(130,60%,10%,0.95); 
display: inline-block;
padding: 0.2rem;
border-radius: 3px;
}


#resetButton{
  color: white;
  border: none;
  max-width: 3rem;
  height: auto;
  background: hsla(130,60%,15%,0.95); 
  font-size: 2rem

}


</style>

<div class="canvas-container">
  <div id="overlay" >
    <span class="display">LEVEL <span id="levelCounter">1</span></span>
    <span class="display">score: <span id="scoreCounter">0</span></span>
    <div class="display info-display">
      <p class="display game-info" id="gameInfo">Pritisnite <span class="info-button">P</span> da započnete</p> 
      <button id="resetButton">&#x21bb</button>    
    </div>

  </div>

  <canvas id="canvas" width="1000" height="100"></canvas>
</div>`;

//klasa koja predstavlja cijelu komponentu
class FlappyGaleb extends HTMLElement {
  constructor() {
    //super() se mora pozvati u konstruktoru klase web komponente
    super();
    //$root je korijen shadow dom-a komponente
    this.$root = this.attachShadow({ mode: "open" });
    //kopija cijelog saržaja template-a se ubacuje u shadow dom
    this.$root.appendChild(template.content.cloneNode(true));
    //canvas i njegov kontekst se vezuju za klasu
    this.canvas = this.$root.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  connectedCallback() {
    //veliki dio ovih varijabli i funkcija je mogao biti definiran kao svojstva i metode klase,
    //ali ideja o pretvaranju ove igre u web komponentu je došla nakon njegova stvaranja pa je prebačen
    //u ovu metodu koja je pozvana kad se komponenta poveže u dom html-a
    let isRunning = false;
    let isOver = false;
    let distance = 0;
    //lista svih cijevi na canvasu u određenom trenutku
    let pipes = [];
    //lista plastičnih vrećica
    let bags = [];
    //postavljanje prve razine
    let currentLevel = levels.get(1);

    //destruktriranje objekta canvasa i njegovog konteksta iz ove klase
    const { ctx, canvas } = this;

    //postavljanje canvasa

    //pozadina canvasa ovisi o razini i njezin url je svojstvo objekta svake razine
    canvas.style.backgroundImage = `url(${currentLevel.backgroundUrl})`;

    //širina i visina canvasa su jednake visini i širini windowa zbog responzivnosti
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //element koji prikazuje trenutne bodove igrača (udaljenost od početka prve razine)
    const scoreCounter = this.$root.getElementById("scoreCounter");
    //element koji prikazuje trenutnu razinu igrača
    const levelCounter = this.$root.getElementById("levelCounter");
    //element koji prikazuje poruku koja ovisi o trenutnom stanju igre
    const gameInfo = this.$root.getElementById("gameInfo");
    const resetButton = this.$root.getElementById("resetButton");

    const { gravity, speed } = currentLevel;
    const physics = new Physics({ gravity, speed });

    //korištenje Image objekta je praktičnije od <img/> objekta jer ne ovisi o učitavanju html-a
    const seagullImg = new Image();
    seagullImg.src = "assets/galeb.svg";

    const bagImg = new Image();
    bagImg.src = "assets/bag.svg";

    //stvaranje objekta galeba uz pomoć ranije definirane klase
    const seagull = new Seagull({
      ctx,
      img: seagullImg,
      x: 0,
      y: 0,
      width: canvas.clientHeight / 2
    });

    //detekcija sudara između galeba i nekog objekta
    const hasCollided = ({ seagull, object }) => {
      //rezultati nisu savršeno precizni jer funkcija samo računa udaljenost dviju točaka

      //broj s kojim se uspoređuju dimenzije objekta tehnički predstavlja osjetljivost na sudar (manji broj bi značio manju učestalost sudara),
      //i nije jednak za cijevi i za vrećice
      const factor =
        object instanceof Pipe ? object.height * 0.7 : object.width * 0.5;
      return (
        Math.sqrt((seagull.y - object.y) ** 2 + (seagull.x - object.x) ** 2) <
        factor
      );
    };

    //prelazak na sljedeću razinu
    const nextLevel = () => {
      if (currentLevel && currentLevel.next) {
        const nextLevel = levels.get(currentLevel.next);
        //ako nema sljedeće razine funkcija prestaje
        if (!nextLevel) {
          return;
        }
        //sljedeća razina postaje trenutna razina
        currentLevel = nextLevel;
        canvas.style.backgroundImage = `url(${nextLevel.backgroundUrl})`;
        physics.speed = nextLevel.speed;
        physics.gravity = nextLevel.gravity;
        //broj razine se prikazuje u levelCounter elementu
        levelCounter.textContent = nextLevel.current;
        return nextLevel;
      }
    };

    //kraj igre
    const end = () => {
      //prikazivanje poruke s konačnim rezultatom
      gameInfo.textContent = `REZULTAT: ${distance}`;

      gameInfo.parentElement.classList.remove("hidden");
      isRunning = false;
      isOver = true;
      //TODO: move this setup to a new function
    };
    // crta sve cijevi na canvas
    const drawPipesAndBags = () => {
      //ako je prva prešla lijevog ruba za duljinu jednaku svojoj širini, briše se iz liste cijevi
      if (pipes[0] && pipes[0].x <= -pipes[0].width) {
        pipes.shift();
      }

      if (bags[0] && bags[0].x <= -bags[0].width) {
        bags.shift();
      }

      //stvaranje liste svih objekata spreadanjem listi cijevi i vrećica u novu listu
      const objects = [...pipes, ...bags];
      objects.forEach(object => {
        //crtanje objekata
        object.draw({});
        //kretanje objekata mijenjajem svojstva x, ovisi o brzini određene razine
        object.x -= 2 * physics.speed;
        //u slučaju sudara, igra je gotova
        if (hasCollided({ seagull, object })) {
          end();
        }
      });
    };

    //resetiranje (vraćanje svega na osnovne postavke)
    const reset = () => {
      isOver = false;
      distance = 0;
      pipes = [];
      bags = [];
      currentLevel = levels.get(1);
      canvas.style.backgroundImage = `url(${currentLevel.backgroundUrl})`;
      levelCounter.textContent = 1;
      physics.speed = currentLevel.speed;
      physics.gravity = currentLevel.gravity;
      isRunning = true;
      //drugi argument toggle funkcije mora biti true da se toggle izvrši, što znači da će se gameInfo prikazati samo ako je igra uspješno resetirana i ponovno započeta
      gameInfo.parentElement.classList.toggle("hidden", isRunning);
      seagull.y = canvas.clientHeight / 3;
      run();
    };

    //stvaranje pojedine cijevi
    const generatePipe = () =>
      //novi objekt cijevi se dodaje u listu svih cijevi
      pipes.push(
        new Pipe({
          canvasHeight: canvas.clientHeight,
          ctx,
          x: canvas.clientWidth,
          width: 100,
          position: Math.round(Math.random()) ? "top" : "bottom"
        })
      );

    const generateBag = () =>
      bags.push(
        new Bag({
          height: canvas.clientHeight / 7,
          img: bagImg,
          canvasHeight: canvas.clientHeight,
          ctx,
          x: canvas.clientWidth,
          width: canvas.clientHeight / 4,
          y:
            canvas.clientHeight / 4 +
            //u ovoj funkciji se nalazi sinus kako bi mogla generitati pozitivne i negativen brojeve jer vrećice mogu biti ispod ili iznad sredine y-osi canvasa
            (Math.round(Math.sin(Math.random() * 90)) * canvas.clientHeight) /
              10
        })
      );

    pipes.length >= 2 &&
      pipes[pipes.length - 1].position === pipes[pipes.length - 2].position;
    //boolean koji predstavlja mogući nedostatak prostora za crtanje novih cijevi
    const notEnoughSpace =
      //nema dovoljno prostora ako postoje bar 3 cijevi i ako su one međusobno preblizu
      pipes.length > 3 &&
      //uspoređivanje udaljenosti cijevi
      pipes[pipes.length - 1].x - pipes[pipes.length - 2].x <
        //djelitelj je veći na višim razinama, što znači da je dozvoljena manja udaljenost između cijevi
        150 / currentLevel.pipeFrequencyModifier;

    //glavna animacijska petlja
    const animate = () => {
      //prvo nastupa potpuno čišćenje canvasa
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //crtanje galeba bez promjena zadanih parametara jer su sva potrebna svosjtva definirana na klasi galeba
      seagull.draw({});
      seagull.y += physics.gravity;
      //promjena bodova (udaljenosti) ovisi o brzini definiranoj na svakoj razini
      distance += Math.round(1 * currentLevel.speed);
      //string + int pretvara int u string
      scoreCounter.textContent = "" + distance;
      //ako je prijeđena udaljenost jednaka udaljenosti određenoj na razini, igrač prelazi na višu razinu
      if (distance === currentLevel.totalDistance) {
        nextLevel();
      }

      //nasumičan broj od 1 do 1000
      const randomizer = Math.floor(Math.random() * 1000);

      //petlja djeluje više puta u sekundi pa ovaj uvjete ograničava stvaranje cijevi
      if (randomizer < 6 * currentLevel.pipeFrequencyModifier) {
        //ako postoje cijevi, cijev će biti stvorena samo ako je prostora dovoljno,
        //a ako trenutno ne postoji ni jedna cijev, nova cijev će biti stvorena bez drugih uvjeta
        //(vjerojatno bilo čitljivije uz dvije if-petlje)
        pipes.length ? !notEnoughSpace && generatePipe() : generatePipe();
      }

      //ako nema nijedne vrećice i randomizer bude manji od 4 (šansa je 3/1000) i trenutna razina je viša od 2, stvara se nova vrećica
      !bags.length &&
        randomizer < 4 &&
        currentLevel.current > 2 &&
        generateBag();
      //crtanje svih objekata, bez obzira je li nova stvorena
      drawPipesAndBags();
      //requestAnimationFrame automatski poziva funkciju u petlji učestalošću koja odgovara browseru,
      // znatno učinkovitije od setInterval
      //req je objekt koji requestAnimationFrame vraća služi za prekidanje te iste petlje
      const req = requestAnimationFrame(animate);
      if (!isRunning) {
        //ako je igra pauzirana ili prekinuta, prekida se petlja
        cancelAnimationFrame(req);
      }
    };

    const run = () => {
      if (!isRunning && !isOver) {
        isRunning = true;
      }
      animate();
    };

    const stop = () => {
      if (isRunning) {
        isRunning = false;
      }
    };

    const toggleActive = () => {
      isRunning ? stop() : run();
    };

    //postavlja listener za event pritiska određenih tipki
    const listenToEvents = () => {
      window.addEventListener("keydown", e => {
        //keyCode 32 predstavlja razmaknicu (spacebar)
        if (e.keyCode === 32) {
          if (!isRunning && !isOver) {
            run();
          }
          gameInfo.parentElement.classList.toggle("hidden", isRunning);

          //služi za "skakanje" galeba
          seagull.flap({ multiplier: 2 / physics.gravity });
        } else if (e.key === "p") {
          //p pauzira igru i prikazuje poruku o pauziranju
          if (gameInfo.parentElement.classList.contains("hidden")) {
            gameInfo.textContent = "PAUZIRANO";
          }
          gameInfo.parentElement.classList.toggle("hidden");
          toggleActive();
        } else if (e.key === "r") {
          reset();
        }
      });
      resetButton.addEventListener("click", reset);
      if (this.canvas.clientWidth < 1200) {
        const infoButton = this.$root.querySelector(".info-button");
        // "pritisnite bilo gdje da započnete"
        infoButton.textContent = "bilo gdje";
        //TODO: mobilno pauziranje
        infoButton.classList.remove("info-button");
        this.addEventListener("click", () => {
          if (!isRunning && !isOver) {
            run();
            gameInfo.parentElement.classList.add("hidden");
          }
          seagull.flap({ multiplier: 2 / physics.gravity });
        });
      }
    };
    //regiranje na evente počinje nakon učitavanja slike galeba
    seagullImg.onload = () => {
      listenToEvents();
    };
  }
}

//definiranje web komponente
window.customElements.define("ie-flappy-galeb", FlappyGaleb);
