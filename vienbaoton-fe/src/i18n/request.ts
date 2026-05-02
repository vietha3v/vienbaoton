import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import vi from "../messages/vi.json";
import en from "../messages/en.json";

const messages: Record<string, Record<string, unknown>> = {
  vi,
  en,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "vi" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});
