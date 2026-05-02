import Link from "next/link";
import { getTranslations } from "next-intl/server";
import CustomNavigation from "./CustomNavigation";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "@/components/search/SearchBar";

interface SiteHeaderProps {
  logo?: string | null;
  title?: string;
}

export default async function SiteHeader({ logo, title }: SiteHeaderProps) {
  const t = await getTranslations("Header");

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="site-brand">
          <Link className="site-logo" href="/">
            {logo && (
              <img src={logo} alt={t("site_name")} className="logo-img-mark" />
            )}
            <div className="logo-text">
              <h1>{t("site_name")}</h1>
              <span>{t("site_subtitle")}</span>
            </div>
          </Link>
        </div>
        <nav className="site-nav">
          <CustomNavigation />
        </nav>
        <div className="header-actions">
          <SearchBar compact />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
