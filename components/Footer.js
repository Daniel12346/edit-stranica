const footerTemplate = document.createElement("template");

footerTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
    min-height: 15vh;
}


footer{
  display: flex;
  align-items: center;
  background: black;
  height: 18vh;
  margin-top: 10vh;

}

footer img{
  width: 15rem;
  transition: filter 0.4s;
  filter: grayscale(0.85);
}

footer img:hover {
  filter: grayscale(0);
}


</style>

<footer>
  <img width="300px" src="../assets/ict.png" />  
</footer>`;

class Footer extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(footerTemplate.content.cloneNode(true));
  }

  //TODO: sth
  get open() {
    if (!this.hasAttribute("open")) {
      return null;
    }
    return this.getAttribute("open");
  }
  set open(val) {
    val ? this.setAttribute("open", val) : this.removeAttribute("open");
  }

  toggle() {
    this.open = !this.open;
  }

  static get observedAttributes() {
    return ["open"];
  }
}

customElements.define("ie-footer", Footer);
