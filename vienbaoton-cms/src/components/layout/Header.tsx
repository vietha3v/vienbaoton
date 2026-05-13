export default function Header() {
  return (
    <header className="topbar">
      <span className="topbar-title">Bảng điều khiển</span>
      <a
        href="http://localhost:2368/ghost"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent font-medium"
      >
        Mở Ghost Admin →
      </a>
    </header>
  );
}
