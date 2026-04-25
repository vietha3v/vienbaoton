import Link from "next/link";
import CustomNavigation from "./CustomNavigation";

interface SiteHeaderProps {
  logo?: string | null;
  title?: string;
}

export default function SiteHeader({ logo, title }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="site-brand">
          <Link className="site-logo" href="/">
            {logo && (
              <img src={logo} alt={title || "Viện Bảo tồn Di tích"} className="logo-img-mark" />
            )}
            <div className="logo-text">
              <h1>Viện Bảo tồn Di tích</h1>
              <span>Heritage Conservation Institute</span>
            </div>
          </Link>
        </div>
        <nav className="site-nav">
          <CustomNavigation />
        </nav>
      </div>
    </header>
  );
}
