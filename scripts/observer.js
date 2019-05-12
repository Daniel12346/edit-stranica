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
    initialTransform = "",
    initialOpacity = "",
    initialTransition = "",
    delay = ""
  },
  ...elements
) => {
  const callback = (entries, observer) => {
    if (!window.IntersectionObserver) {
      //intersection observer još nije podržan u svim browserima
      throw new Error("Intersection observer nije podržan u ovom browseru");
    }

    //funkcija koju observer poziva odmah, a postavlja styling elementa prije nego što postane vidljiv
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
      //entry.target je sam element
      const { target } = entry;

      //ako na elementu nije definirana funkcija onIntersection, poziva se funkcija koja priprema element za fadeIn
      !target.onIntersection && setup(target);
      if (entry.isIntersecting) {
        target.onIntersection
          ? target.onIntersection()
          : //ako definiramo onIntersection callback na elementu, on će biti pozvan,
            //inače se poziva gore definirani fadeIn
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
  rootMargin: "0px 0px",
  threshold: 0.1,
  initialOpacity: 0,
  initialTransform: "translate(-100px,0)",
  initialTransition: "transform 1s ease-out, opacity 1s ease-out",
  delay: "0"
};

cards.forEach((card, i) =>
  //card je svaki selektirani element s klasom "card", i je index elementa u arrayu svih takvih elemenata (varijabla cards)
  //transition delay ovisi o indexu pa slike ne ulaze istovremeno
  observe({ ...options, rootMargin: "-20% 300px", delay: `${i * 0.3}s` }, card)
);

/***LAZY LOADING***/

//lazy loading je tehnika odgađanja učitavanja elementa do određenog trenutka zbog bržeg učitavanja stranice
//uz pomoć intersection observera lazy loadamo sve slike koje bi zbog svoje veličine učitavanje

//sve slike koje je potrebno lazy loadati imaju atribut data-src umjesto src u html-u
const [lazyImages] = selectAll(document, "*[data-src]");
lazyImages.forEach(img => {
  //ako IntersectionObserver nije podržan, odmah postavljamo src
  if (!window.IntersectionObserver) {
    this.src = this.dataset.src;
  } else {
    //ovdje ne koristimo arrow function jer bi on implicitno vezao this za ono što this predstavlja u okolnom leksičkom scopeu (u ovom slučaju window)
    //u običnoj funkciji this će predstavljati ono što poziva funkciju, ovdje img - sam img element
    img.onIntersection = function() {
      //img u html-u nema definiran src jer učitavanje slike počinje tek kad ima taj atribut
      //kad se img nađe u željenom prostoru, dobija atribut src jednak atributu data-src postavljenom u html-u i počinje učitavanje slike
      this.src = this.dataset.src;
    };
  }
});

/*ULAZAK KARTICA*/
observe(
  { ...options, initialTransition: "", rootMargin: "100px" },
  ...lazyImages
);
const [osobe] = selectAll(document, ".osoba");

osobe.forEach((osoba, i) => {
  osoba.onIntersection = function() {
    this.classList.add("fade-in");
  };

  observe(
    {
      ...options,
      initialTransform: "translate(-100px,0)",
      delay: `${i * 0.3}s`,
      threshold: 0.2,
      rootMargin: "-5% 1000px"
    },
    osoba
  );
});

/*GALEB NA POČETNOJ STRANICI*/

const [galeb, introSection] = selectById(document, "galeb", "introSection");

if (introSection) {
  introSection.onIntersection = function() {
    galeb.style.transform = "translate(0,0)";
  };
}
observe(
  {
    ...options,
    initialOpacity: 1,
    initialTransform: null,
    threshold: 0.7,
    rootMargin: "-10% 3000px"
  },
  introSection
);
