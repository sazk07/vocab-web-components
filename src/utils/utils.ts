import { isDataArray, type Data } from "../types/data.types";

export const fetchData = async (url: string) => {
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
