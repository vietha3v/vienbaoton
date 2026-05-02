import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import InstantSearch from "@/components/search/InstantSearch";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Tìm kiếm",
  description: "Tìm kiếm nội dung trên website Viện Bảo tồn Di tích",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations("Search");
  const params = await searchParams;
  const query = params.q || "";

  return (
    <div className="search-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-subtitle">{t("subtitle")}</p>
        </div>
      </div>

      <section className="search-section">
        <div className="container">
          <Suspense>
            <InstantSearch initialQuery={query} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
