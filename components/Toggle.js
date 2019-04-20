const toggleTemplate = document.createElement("template");

toggleTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
}

.wrapper{
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  min-height: 1rem;
  height: 1.6rem;
  min-width: 3rem;
  border: 4px var(--color-secondary-1) solid;
  background-color: var(--color-bg-1);
  border-radius: 13px;
}

#switch{
 min-height: 0.5rem;
 height: 100%;
 display: inline-flex;
 align-items: center;
 background-color: var(--color-bg-1);
 width: 100%;
 border-radius: 8px;
 position: relative;
}

#switch::after {
  transition: left 0.3s;
  content: "";
  position: absolute;
  display: block;
  height: 100%;
  width: 50%;
  border-radius: 10px;
  background: var(--color-primary-3);
  top: 0;
  left: -3%;
}


:host([toggled]) #switch::after{
  left: 52%;
}

</style>

<div class="wrapper">
  <div id="switch"></div>
</div>
<span style="text-transform: none; position: relative; bottom: 3px;">tema</span>

`;

class Toggle extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(toggleTemplate.content.cloneNode(true));
    this.switch = this.$root.getElementById("switch");
  }
  connectedCallback() {
    this.switch.addEventListener("click", () => {
      this.toggle();
    });
    this.toggled =
      window.localStorage.getItem("dark-theme") === "true" ? true : false;
  }
  get toggled() {
    if (!this.hasAttribute("toggled")) {
      return null;
    }
    return this.getAttribute("toggled");
  }
  set toggled(val) {
    val ? this.setAttribute("toggled", val) : this.removeAttribute("toggled");
  }

  toggle() {
    const htmlRoot = document.querySelector("html");
    htmlRoot.dataset.dark = htmlRoot.dataset.dark === "true" ? "false" : "true";
    window.localStorage.setItem("dark-theme", htmlRoot.dataset.dark);
    this.toggled = htmlRoot.dataset.dark === "true";
  }

  static get observedAttributes() {
    return ["toggled"];
  }
}

customElements.define("ie-toggle", Toggle);
