"use strict";

class VocabularyComponent extends HTMLElement {
  connectedCallback() {
    try {
      const shadow = this.attachShadow({ mode: "open" });
      const vocabTemplate = document.querySelector("template");
      if (!vocabTemplate) {
        throw new Error("vocab template not found");
      }
      const linkElem = document.createElement("link");
      linkElem.setAttribute("rel", "stylesheet");
      linkElem.setAttribute("href", "css/shadowstyle.css");
      shadow.appendChild(linkElem);
      shadow.appendChild(vocabTemplate.content.cloneNode(true));
    } catch (e) {
      console.error((e as Error).message);
    }
  }
}
customElements.define("vocab-element", VocabularyComponent);
