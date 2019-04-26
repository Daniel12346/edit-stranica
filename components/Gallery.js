const galleryTemplate = document.createElement("template");

galleryTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
}

.gallery {
  margin-top: 10vmax;
  padding: 2rem;
  position: relative;
  min-width: 100%;
  display: grid;
  /*auto-fit znači da se automatski određuje broj redaka prema broju elemenata (ovdje slike),
   a svako polje unutar grida ima minimalnu širinu 250px i maksimalnu 1fr (širina cijelog grida)*/
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/*after element je obojana, zakrivljena pozadina galerije*/
.gallery::after {
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  background: var(--color-primary-2);
  /*pozadina je viša od galerije za 7vmax - 7% dulje dimenzije viewporta zaslona*/
  height: calc(100% + 7vmax);
  min-width: 300vmax;
  z-index: -3;
  transform: rotate(2deg) translateX(-50%);
  border-radius: 30%;
}



::slotted(img) {
  width: 100%;
  height: 10rem;
  outline: 0px var(--color-primary-1) solid;
  transition: all 0.3s;
  object-position: center center;
  object-fit: cover;
  cursor: pointer;
}

::slotted(img.danger){
  outline: 0px var(--color-danger-2) solid;
}

::slotted(img:hover){
  outline-offset: 5px;
  outline-width: 3px;
  transform: scale(1.05);
}

.backdrop{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bigImg{
  min-width: 280px;
  max-width: 1000px;
  width: auto;
  z-index: 10;
}

</style>

<div class="gallery">
 <slot name="img"></slot>
</div>
`;

class Gallery extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(galleryTemplate.content.cloneNode(true));
    //treba odabrati sve slike za lazy loading unutar komponente jer se nalaze u shadow dom-u pa se ne mogu odabrati unutar observer.js skripte
    [this.lazyImages] = selectAll(this.$root, "*[data-src]");

    [this.gallery] = select(this.$root, ".gallery");
    this.gallery.addEventListener("click", e => this.showLargeImg(e));
  }
  //učitavanje slika počinje kad se element poveže na dom
  connectedCallback() {
    this.lazyImages.forEach(img => {
      if (!window.IntersectionObserver) {
        this.src = this.dataset.src;
      } else {
        img.onIntersection = function() {
          this.src = this.dataset.src;
        };
      }
    });

    this.observer = observe(
      { ...options, initialTransition: "", rootMargin: "100px" },
      ...this.lazyImages
    );
  }
  //observer se gasi kad je element "odspojen"
  disconnectedCallback() {
    this.observer && this.observer.disconnect();
  }

  //prikazuje kliknutu sliku uvećanih dimenzija
  showLargeImg(e) {
    //backdrop je tamna pozadina iza slike, služi za centriranje i isticanje slike
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("backdrop");
    const bigImg = document.createElement("img");
    bigImg.classList.add("bigImg");
    //velika slika je jednaka kliknutoj jer imaju isti src
    bigImg.src = e.target.src;
    this.$root.appendChild(this.backdrop);
    this.backdrop.appendChild(bigImg);
    //dodaje listener koji se aktivira kad se klikne izvan slike
    this.$root.addEventListener("click", e => this.removeLargeImg(e));
  }
  removeLargeImg(e) {
    //funkcija je prekinuta ako kliknuti element nije img
    if (!e.target.matches("img")) {
      this.$root.removeChild(this.backdrop);
      this.$root.removeEventListener("click", e => this.removeLargeImg(e));
    }
  }
}

customElements.define("ie-gallery", Gallery);
