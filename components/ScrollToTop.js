const scrollToTopTemplate = document.createElement("template");

scrollToTopTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:90vw;
    height: 0;
}


#scrollMark{
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  position: relative;
  top: 150vh;
  width: 100%;
}

#scrollButton{
  position: fixed;
  top: 80vh;
  right: 5vh;
  opacity: 0;
  transition: opacity 0.3s;
  background: var(--color-primary-2);
  pointer-events: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  color: var(--color-text-2);
  border: none;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.3) 
  
}

:host([shown]) #scrollButton{
  opacity: 1;
  pointer-events: all;
}

</style>

  <div id="scrollMark">E</div>  
  <button id="scrollButton">^</div>

`;

class scrollToTop extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(scrollToTopTemplate.content.cloneNode(true));
    this.scrollButton = this.$root.getElementById("scrollButton");
    this.scrollMark = this.$root.getElementById("scrollMark");
  }

  connectedCallback() {
    this.shown = false;
    const callback = (entries, observer) => {
      if (entries[0].isIntersecting) {
        this.shown = !this.shown;
      }
    };

    const options = {
      root: null,
      thresholds: 1
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.scrollMark);
    this.scrollButton.addEventListener("click", () => {
      this.scrollToTop();
    });
  }
  get shown() {
    return this.hasAttribute("shown");
  }
  set shown(val) {
    val ? this.setAttribute("shown", val) : this.removeAttribute("shown");
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  static get observedAttributes() {
    return ["shown"];
  }
}

customElements.define("ie-scroll-to-top", scrollToTop);
