"use strict";

interface Data {
  word: string;
  definition: string | string[];
  mark?: string | string[];
  etym?: string | string[];
}

// Type guard function to validate if an object is of type Data
function isData(obj: unknown): obj is Data {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "word" in obj &&
    typeof obj.word === "string" &&
    "definition" in obj &&
    (typeof obj.definition === "string" || Array.isArray(obj.definition)) &&
    (!("mark" in obj) ||
      typeof obj.mark === "string" ||
      Array.isArray(obj.mark)) &&
    (!("etym" in obj) ||
      typeof obj.etym === "string" ||
      Array.isArray(obj.etym))
  );
}

// Type guard function to validate if an array contains only Data objects
function isDataArray(arr: unknown): arr is Data[] {
  return Array.isArray(arr) && arr.every((item) => isData(item));
}

const fetchData = async (url: string): Promise<Data[]> => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json() as Data[];
    if (!isDataArray(data)) {
      throw new Error("Invalid data format received from API");
    }
    const sortedData = data.sort((a: Data, b: Data): number => {
      const nameA = a.word.toUpperCase();
      const nameB = b.word.toUpperCase();
      if (!nameA || !nameB) {
        throw new Error("word not found");
      }
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return sortedData;
  } catch (error) {
    console.error((error as Error).message);
    return [];
  }
};

const createSpan = (slot: string, text: string, parent: HTMLElement): void => {
  const vocabSpan = document.createElement("span");
  vocabSpan.setAttribute("slot", slot);
  vocabSpan.textContent = text;
  parent.appendChild(vocabSpan);
};

const createLi = (slot: string, text: string, parent: HTMLElement): void => {
  const li = document.createElement("li");
  li.setAttribute("slot", slot);
  li.innerHTML = text;
  parent.appendChild(li);
};

const main = async (): Promise<void> => {
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
void main();
