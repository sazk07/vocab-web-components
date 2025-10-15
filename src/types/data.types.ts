export interface ButtonSettings {
  buttonEl: Element;
  isDark: boolean;
}

export interface Settings {
  localStorageTheme: string | null;
  sysSettingsDark: MediaQueryList;
}

export interface Data {
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
export function isDataArray(arr: unknown): arr is Data[] {
  return Array.isArray(arr) && arr.every((item) => isData(item));
}
