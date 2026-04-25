import Link from "next/link";

export default function InstituteIntro() {
  return (
    <section className="institute-intro">
      <div className="intro-grid">
        <div className="intro-content">
          <h2 className="intro-title">
            Giữ gìn nền móng văn hiến – Kiến tạo giá trị tương lai.
          </h2>
          <p>
            Khẳng định vị thế là cơ quan nghiên cứu khoa học chuyên ngành hàng đầu quốc gia, Viện Bảo tồn Di tích
            tự hào mang trên vai sứ mệnh lịch sử: Nghiên cứu, khảo sát, lập quy hoạch và thiết kế tu bổ, tôn tạo
            các quần thể di tích kiến trúc cổ và các công trình mang đậm dấu ấn văn hóa dân tộc.
          </p>
          <Link href="/gioi-thieu" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Hành trình 40 năm của Viện
          </Link>
        </div>
        <div className="intro-stats">
          <div className="stat-item">
            <span className="stat-number">40+</span>
            <span className="stat-label">Năm cống hiến & phát triển</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Dự án trùng tu cấp Quốc gia</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">14+</span>
            <span className="stat-label">Luận án & Đề tài Khoa học</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Di sản Thế giới được bảo tồn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
