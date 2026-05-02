"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${locale === "vi" ? "active" : ""}`}
        onClick={() => switchLocale("vi")}
        disabled={locale === "vi" || isPending}
        aria-label="Tiếng Việt"
      >
        VI
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${locale === "en" ? "active" : ""}`}
        onClick={() => switchLocale("en")}
        disabled={locale === "en" || isPending}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
