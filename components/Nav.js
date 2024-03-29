//navigacija stranice
const navTemplate = document.createElement("template");

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
nav{  
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    /*prva sjena je tanka linija uz rub elementa, druga sjena je veća s većim spread radiusom*/
    box-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.15), 2px 2px 5px rgba(0,0,0,0.2);

}

nav:not(.mobile){
  position: relative;
  background: var(--color-nav)
}

button{
  display: flex;
  align-items: center;
  margin-left: 1rem;
  background: none;
  border: none;
  color: var(--color-white-1);
  border-radius: 50%
  cursor: pointer;
}

.links{
    display: flex;
    text-transform: uppercase;
    align-items: center;
    width: 100%;
    height: 70%;
    justify-content: space-evenly;
    list-style: none;
    flex-flow: row wrap;
}
a{
    text-decoration: none;
    color: var(--color-primary-1);
    padding: 1rem;
}

nav.mobile{
  display: none;
}

@media(min-width: 550px){
  nav{
    padding:0;
  }
  .links{
    height: 100%;
    padding:0;
  }
  li{
    display: inline-flex;
    height: 100%;
    align-items: center;
    transition: background 0.3s;
  }
  a{
    transition: color 0.3s;
    font-size: 1.2rem;

  }
  li:hover{
    background: var(--color-primary-3);
  }
  li:last-child:hover{
    background: inherit;
  }
  li:hover a{
    color: white;
  }

  /*isticanje linka u nav-u stranice na kojoj se korisnik nalazi*/
  
 :host([active=pocetna]) #pocetna{
  font-weight: bold;
  border: 2px var(--color-primary-3) solid;
 }
 :host([active=ekologija]) #ekologija{
  font-weight: bold;
  border: 2px var(--color-primary-3) solid;
  
 }
 :host([active=igra]) #igra{
  font-weight: bold;
  border: 2px var(--color-primary-3) solid;
 }
 :host([active=about]) #about{
  font-weight: bold;
  border: 2px var(--color-primary-3) solid;
 }
}

.toggle-wrapper{
display: flex;
align-items: center;
margin-right: 0.8rem;
}

ie-toggle{
  margin-right: 0.5rem;
}

@media(max-width: 549px){ 
  a{
  color: white;
  padding: 0.2rem;
  }
  #theme-toggle{
  display: none;
  }


  /* nav.mobile je novi navi na vrhu ekrana mobilnih uređaja, a stari, koji se koristi na većim zaslonima, na manjim zaslonima postaje nav koji prekriva cijeli zaslon kad je prikazan */
  nav.mobile{
    display: flex;
    background-color: var(--color-primary-3);
    justify-content: space-between;
  }

  :host nav:not(.mobile){
    font-size: 1.4rem;
    opacity: 0;
    position: fixed;
    height: 100vh;
    z-index: 11;
    pointer-events: none;
    transition: opacity 0.3s;

   :host nav:not(.mobile) a{
    color: white;
   } 

  }
  :host([open]) nav:not(.mobile){
    opacity: 1;
    max-height: 100vh;
    pointer-events: all;

  }

  :host([open]) button{
    position: fixed;
  }
  nav:not(.mobile){
    background: var(--gradient-1);
    height: 100%;
  }
  .links{
    padding: 7vh 0;
    height: 90%;
    max-height: 100vh;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
  }
  .links>*{
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      color: white;
      transition: transform 0.2s;
      position: relative;
      padding: 0.3rem;
  }
  .links>*::after {
      transform-origin: bottom left;
      transition: transform 0.2s;
      transform: scale(0);
      position: absolute;
      display: inline-block;
      content: "";
      width: 100%;
      height: 3px;
      background: white;
      bottom: -3px;
  }
  .links>*:hover::after{
      transform: scale(1);
  }
}


</style>

<nav>
<ul class="links">
 <li id="pocetna"><a href="index.html" >Početna</a></li>
 <li id="ekologija"><a href="ekologija.html">Ekologija</a></li>
 <li id="igra"><a href="igra.html">Igra</a></li>
 <li id="about"><a href="about.html">O nama</a></li>
 <li id="theme-toggle"><ie-toggle></ie-toggle></li>
</ul>
</nav>
<nav class="mobile">
<button style="z-index: 12;"><img src ="assets/menu.svg" id="menuIcon"/></button>
<div class="toggle-wrapper"><ie-toggle></ie-toggle> <span style="color: white">tema</span></div>

</nav>`;

class Nav extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(navTemplate.content.cloneNode(true));
    [this.button, this.menuIcon] = select(this.$root, "button", "#menuIcon");
    this.button.addEventListener("click", this.toggle.bind(this));
  }

  //atribut koji govori je li navigacija na mobilnom uređaju otvorena(prikazana) ili ne
  get open() {
    if (!this.hasAttribute("open")) {
      return null;
    }
    return this.getAttribute("open");
  }
  set open(val) {
    //ikona u lijevom kutu nav-a se mijenja ovisno boolean vrijednosti argumenta val
    this.menuIcon.src = `assets/${val ? "x" : "menu"}.svg`;
    //ako je val true (truth-y) navigacija se prikazuje, inače je skrivena
    val ? this.setAttribute("open", val) : this.removeAttribute("open");
  }

  toggle() {
    this.open = !this.open;
  }

  //trenutno aktivni link
  get active() {
    if (!this.hasAttribute("active")) {
      return null;
    }
    return this.getAttribute("active");
  }
  set active(val) {
    val ? this.setAttribute("active", val) : this.removeAttribute("active");
  }

  static get observedAttributes() {
    return ["open, active"];
  }
}

customElements.define("ie-nav", Nav);
