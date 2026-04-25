import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";

export default function EventsSection() {
  return (
    <section className="events-section">
      <SectionHeader title="Hội thảo & Sự kiện" viewAllLink="/tag/su-kien" />

      <div className="events-banner">
        <div className="events-banner-content">
          <h3>Chuỗi sự kiện bảo tồn Di sản văn hóa phi vật thể 2026</h3>
          <p>Tham gia cùng các chuyên gia hàng đầu trong và ngoài nước.</p>
          <Link href="/su-kien" className="btn-secondary">
            Tìm hiểu thêm
          </Link>
        </div>
      </div>
    </section>
  );
}
