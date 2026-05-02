"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "6rem 2rem" }}
    >
      <h1
        style={{
          fontSize: "4rem",
          color: "var(--accent-color)",
          marginBottom: "1rem",
        }}
      >
        {t("title")}
      </h1>
      <h2 style={{ marginBottom: "1.5rem" }}>{t("heading")}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        {t("message")}
      </p>
      <Link href="/" className="btn-primary">
        {t("home_link")}
      </Link>
    </div>
  );
}
