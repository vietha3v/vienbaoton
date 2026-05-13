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
    <div className="home-container text-center px-8 py-24"
    >
      <h1 className="text-[2rem] text-[var(--accent-color)] mb-4"
      >
        {t("title")}
      </h1>
      <p className="text-[var(--text-muted)] mb-8"
      >
        {t("message")}
      </p>
      <button
        onClick={reset}
        className="btn-primary border-none cursor-pointer"
      >
        {t("retry")}
      </button>
    </div>
  );
}
