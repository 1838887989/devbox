import zh from "./zh";
import en from "./en";

export type Locale = "zh" | "en";
export type TranslationKey = keyof typeof zh;

const messages: Record<Locale, Record<TranslationKey, string>> = { zh, en };

export default messages;
