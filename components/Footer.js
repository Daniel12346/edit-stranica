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
    margin:0;
    overflow-x: hidden;
}


footer{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  background: var(--color-footer);
  min-height: 10vh;
  padding: 1rem;
  font-family: "Raleway",sans-serif;
  color: var(--color-white-1)
}

footer img{
  width: 15rem;
  transition: filter 0.4s;
  filter: grayscale(0.85);
  flex-basis: 300px;
  max-width: 20rem;
}

footer img:hover {
  filter: grayscale(0);
}

span{
  justify-self: center;
}


</style>

<footer>
  <img width="300px" src="../assets/ict.png" />  
  <span> ©2019 BračGoGreen</span>
</footer>`;

//footer nema nikakvu posebnu funkcionalnost
class Footer extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(footerTemplate.content.cloneNode(true));
  }
}

customElements.define("ie-footer", Footer);
