export const createSpan = (slot: string, text: string, parent: HTMLElement): void => {
  const vocabSpan = document.createElement("span");
  vocabSpan.setAttribute("slot", slot);
  vocabSpan.textContent = text;
  parent.appendChild(vocabSpan);
};

export const createLi = (slot: string, text: string, parent: HTMLElement): void => {
  const li = document.createElement("li");
  li.setAttribute("slot", slot);
  li.innerHTML = text;
  parent.appendChild(li);
};
