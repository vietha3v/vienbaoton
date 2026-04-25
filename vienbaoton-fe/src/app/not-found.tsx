import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "6rem 2rem" }}
    >
      <h1 style={{ fontSize: "4rem", color: "var(--accent-color)", marginBottom: "1rem" }}>
        404
      </h1>
      <h2 style={{ marginBottom: "1.5rem" }}>Trang không tìm thấy</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Có thể nội dung này đã được di chuyển hoặc không tồn tại.
      </p>
      <Link href="/" className="btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
