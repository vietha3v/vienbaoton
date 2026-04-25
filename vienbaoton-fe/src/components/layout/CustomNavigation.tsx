"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    href: "/gioi-thieu",
    children: [
      { label: "Lịch sử hình thành", href: "/lich-su-hinh-thanh" },
      { label: "Chức năng – nhiệm vụ", href: "/chuc-nang-nhiem-vu" },
      { label: "Sứ mệnh – tầm nhìn", href: "/su-menh-tam-nhin" },
      {
        label: "Cơ cấu tổ chức",
        href: "/co-cau-to-chuc",
        children: [
          { label: "Ban lãnh đạo", href: "/ban-lanh-dao" },
          { label: "Các phòng chuyên môn", href: "/cac-phong-chuyen-mon" },
          { label: "Đơn vị trực thuộc", href: "/don-vi-truc-thuoc" },
        ],
      },
      { label: "Thành tựu nổi bật", href: "/thanh-tuu-noi-bat" },
      { label: "Hợp tác quốc tế", href: "/hop-tac-quoc-te" },
    ],
  },
  {
    label: "Tin tức",
    href: "/tin-tuc-su-kien",
    children: [
      { label: "Tin hoạt động Viện", href: "/tin-hoat-dong-vien" },
      { label: "Tin chỉ đạo Bộ", href: "/tin-chi-dao-bo" },
      { label: "Hội thảo – khoa học", href: "/hoi-thao-khoa-hoc" },
      { label: "Thông báo", href: "/thong-bao" },
      { label: "Báo chí viết về Viện", href: "/bao-chi-viet-ve-vien" },
    ],
  },
  {
    label: "Nghiên cứu",
    href: "/nghien-cuu-khoa-hoc",
    children: [
      { label: "Đề tài cấp Nhà nước", href: "/de-tai-cap-nha-nuoc" },
      { label: "Đề tài cấp Bộ", href: "/de-tai-cap-bo" },
      { label: "Nhiệm vụ thường xuyên", href: "/nhiem-vu-thuong-xuyen" },
      { label: "Dự án hợp tác quốc tế", href: "/du-an-hop-tac-quoc-te" },
      { label: "Hồ sơ UNESCO", href: "/ho-so-unesco" },
      { label: "Ấn phẩm khoa học", href: "/an-pham-khoa-hoc" },
    ],
  },
  {
    label: "Hoạt động",
    href: "/hoat-dong-chuyen-mon",
    children: [
      { label: "Lập hồ sơ khoa học di tích", href: "/lap-ho-so-khoa-hoc" },
      { label: "Khảo sát – đánh giá hiện trạng", href: "/khao-sat-danh-gia" },
      { label: "Tu bổ – phục hồi di tích", href: "/tu-bo-phuc-hoi" },
      { label: "Tư vấn thiết kế", href: "/tu-van-thiet-ke" },
      {
        label: "Dự án tiêu biểu",
        href: "/du-an-tieu-bieu",
        children: [
          { label: "Di tích", href: "/du-an-di-tich" },
          { label: "Tư liệu", href: "/du-an-tu-lieu" },
          { label: "Di sản tư liệu trong di tích", href: "/di-san-tu-lieu-trong-di-tich" },
        ],
      },
    ],
  },
  {
    label: "Đào tạo",
    href: "/dao-tao-boi-duong",
    children: [
      { label: "Giới thiệu chương trình", href: "/gioi-thieu-chuong-trinh" },
      { label: "Lớp đang chiêu sinh", href: "/lop-dang-chieu-sinh" },
      { label: "Lịch khai giảng", href: "/lich-khai-giang" },
      { label: "Nội dung khóa học", href: "/noi-dung-khoa-hoc" },
      { label: "Đăng ký trực tuyến", href: "/dang-ky-truc-tuyen" },
      { label: "Tài liệu học tập", href: "/tai-lieu-hoc-tap" },
      { label: "Câu hỏi thường gặp (FAQ)", href: "/faq" },
      { label: "Chia sẻ của học viên", href: "/chia-se-hoc-vien" },
    ],
  },
  {
    label: "Tra cứu",
    href: "/tra-cuu",
    children: [
      { label: "Tìm kiếm nhanh", href: "/tim-kiem-nhanh" },
      { label: "Tìm kiếm nâng cao", href: "/tim-kiem-nang-cao" },
      {
        label: "Ngân hàng dữ liệu số",
        href: "/ngan-hang-du-lieu",
        children: [
          { label: "CSDL Di tích", href: "/csdl-di-tich" },
          { label: "CSDL Hồ sơ tu bổ", href: "/csdl-ho-so-tu-bo" },
          { label: "Ngân hàng hình ảnh - bản vẽ", href: "/ngan-hang-hinh-anh" },
          { label: "Thư viện số chuyên ngành", href: "/thu-vien-so" },
        ],
      },
    ],
  },
  {
    label: "Liên hệ",
    href: "/lien-he",
    children: [
      { label: "Thông tin liên hệ", href: "/thong-tin-lien-he" },
      { label: "Bản đồ", href: "/ban-do" },
      { label: "Form gửi yêu cầu", href: "/form-gui-yeu-cau" },
      { label: "Thông tin phụ trách chuyên môn", href: "/phu-trach-chuyen-mon" },
    ],
  },
];

function renderNavItems(items: NavItem[], isMobile = false): React.ReactNode {
  return items.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <li key={item.href} className="has-dropdown">
          <Link href={item.href}>{item.label}</Link>
          <ul className={`dropdown${isMobile ? "" : ""}`}>
            {renderNavItems(item.children, isMobile)}
          </ul>
        </li>
      );
    }
    return (
      <li key={item.href}>
        <Link href={item.href}>{item.label}</Link>
      </li>
    );
  });
}

export default function CustomNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <ul className="nav-menu desktop-nav">{renderNavItems(navItems)}</ul>

      {/* Mobile Toggle Button */}
      <button className="mobile-menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        ☰
      </button>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-panel">
            <div className="mobile-nav-close">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
            </div>
            <ul className="nav-menu">
              {navItems.map((item) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <li key={item.href} className="has-dropdown">
                      <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                      <ul className="dropdown open">
                        {item.children.map((child) => {
                          if (child.children && child.children.length > 0) {
                            return (
                              <li key={child.href} className="has-dropdown">
                                <Link href={child.href} onClick={() => setMobileOpen(false)}>{child.label}</Link>
                                <ul className="dropdown open">
                                  {child.children.map((sub) => (
                                    <li key={sub.href}>
                                      <Link href={sub.href} onClick={() => setMobileOpen(false)}>{sub.label}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            );
                          }
                          return (
                            <li key={child.href}>
                              <Link href={child.href} onClick={() => setMobileOpen(false)}>{child.label}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
