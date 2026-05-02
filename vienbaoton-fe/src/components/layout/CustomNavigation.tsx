"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/search/SearchBar";

type NavItem = {
  i18nKey: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { i18nKey: "home", href: "/" },
  {
    i18nKey: "about",
    href: "/gioi-thieu",
    children: [
      { i18nKey: "about_history", href: "/lich-su-hinh-thanh" },
      { i18nKey: "about_functions", href: "/chuc-nang-nhiem-vu" },
      { i18nKey: "about_mission", href: "/su-menh-tam-nhin" },
      { i18nKey: "about_structure", href: "/co-cau-to-chuc" },
      { i18nKey: "about_achievements", href: "/thanh-tuu-noi-bat" },
      { i18nKey: "about_cooperation", href: "/hop-tac-quoc-te" },
    ],
  },
  {
    i18nKey: "news",
    href: "/tin-tuc-su-kien",
    children: [
      { i18nKey: "news_activities", href: "/tin-hoat-dong-vien" },
      { i18nKey: "news_directives", href: "/tin-chi-dao-bo" },
      { i18nKey: "news_seminars", href: "/hoi-thao-khoa-hoc" },
      { i18nKey: "news_announcements", href: "/thong-bao" },
      { i18nKey: "news_press", href: "/bao-chi-viet-ve-vien" },
    ],
  },
  {
    i18nKey: "research",
    href: "/nghien-cuu-khoa-hoc",
    children: [
      { i18nKey: "research_national", href: "/de-tai-cap-nha-nuoc" },
      { i18nKey: "research_ministerial", href: "/de-tai-cap-bo" },
      { i18nKey: "research_routine", href: "/nhiem-vu-thuong-xuyen" },
      { i18nKey: "research_international", href: "/du-an-hop-tac-quoc-te" },
      { i18nKey: "research_unesco", href: "/ho-so-unesco" },
      { i18nKey: "research_publications", href: "/an-pham-khoa-hoc" },
    ],
  },
  {
    i18nKey: "other",
    href: "#",
    children: [
      {
        i18nKey: "other_activities",
        href: "/hoat-dong-chuyen-mon",
        children: [
          { i18nKey: "other_activities_dossiers", href: "/lap-ho-so-khoa-hoc" },
          { i18nKey: "other_activities_survey", href: "/khao-sat-danh-gia" },
          { i18nKey: "other_activities_restoration", href: "/tu-bo-phuc-hoi" },
          { i18nKey: "other_activities_design", href: "/tu-van-thiet-ke" },
          { i18nKey: "other_activities_projects", href: "/du-an-tieu-bieu" },
        ],
      },
      {
        i18nKey: "other_training",
        href: "/dao-tao-boi-duong",
        children: [
          { i18nKey: "other_training_programs", href: "/gioi-thieu-chuong-trinh" },
          { i18nKey: "other_training_enrolling", href: "/lop-dang-chieu-sinh" },
          { i18nKey: "other_training_schedule", href: "/lich-khai-giang" },
          { i18nKey: "other_training_curriculum", href: "/noi-dung-khoa-hoc" },
          { i18nKey: "other_training_register", href: "/dang-ky-truc-tuyen" },
        ],
      },
      {
        i18nKey: "other_reference",
        href: "/tra-cuu",
        children: [
          { i18nKey: "other_reference_search", href: "/tim-kiem" },
          { i18nKey: "other_reference_db", href: "/csdl-di-tich" },
          { i18nKey: "other_reference_restoration_db", href: "/csdl-ho-so-tu-bo" },
          { i18nKey: "other_reference_images", href: "/ngan-hang-hinh-anh" },
          { i18nKey: "other_reference_library", href: "/thu-vien-so" },
        ],
      },
    ],
  },
  {
    i18nKey: "contact",
    href: "/lien-he",
    children: [
      { i18nKey: "contact_info", href: "/thong-tin-lien-he" },
      { i18nKey: "contact_map", href: "/ban-do" },
      { i18nKey: "contact_request", href: "/form-gui-yeu-cau" },
      { i18nKey: "contact_specialist", href: "/phu-trach-chuyen-mon" },
    ],
  },
];

function renderNavItems(
  items: NavItem[],
  t: (key: string) => string
): React.ReactNode {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <li key={item.href} className="has-dropdown">
          <Link href={item.href}>{t(item.i18nKey)}</Link>
          <ul className="dropdown">
            {renderNavItems(item.children, t)}
          </ul>
        </li>
      );
    }
    return (
      <li key={item.href}>
        <Link href={item.href}>{t(item.i18nKey)}</Link>
      </li>
    );
  });
}

function renderMobileItems(
  items: NavItem[],
  t: (key: string) => string,
  onClose: () => void
): React.ReactNode {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <li key={item.href} className="has-dropdown">
          <Link href={item.href} onClick={onClose}>
            {t(item.i18nKey)}
          </Link>
          <ul className="dropdown open">
            {renderMobileItems(item.children, t, onClose)}
          </ul>
        </li>
      );
    }
    return (
      <li key={item.href}>
        <Link href={item.href} onClick={onClose}>
          {t(item.i18nKey)}
        </Link>
      </li>
    );
  });
}

export default function CustomNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Navigation");

  return (
    <>
      {/* Desktop Navigation */}
      <ul className="nav-menu desktop-nav">{renderNavItems(navItems, t)}</ul>

      {/* Mobile Toggle Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-nav-panel">
            <div className="mobile-nav-close">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="nav-menu">
              {renderMobileItems(navItems, t, () => setMobileOpen(false))}
            </ul>
            <div className="mobile-search">
              <SearchBar />
            </div>
          </div>
        </>
      )}
    </>
  );
}
