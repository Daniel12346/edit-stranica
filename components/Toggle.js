//prekidač koji mijenja temu stranice

const toggleTemplate = document.createElement("template");

toggleTemplate.innerHTML = ` <style>


/*styling nijednog dijela prekidača ne ovisi eksplicitno o stanju prekidača, nego sve ovisi o globalnim css varijablama,
 a prekidač ih mijenja promjenom svojstva html elementa*/


*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
}

/*unutar wrappera se nalazi prekidač, a sam wrapper služi samo za dodatni styling*/
.wrapper{
  /*pokazivač pokazuje korisniku da je prekidač moguće kliknuti*/
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

/*switch je unutrašnjost prekidača*/
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

/*pseudoelement after switch-a je okrugli, pokretni dio prekidača*/
/*u svom osnovnom stanju nalazi se na lijevoj strani switch-a*/
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

/*u aktivnom stanju switch::after se nalazi na desnoj strani*/
/*vrijednosti su -3% i 52% a ne 0% i 50% zbog uračunane širine switch::after-a*/
:host([toggled]) #switch::after{
  left: 53%;
}

</style>

<div class="wrapper">
  <div id="switch"></div>
</div>

`;

class Toggle extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(toggleTemplate.content.cloneNode(true));
    this.switch = this.$root.getElementById("switch");
  }
  connectedCallback() {
    //listener je dodan kad se element poveže s html dom-om
    this.switch.addEventListener("click", () => {
      this.toggle();
    });
    //stanje prekidača ovisi o dark-theme svojstvu html-a spremljenom u local storage, ako nije postavljeno koristi se svijetla tema
    this.toggled =
      window.localStorage.getItem("dark-theme") === "true" ? true : false;
  }

  //getter vraća vrijednost svosjstva toggled ili null
  get toggled() {
    if (!this.hasAttribute("toggled")) {
      return null;
    }
    return this.getAttribute("toggled");
  }
  //setter to svojsto daje ili oduzima elementu, ovisno je li dana vrijednost pretvorena u boolean true ili false
  set toggled(val) {
    val ? this.setAttribute("toggled", val) : this.removeAttribute("toggled");
  }

  //mijenja temu i sprema novu temu u svojstvo toggled i u local storage
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
