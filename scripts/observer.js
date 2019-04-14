/*intersection observer*/
//TODO: observer.js

//intersection observer je novi API koji omogućuje lakše aktiviranje neke funkcije kad
//određeni element postane vidljiv i učinkovitiji je od window.onScroll

const observe = (
  //root je null, što znači da je viewport okvir unutar kojeg se element mora naći da se pozove funkcija (callback),
  //rootMargin je dodatni prostor oko roota, omogućuje pozivanje callbacka prije nego što u potpunosti scrollamo do elementa
  //threshold je broj koji određuje koliko se element mora sjeći s rootom da se callback pozove (ovdje 0.8 = 80%)
  {
    root = null,
    rootMargin = "-20% 1000px -20% 1000px",
    threshold = 1,
    initialTransform = "translate(0,0)",
    initialOpacity = "1",
    initialTransition = "",
    delay = ""
  },
  ...elements
) => {
  const callback = (entries, observer) => {
    if (!window.IntersectionObserver) {
      //intersection observer još nije podržan u svim browserima, a za polyfill bi bio potreban npm
      throw new Error("Intersection observer nije podržan u ovom browseru");
    }

    //funkcija koju observer poziva odmah koja postavlja styling elementa prije nego što postane vidljiv
    const setup = el => {
      el.style.opacity = el.style.opacity || initialOpacity;
      el.style.transform = el.style.transform || initialTransform;
      el.style.transition = "";
    };

    const fadeIn = el => {
      el.style.transition = el.style.transition || initialTransition;
      el.style.transitionDelay = delay;
      el.style.transform = "translate(0,0)";
      el.style.opacity = "1";
    };

    entries.forEach(entry => {
      const { target } = entry;

      //ako ne elementu nije definirana funkcija onIntersection, poziva se funkcija koja priprema element za fadeIn
      !target.onIntersection && setup(target);
      if (entry.isIntersecting) {
        //entry.target je sam element
        target.onIntersection
          ? target.onIntersection()
          : //ako definiramo onIntersection callback na elementu, on će biti pozvan,
            //inače ova se poziva gore definirani fadeIn
            fadeIn(target);
        observer.unobserve(target);
      }
    });
  };

  const options = {
    root,
    rootMargin,
    threshold
  };

  const observer = new IntersectionObserver(callback, options);
  //observer će observirati samo one elemente koji su definirani (ako je el falsy,  callback u forEach petlji ne radi ništa)
  [...elements].forEach(el => el && observer.observe(el));
  //vraćamo observer zbog mogućnosti njegova odspajanja po potrebi (observer.disconect())
  return observer;
};
const [landing] = select(document, ".landing-section");
const [cards] = selectAll(document, ".card");

//osnovne postavke
const options = {
  rootMargin: "-20% 300px",
  threshold: 0.1,
  initialOpacity: 0,
  initialTransform: "translate(-100px,0)",
  initialTransition: "transform 1s ease-out, opacity 1s ease-out",
  delay: "0"
};

cards.forEach((card, i) =>
  //card je svaki element s klasom "card", i je index elementa u arrayu svih takvih elemenata (varijabla cards)
  //transition delay ovisi o indexu pa slike ne postaju vidljive istovremeno
  observe({ ...options, delay: `${i * 0.3}s` }, card)
);

/***LAZY LOADING***/

//lazy loading je tehnika odgađanja učitavanja elementa do određenog trenutka zbog bržeg učitavanja stranice
//uz pomoć intersection observera lazy loadamo sve slike koje bi zbog svoje veličine učitavanje

//sve slike koje je potrebno lazy loadati imaju atribut data-lazy=true u html-u
const [lazyImages] = selectAll(document, "img[data-lazy=true]");
lazyImages.forEach(img => {
  //ovdje ne koristimo arrow function jer bi on implicitno vezao this za ono što this predstavlja u okolnom leksičkom scopeu (u ovom slučaju window)
  //u običnoj funkciji this će predstavljati ono što poziva funkciju, ovdje img - sam img element
  img.onIntersection = function() {
    //img u html-u nema definiran src jer učitavanje slike počinje tek kad ima taj atribut
    //kad se img nađe u željenom prostoru, dobija atribut src jednak atributu data-src postavljenom u html-u i počinje učitavanje slike
    this.src = this.dataset.src;
  };
});

observe({ ...options, initialTransition: "" }, ...lazyImages);
