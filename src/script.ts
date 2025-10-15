import { createLi, createSpan } from "./utils/custom_ui";
import { fetchData } from "./utils/utils";

const main = async () => {
  const mainElem =
    document.querySelector("main") ?? document.createElement("main");
  const data = await fetchData("data/data.json");
  if (data instanceof Error) {
    mainElem.textContent = data.message;
    return;
  }
  for (const elem of data) {
    const { word, definition, mark, etym } = elem;
    // create custom elem
    const vocabElement = document.createElement("vocab-element");
    mainElem.appendChild(vocabElement);
    createSpan("vocab", word, vocabElement);

    // check if elem definition is in array form
    const definitions = Array.isArray(definition) ? definition : [definition];
    for (const def of definitions) {
      createLi("definition", def, vocabElement);
    }

    // check if elem mark is in array form
    if (mark) {
      const marks = Array.isArray(mark) ? mark : [mark];
      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i] ?? "";
        const currentEtym = Array.isArray(etym)
          ? (etym[i] ?? "")
          : (etym ?? "");
        const concatEtym = `<mark>${mark}</mark>: <span>${currentEtym}</span>`;
        createLi("etym", concatEtym, vocabElement);
      }
    }

    // close previous details element if new vocab element clicked
    vocabElement.addEventListener("click", (e) => {
      const allVocabs = document.querySelectorAll("vocab-element");
      for (const vocab of allVocabs) {
        if (vocab !== e.currentTarget) {
          const details = vocab.shadowRoot?.querySelector("details");
          if (!vocab.shadowRoot) {
            console.error("vocab shadow root not found");
            return;
          }
          if (!details) {
            console.error("details not found");
            return;
          }
          if (details.open) {
            details.removeAttribute("open");
          }
        }
      }
    });
  }
};

try {
  await main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  const p = document.createElement("p");
  p.textContent = msg;
  document.body.appendChild(p);
}
