"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Loading");

  return (
    <div className="home-container text-center px-8 py-24"
    >
      <div className="text-[var(--text-muted)] italic"
      >
        {t("message")}
      </div>
    </div>
  );
}
