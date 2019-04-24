const navTemplate = document.createElement("template");
//use a top level img="src" attribute to enable lazy loading  (shadow.$img.src=this.getAttribute(img))
// TODO: intersection observer lazy loading
navTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
}


</style>


<nav>
<div class="wrapper"></
</nav>`;
class Nav extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(navTemplate.content.cloneNode(true));
  }

  //TODO: sth
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
}

customElements.define("ie-nav", Nav);
