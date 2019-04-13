//funkcije za lakše odabiranje elemenata

//odabire samo jedan element
//root je element koji sadrži element koji trazimo, tag je oznaka željenog elementa
const selectOne = (root, tag) => root.querySelector(tag);
//odabir korištenjem .getElementById() je malo brži
const selectOneById = (root, id) => root.getElementById(id);

//rest operator sve tagove okuplja u array,
//funkcija vraća novi array s elementom koji odgovora svakom tagu
//elementi se iz vraćenog arraya mogu izvući destrukturiranjem
//npr. const [button,img] = select(document,"button","img")
const select = (root, ...tags) => [...tags].map(tag => root.querySelector(tag));

const selectById = (root, ...ids) => [...ids].map(id => root.querySelector(id));

//vraća array koji se sastoji od više arraya elemenata
//Array.from() pretvara listu nodeova u "pravi" array
const selectAll = (root, ...tags) =>
  [...tags].map(tag => Array.from(root.querySelectorAll(tag)));
/*
export default ({
  children,
  rootMargin = "-20% 1000px -20% 1000px",
  threshold = 0.8,
  //initialTransform is the "(x,y)" part of transform: translate(x,y)
  //style on the element before fade-in
  initialTransform,
  initialOpacity = 0,
  time = "0.8s"
}) => {
  const [isFadedIn, setIsFadedIn] = useState(false);
  //wrapper.current is the element that fades in
  const wrapper = useRef(null);
  const options = { rootMargin, threshold };
  const callback = (entries, observer) => {
    //no need to iterate through the entries because there's only one
    if (entries[0].isIntersecting) {
      setIsFadedIn(true);
      wrapper.current.classList.toggle("faded-in", isFadedIn);
      observer.unobserve(wrapper.current);
    }
  };
  //runs only once because it creates an observer
  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(wrapper.current);
    //runs on unmount
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  return (
    <Wrapper
      isFadedIn={isFadedIn}
      ref={wrapper}
      initialTransform={initialTransform}
      initialOpacity={initialOpacity}
      time={time}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  z-index: 0;
  height: auto;
  width: auto;
  transition: ${p => `opacity ${p.time},transform ${p.time}`};
  transform: ${p => `translate${p.isFadedIn ? "(0, 0)" : p.initialTransform}`};
  opacity: ${p => (p.isFadedIn ? 1 : p.initialOpacity)};

  * {
    z-index: 2;
  }
`;
*/

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
    transitionDelay = ""
  },
  ...elements
) => {
  const callback = (entries, observer) => {
    if (!window.IntersectionObserver) {
      //intersection observer još nije podržan u svim browserima
      target.style.opacity = target.style.opacity || initialOpacity;
      target.style.tranform = target.style.tranform || initialTransform;
      throw new Error("Intersection observer nije podržan u ovom browseru");
    }
    //ova funkcija svakom elementu dodaje klasu "faded-in" kad se nađe unutar promatranog prostora
    entries.forEach(entry => {
      const { target } = entry;
      //dodajemo klasu koju kasnije oduzimamo tako da ta izolirana klasa ne narušava CSS styling elementa u slučaju da intersection observer nije pordžan
      //npr button.fading-in utječe na button element samo ako mu ova funkcija ne može dodati klasu "fading-in"
      target.style.opacity = target.style.opacity || initialOpacity;
      target.style.tranform = target.style.tranform || initialTransform;
      target.style.transition = "";

      // target.classList.add("fading-in");
      console.log(entry);
      if (entry.isIntersecting) {
        //entry.target je sam element
        target.onIntersection
          ? target.onIntersection()
          : //ako definiramo onIntersection callback na elementu, on će biti pozvan,
            //inače ova funkcija samo mijenja "fading-in" klasu elementa
            target.classList.remove("fading-in");
        //mijenjamo samo transform i opacity jer su njihove tranzicije najperformantije
        target.style.transition = target.style.transition || initialTransition;
        target.style.transitionDelay = transitionDelay;
        target.style.transform = "translate(0,0)";
        target.style.opacity = "1";
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
  [...elements].forEach(el => el && observer.observe(el));
};
const [landing] = select(document, ".landing-section");
const [cards] = selectAll(document, ".card");

//the default options
const options = {
  rootMargin: "-20% 300px",
  threshold: 0.1,
  initialOpacity: 0,
  initialTransform: "translate(-100px,0)",
  initialTransition: "transform 1s, opacity 1s",
  transitionDelay: "0"
};

cards.forEach((card, i) =>
  //card je svaki element s klasom "card", i je index elementa u arrayu svih takvih elemenata (vcards)
  observe({ ...options, transitionDelay: `${i * 0.3}s` }, card)
);
