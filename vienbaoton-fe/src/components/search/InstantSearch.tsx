"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SearchResult } from "@/lib/ghost";

interface InstantSearchProps {
  initialQuery?: string;
  initialResults?: SearchResult[];
}

export default function InstantSearch({ initialQuery = "", initialResults = [] }: InstantSearchProps) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchApi = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        searchApi(query);
      }, 300); // Debounce 300ms
    } else {
      setResults([]);
      setHasSearched(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchApi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const groupedResults = {
    posts: results.filter(r => r.type === "post"),
    pages: results.filter(r => r.type === "page"),
    albums: results.filter(r => r.type === "album"),
  };

  return (
    <div className="instant-search">
      <form onSubmit={handleSubmit} className="instant-search-form">
        <div className="instant-search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="instant-search-input"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {isLoading && (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <span>{t("loading")}</span>
        </div>
      )}

      {!isLoading && !hasSearched && (
        <div className="search-suggestions">
          <h3 className="suggestions-title">Gợi ý tìm kiếm</h3>
          <div className="suggestion-tags">
            <button onClick={() => setQuery("bảo tồn")} className="suggestion-tag">bảo tồn</button>
            <button onClick={() => setQuery("di tích")} className="suggestion-tag">di tích</button>
            <button onClick={() => setQuery("tu bổ")} className="suggestion-tag">tu bổ</button>
            <button onClick={() => setQuery("di sản")} className="suggestion-tag">di sản</button>
            <button onClick={() => setQuery("hội thảo")} className="suggestion-tag">hội thảo</button>
            <button onClick={() => setQuery("nghệ thuật")} className="suggestion-tag">nghệ thuật</button>
          </div>
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3>{t("no_results_title")}</h3>
          <p>{t("no_results_desc")}</p>
        </div>
      )}

      {!isLoading && hasSearched && results.length > 0 && (
        <div className="search-results-container">
          <div className="search-results-header">
            <span className="results-count">{t("found_results", { count: results.length })}</span>
          </div>

          {/* Posts Section */}
          {groupedResults.posts.length > 0 && (
            <section className="results-section">
              <div className="section-header">
                <h3>
                  <span className="section-icon">📄</span>
                  {t("type_post")} ({groupedResults.posts.length})
                </h3>
              </div>
              <div className="results-list">
                {groupedResults.posts.map((result) => (
                  <a key={result.id} href={result.url} className="result-item">
                    {result.feature_image && (
                      <div className="result-image">
                        <Image
                          src={result.feature_image}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    )}
                    <div className="result-content">
                      <h4 className="result-title">{highlightText(result.title, query)}</h4>
                      {result.excerpt && (
                        <p className="result-excerpt">{highlightText(result.excerpt, query)}</p>
                      )}
                      <div className="result-meta">
                        <span className="result-date">
                          {new Date(result.published_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {groupedResults.albums.length > 0 && (
            <section className="results-section">
              <div className="section-header">
                <h3>
                  <span className="section-icon">🖼️</span>
                  {t("type_album")} ({groupedResults.albums.length})
                </h3>
              </div>
              <div className="results-grid">
                {groupedResults.albums.map((result) => (
                  <a key={result.id} href={result.url} className="result-card">
                    {result.feature_image ? (
                      <div className="card-image">
                        <Image
                          src={result.feature_image}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                    ) : (
                      <div className="card-image-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="card-content">
                      <h4 className="card-title">{highlightText(result.title, query)}</h4>
                      {result.excerpt && (
                        <p className="card-excerpt">{highlightText(result.excerpt, query)}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Pages Section */}
          {groupedResults.pages.length > 0 && (
            <section className="results-section">
              <div className="section-header">
                <h3>
                  <span className="section-icon">📃</span>
                  {t("type_page")} ({groupedResults.pages.length})
                </h3>
              </div>
              <div className="results-list">
                {groupedResults.pages.map((result) => (
                  <a key={result.id} href={result.url} className="result-item">
                    <div className="result-content">
                      <h4 className="result-title">{highlightText(result.title, query)}</h4>
                      {result.excerpt && (
                        <p className="result-excerpt">{highlightText(result.excerpt, query)}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
