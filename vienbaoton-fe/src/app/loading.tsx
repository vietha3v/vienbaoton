"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Loading");

  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "6rem 2rem" }}
    >
      <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
        {t("message")}
      </div>
    </div>
  );
}
