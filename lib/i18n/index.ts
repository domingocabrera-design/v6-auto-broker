import en from "./en.json";
import es from "./es.json";

export type Lang = "en" | "es";

const dictionaries = { en, es };

export function getDict(lang: Lang) {
  return dictionaries[lang];
}
