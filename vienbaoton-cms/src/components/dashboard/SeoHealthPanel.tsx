import Link from "next/link";

interface SeoHealthItem {
  id: string;
  title: string;
  slug: string;
  type: "post" | "page";
}

interface SeoMetric {
  label: string;
  count: number;
  items: SeoHealthItem[];
  icon: string;
  color: string;
}

interface SeoHealthPanelProps {
  seoHealth: {
    metaTitleMissing: { count: number; items: SeoHealthItem[] };
    metaDescriptionMissing: { count: number; items: SeoHealthItem[] };
    featureImageMissing: { count: number; items: SeoHealthItem[] };
    excerptMissing: { count: number; items: SeoHealthItem[] };
    ogImageMissing: { count: number; items: SeoHealthItem[] };
    tagsMissing: { count: number; items: SeoHealthItem[] };
  };
  overview: {
    postsWithMetaTitle: number;
    postsWithoutMetaTitle: number;
    postsWithMetaDescription: number;
    postsWithoutMetaDescription: number;
    postsWithFeatureImage: number;
    postsWithoutFeatureImage: number;
    postsWithExcerpt: number;
    postsWithoutExcerpt: number;
    postsWithOgImage: number;
    postsWithoutOgImage: number;
    totalPosts: number;
    totalPages: number;
  };
}

export default function SeoHealthPanel({ seoHealth, overview }: SeoHealthPanelProps) {
  const totalContent = overview.totalPosts + overview.totalPages;

  const metrics: SeoMetric[] = [
    {
      label: "Thiếu Meta Title",
      count: seoHealth.metaTitleMissing.count,
      items: seoHealth.metaTitleMissing.items,
      icon: "T",
      color: "#dc2626",
    },
    {
      label: "Thiếu Meta Description",
      count: seoHealth.metaDescriptionMissing.count,
      items: seoHealth.metaDescriptionMissing.items,
      icon: "D",
      color: "#ea580c",
    },
    {
      label: "Thiếu Ảnh đại diện",
      count: seoHealth.featureImageMissing.count,
      items: seoHealth.featureImageMissing.items,
      icon: "I",
      color: "#ca8a04",
    },
    {
      label: "Thiếu Excerpt",
      count: seoHealth.excerptMissing.count,
      items: seoHealth.excerptMissing.items,
      icon: "E",
      color: "#2563eb",
    },
    {
      label: "Thiếu OG Image",
      count: seoHealth.ogImageMissing.count,
      items: seoHealth.ogImageMissing.items,
      icon: "OG",
      color: "#7c3aed",
    },
    {
      label: "Bài viết thiếu Tag",
      count: seoHealth.tagsMissing.count,
      items: seoHealth.tagsMissing.items,
      icon: "#",
      color: "#0891b2",
    },
  ];

  const healthScore = totalContent > 0
    ? Math.round(
        ((totalContent -
          (seoHealth.metaTitleMissing.count +
            seoHealth.metaDescriptionMissing.count +
            seoHealth.featureImageMissing.count +
            seoHealth.excerptMissing.count +
            seoHealth.ogImageMissing.count)) /
          totalContent) *
          100
      )
    : 100;

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Sức khỏe SEO</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-secondary)]">Điểm SEO tổng quan</span>
          <span
            className="text-2xl font-bold"
            style={{ color: healthScore >= 80 ? "#166534" : healthScore >= 50 ? "#ca8a04" : "#dc2626" }}
          >
            {healthScore}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const percent = totalContent > 0 ? Math.round((m.count / totalContent) * 100) : 0;
          return (
            <div
              key={m.label}
              className="rounded-lg border border-[var(--color-border)] p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.icon}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {m.label}
                  </span>
                </div>
                <span className="text-lg font-bold" style={{ color: m.color }}>
                  {m.count}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: m.color,
                    opacity: 0.7,
                  }}
                />
              </div>
              {m.items.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {m.items.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href={`http://localhost:3000/${item.slug}`}
                      target="_blank"
                      className="block text-xs text-[var(--color-accent)] hover:underline truncate"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                  ))}
                  {m.items.length > 5 && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      +{m.items.length - 5} khác
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
