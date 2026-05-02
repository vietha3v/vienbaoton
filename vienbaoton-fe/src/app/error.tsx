"use client";

import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "6rem 2rem" }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "var(--accent-color)",
          marginBottom: "1rem",
        }}
      >
        {t("title")}
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        {t("message")}
      </p>
      <button
        onClick={reset}
        className="btn-primary"
        style={{ border: "none", cursor: "pointer" }}
      >
        {t("retry")}
      </button>
    </div>
  );
}
