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
}
nav{
    height: 5rem;
    background-color: gray;
    display: flex;
    align-items: center;
}

.links{
    display: flex;
    align-items: center;
    width: 100%;
    height: 70%;
    justify-content: space-evenly;
    list-style: none;
    flex-flow: row wrap;
}
a{
    text-decoration: none;
    color: white;
}

</style>


<nav>
<ul class="links">
 <li><a href="index.html">Početna</a></li>
 <li>Projekt</li>
 <li><a href="about.html">Dodaci</a></li>
 <li>O nama</li>
</ul>
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
