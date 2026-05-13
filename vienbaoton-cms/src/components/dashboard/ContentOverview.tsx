import Link from "next/link";

interface OverviewStat {
  label: string;
  value: number | string;
  sublabel?: string;
  href?: string;
}

interface ContentOverviewProps {
  overview: {
    totalPosts: number;
    totalPages: number;
    totalTags: number;
    totalAuthors: number;
    publishedPosts: number;
    draftPosts: number;
    publishedPages: number;
    draftPages: number;
    averageReadingTime: number;
    averageWordCount: number;
  };
}

export default function ContentOverview({ overview }: ContentOverviewProps) {
  const stats: OverviewStat[] = [
    { label: "Tổng bài viết", value: overview.totalPosts, sublabel: `${overview.publishedPosts} đã xuất bản · ${overview.draftPosts} bản nháp` },
    { label: "Tổng trang", value: overview.totalPages, sublabel: `${overview.publishedPages} đã xuất bản · ${overview.draftPages} bản nháp` },
    { label: "Thẻ", value: overview.totalTags, href: "/tags" },
    { label: "Tác giả", value: overview.totalAuthors, href: "/authors" },
    { label: "Thời gian đọc TB", value: `${overview.averageReadingTime} phút` },
    { label: "Số từ TB", value: `${overview.averageWordCount.toLocaleString()} từ` },
  ];

  return (
    <div className="section-card">
      <div className="section-title">Tổng quan nội dung</div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--color-body)] rounded-lg p-4 border border-[var(--color-border)]"
          >
            <div className="text-[0.8125rem] text-[var(--color-text-secondary)] mb-1">
              {s.label}
            </div>
            {s.href ? (
              <Link
                href={s.href}
                className="text-xl font-bold text-[var(--color-accent)] hover:underline"
              >
                {s.value}
              </Link>
            ) : (
              <div className="text-xl font-bold text-[var(--color-text-primary)]">
                {s.value}
              </div>
            )}
            {s.sublabel && (
              <div className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                {s.sublabel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
