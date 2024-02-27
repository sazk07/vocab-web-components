class VocabularyComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const vocabTemplate = document.querySelector("template");
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "css/shadowstyle.css");
    shadow.appendChild(linkElem);
    shadow.appendChild(vocabTemplate.content.cloneNode(true));
  }
}
customElements.define("vocab-element", VocabularyComponent);
