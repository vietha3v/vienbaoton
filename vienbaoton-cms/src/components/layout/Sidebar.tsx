"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Tổng quan", icon: "🏠" },
  { href: "/posts", label: "Bài viết", icon: "📝" },
  { href: "/pages", label: "Trang tĩnh", icon: "📄" },
  { href: "/tags", label: "Thẻ", icon: "🏷️" },
  { href: "/authors", label: "Tác giả", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">VienBaoTon CMS</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
