"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SearchBar({ compact = false }) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const handleSearchClick = () => {
    router.push("/tim-kiem");
  };

  if (compact) {
    return (
      <button
        className="search-toggle-btn"
        onClick={handleSearchClick}
        aria-label={t("open_search")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    );
  }

  return null;
}
