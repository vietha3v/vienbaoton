import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/shared/SectionHeader";

export default async function EventsSection() {
  const t = await getTranslations("HomePage");

  return (
    <section className="events-section">
      <SectionHeader
        title={t("events_title")}
        viewAllLink="/tag/su-kien"
        viewAllText={t("view_all")}
      />
      <div className="events-banner">
        <div className="events-banner-content">
          <h3>{t("events_banner_title")}</h3>
          <p>{t("events_banner_body")}</p>
          <Link href="/su-kien" className="btn-secondary">
            {t("events_button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
