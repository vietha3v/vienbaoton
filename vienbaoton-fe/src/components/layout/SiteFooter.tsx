import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { getTags, getRecentPosts } from "@/lib/ghost";

export default async function SiteFooter() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();
  let tags: { name: string; slug: string; count?: { posts: number } }[] = [];
  let recentPosts: { title: string; slug: string }[] = [];

  try {
    [tags, recentPosts] = await Promise.all([
      getTags(),
      getRecentPosts(locale),
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
            <p>{t("tagline")}</p>
            <ul className="contact-list">
              <li><strong>{t("address_label")}</strong> {t("address")}</li>
              <li><strong>{t("phone_label")}</strong> {t("phone")}</li>
              <li><strong>{t("email_label")}</strong> {t("email")}</li>
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>{t("categories_heading")}</h4>
            <ul className="clean-list">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link href={`/tag/${tag.slug}`}>
                      {tag.name}{" "}
                      {tag.count && (
                        <span className="text-[0.8rem] opacity-60">
                          ({tag.count.posts})
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li><Link href="/">{t("updating")}</Link></li>
              )}
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>{t("recent_heading")}</h4>
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
                <li><Link href="/">{t("preserving")}</Link></li>
              )}
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>{t("links_heading")}</h4>
            <ul className="clean-list">
              <li><Link href="/tra-cuu">{t("link_reference")}</Link></li>
              <li><Link href="/thu-vien-so">{t("link_library")}</Link></li>
              <li><Link href="/ngan-hang-hinh-anh">Ngân hàng hình ảnh</Link></li>
              <li><Link href="/tags">Danh mục</Link></li>
              <li><Link href="/lien-he">{t("link_contact")}</Link></li>
              <li><Link href="/faq">{t("link_faq")}</Link></li>
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
