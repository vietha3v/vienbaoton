"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="home-container text-center px-8 py-24"
    >
      <h1 className="text-[4rem] text-[var(--accent-color)] mb-4"
      >
        {t("title")}
      </h1>
      <h2 className="mb-6"
      >{t("heading")}</h2>
      <p className="text-[var(--text-muted)] mb-8"
      >
        {t("message")}
      </p>
      <Link href="/" className="btn-primary">
        {t("home_link")}
      </Link>
    </div>
  );
}
