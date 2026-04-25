"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="home-container"
      style={{ textAlign: "center", padding: "6rem 2rem" }}
    >
      <h1 style={{ fontSize: "2rem", color: "var(--accent-color)", marginBottom: "1rem" }}>
        Đã xảy ra lỗi
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Không thể tải nội dung. Vui lòng thử lại sau.
      </p>
      <button
        onClick={reset}
        className="btn-primary"
        style={{ border: "none", cursor: "pointer" }}
      >
        Thử lại
      </button>
    </div>
  );
}
