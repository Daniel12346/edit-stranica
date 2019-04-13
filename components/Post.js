const dvPostTemplate = document.createElement("template");
//use a top level img="src" attribute to enable lazy loading  (shadow.$img.src=this.getAttribute(img))
// TODO: intersection observer lazy loading
dvPostTemplate.innerHTML = ` <style>
:host {
  margin: var(--post-margin,3rem 0);
  display: flex;
  align-items: center;
}

*,
*::after,
*::before {
  /*TODO: find out if these rules do anything*/
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}


.post {
  background-color: var(--post-background-color, white);
  box-shadow: var(--post-box-shadow, 0 0.2rem 0.6rem rgba(0, 0, 0, 0.25));
  width: var(--post-width, 90vw);
  max-width: var(--post-max-width, 25rem);
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 9px;
  min-height: 10rem;
}

:host([expanded]) .post{
  width: var(--post-width-expanded,100vw);
  max-width: var(--max-width-expanded,50rem);
  box-shadow: var(--post-box-shadow-expanded, );
}

.container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.container > * {
  flex-basis: 100%;
}
.post__info {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

::slotted([slot=author]), ::slotted([slot=date]){
  margin: 1.4rem;
  display: flex;
  align-items: center;
  color: var(--secondary-info-color,#777);
  font-size: 0.9rem; 
  
}
:host([expanded]) ::slotted([slot=author]), ::slotted([slot=date]){
  margin: 1.2rem;
  font-size: 1.1rem;
}
@media(min-width: 720px){
  :host([expanded]) ::slotted([slot=author]), ::slotted([slot=date]){
    margin: 2rem;
  }
}

::slotted([slot=author]){
  order: var(--info-order, 2);
}

.post__img {
  object-fit: contain;
  width: 100%;
}

.post__img-container{
  margin-bottom: -1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

:host(:not([img-src])) .post__img{
  display: none;
}

::slotted([slot=title]) {
  padding: 0 1rem;
  margin: 3.6rem 0 0 0;
  flex: 1 0 90%;
  width: 90%;
  font-weight: 600;
  font-size: var(--text-font-size,1.4rem);
  color: var(--title-color,hsla(20deg,10%,20%,1));

  font-family: var(
    --title-font,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif
  );
}

:host([expanded]) ::slotted([slot=title]){
  padding 5rem;
  margin: 3rem 0 1rem 0;
  font-size: var(--title-font-size-expanded,1.4rem);
}

@media(min-width: 720px){
  :host([expanded]) ::slotted([slot=title]){
    margin: 6rem 2rem 1rem 2rem;
  }
}

::slotted([slot=paragraph]) {
  display: flex;
  font-weight: 400;
  line-height: 1.4rem;    
  color: var(--text-color,hsla(40deg,10%,25%,1));
  margin: -0.4rem 0 1rem 0;

  font-family: var(
    --text-font,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif
  );
}

:host([expanded]) ::slotted([slot=paragraph]){
  font-weight: var(--font-weight-expanded,300)
  line-height: 1.6rem;  
  margin: 0. 0.8rem 1.4rem 0.8rem;
  font-size: 1.2rem;
}

.post__text {
  width: 90%;
  margin: 0 -0.5rem 0 0;
}
</style>


<article class="post">
<div class="container">
  <div class="post__info">
    <slot class="post__author" name="author"></slot>
    <slot class="post__date" name="date"></slot>
  </div>
  <div>
    <div class="post__img-container">
      <img
        class="post__img"
       
      />
    </div>
  </div>

  <div class="post__text">
  <slot name="title" class="post__title title"></slot>
    <slot name="paragraph" class="post__paragraph paragraph">
    </slot>
  </div>
  
</div>
</article>`;
class Post extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(dvPostTemplate.content.cloneNode(true));
    this.$img = this._root.querySelector(".post__img");
  }
  connectedCallback() {
    this.$img.addEventListener("click", this._showLargeImg.bind(this));
    if (this.lazyImg) {
      this._lazyLoad(this.$img, this.imgSrc);
    } else {
      this.$img.src = this.imgSrc;
    }
  }
  disconnectedCallback() {
    this.$img.removeEventListener("click", this._showLargeImg.bind(this));
  }
  //we only need to get the actual value of the imgSrc attribute,
  get imgSrc() {
    if (!this.hasAttribute("img-src")) {
      return null;
    }
    return this.getAttribute("img-src");
  }
  set imgSrc(src) {
    src ? this.setAttribute("img-src", src) : this.removeAttribute("img-src");
  }
  get lazyImg() {
    return this.hasAttribute("lazy-img");
  }
  set lazyImg(val) {
    val ? this.setAttribute("lazy-img", "") : this.removeAttribute("lazy-img");
  }

  get expanded() {
    return this.hasAttribute("lazy-img");
  }
  set expanded(val) {
    val ? this.setAttribute("lazy-img", "") : this.removeAttribute("lazy-img");
  }

  static get observedAttributes() {
    return ["img-src", "lazy-img", "expanded"];
  }
  _showLargeImg() {
    const backdrop = document.createElement("div");
    const backdropStyle = `
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
    `;
    backdrop.setAttribute("style", backdropStyle);

    const imgStyle = `
 
    width: 75vw;
    z-index: 10;

    `;
    const bigImg = document.createElement("img");
    backdrop.setAttribute("style", backdropStyle);
    backdrop.setAttribute("id", "backdrop");
    bigImg.setAttribute("style", imgStyle);
    bigImg.src = this.$img.src;
    this._root.appendChild(backdrop);
    //the backdrop is the parent of the image, making the image eaasier to position and remove
    backdrop.appendChild(bigImg);
    this._root.addEventListener(
      "click",
      e => this._removeLargeImg.call(this, e) //(this, e)
    );
  }
  _removeLargeImg(e) {
    if (!e.target.matches("img")) {
      const backdrop = this._root.getElementById("backdrop");
      if (!backdrop) {
        return;
      }
      this._root.removeChild(backdrop);
      this._root.removeEventListener("click", e =>
        this._removeLargeImg.call(this, e)
      );
    }
  }
  //the parameters are the image to lazy load and the components's src attribute
  _lazyLoad(img, src) {
    const options = {
      //root is null, meaning the observer is watching for intersections with the viewport
      root: null,
      //the margin around the viewport (the instersection starts before the image is inside the  viewport)
      rootMargin: "50px",
      //threshold define when the callback will be called, using only one means the callback fires once,
      //when the intersection reaches 0.01
      threshold: 0.01
    };
    //self refers to the observer
    const callback = (entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          //setting the image's source (an image starts loading when its source is set)
          const { target } = entry;
          target.src = src;
          //disconnecting the observer once the image's src is set so it only loads once
          if (target.hasAttribute("src")) {
            self.disconnect();
          }
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(img);
  }
}

customElements.define("ie-post", Post);
