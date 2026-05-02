import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function InstituteIntro() {
  const t = await getTranslations("HomePage");

  return (
    <section className="institute-intro">
      <div className="intro-grid">
        <div className="intro-content">
          <h2 className="intro-title">{t("intro_title")}</h2>
          <p>{t("intro_body")}</p>
          <Link
            href="/gioi-thieu"
            className="btn-primary"
            style={{ marginTop: "1rem", display: "inline-block" }}
          >
            {t("intro_button")}
          </Link>
        </div>
        <div className="intro-stats">
          <div className="stat-item">
            <span className="stat-number">40+</span>
            <span className="stat-label">{t("stat_years")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">{t("stat_projects")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">14+</span>
            <span className="stat-label">{t("stat_theses")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">{t("stat_heritage")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
