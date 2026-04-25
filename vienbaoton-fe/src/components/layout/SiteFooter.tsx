import Link from "next/link";
import { getTags, getRecentPosts } from "@/lib/ghost";

export default async function SiteFooter() {
  let tags: { name: string; slug: string; count?: { posts: number } }[] = [];
  let recentPosts: { title: string; slug: string }[] = [];

  try {
    [tags, recentPosts] = await Promise.all([
      getTags(),
      getRecentPosts(),
    ]);
  } catch {
    // Footer renders fine with empty lists
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-col brand-col">
            <h3>Viện Bảo tồn Di tích</h3>
            <p>Giữ gìn nền móng văn hiến. Kiến tạo giá trị tương lai.</p>
            <ul className="contact-list">
              <li><strong>Địa chỉ:</strong> 489 Nguyễn Trãi, Thanh Xuân, Hà Nội</li>
              <li><strong>Điện thoại:</strong> (024) 3858 5225</li>
              <li><strong>Email:</strong> vienbaotonditich@vhttdl.gov.vn</li>
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>Chuyên Mục Chính</h4>
            <ul className="clean-list">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link href={`/tag/${tag.slug}`}>
                      {tag.name}{" "}
                      {tag.count && (
                        <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>
                          ({tag.count.posts})
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li><Link href="/">Đang cập nhật...</Link></li>
              )}
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>Mới Cập Nhật</h4>
            <ul className="clean-list">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/${post.slug}`} title={post.title}>
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li><Link href="/">Đang bảo tồn văn bản...</Link></li>
              )}
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>Liên Kết & Tra Cứu</h4>
            <ul className="clean-list">
              <li><Link href="/tra-cuu">Tra cứu di tích</Link></li>
              <li><Link href="/thu-vien-so">Thư viện số</Link></li>
              <li><Link href="/lien-he">Liên hệ</Link></li>
              <li><Link href="/faq">Hỏi đáp</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/">Viện Bảo tồn Di tích</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
