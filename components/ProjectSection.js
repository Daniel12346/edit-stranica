const sectionTemplate = document.createElement("template");
//use a top level img="src" attribute to enable lazy loading  (shadow.$img.src=this.getAttribute(img))
// TODO: intersection observer lazy loading
sectionTemplate.innerHTML = ` <style>

*,*::before,*::after{
    padding: 0;
    margin:0;
    box-sizing: border-box;
}

:host{
    display: block;    
    width:100%;
    transition: all 1s;
}

:host([mode=priroda]){
  background: green;
}

:host([mode=opasnosti]){
  background: red;
}

</style>


<article>
<slot name="button-priroda" class="button"></slot>
<slot name="button-opasnosti" class="button"></slot>

  <span>Pučišća</span>
  <slot name="priroda" id="priroda" class="text"></slot>

  <slot name="opasnosti" id="opasnosti" class="text"></slot>
</article>`;
class ProjectSection extends HTMLElement {
  constructor() {
    super();
    this.$root = this.attachShadow({ mode: "open" });
    this.$root.appendChild(sectionTemplate.content.cloneNode(true));
    [this.prirodaBtn, this.opasnostiBtn] = select(
      this.$root,
      "slot[name=button-priroda]",
      "slot[name=button-opasnosti]"
    );
    this.prirodaBtn.addEventListener("click", () => {
      this.mode = "priroda";
      alert(this.mode);
    });
    this.opasnostiBtn.addEventListener("click", () => {
      this.mode = "opasnosti";
      alert(this.mode);
    });
  }

  //TODO: sth

  get mode() {
    return this.getAttribute("mode") || null;
  }
  set mode(val) {
    val ? this.setAttribute("mode", val) : this.removeAttribute("mode");
  }

  static get observedAttributes() {
    return ["mode"];
  }
}

customElements.define("ie-project-section", ProjectSection);
