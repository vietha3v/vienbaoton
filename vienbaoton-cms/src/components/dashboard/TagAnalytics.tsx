interface TagAnalyticsProps {
  tagAnalytics: {
    topTags: { name: string; slug: string; count: number }[];
    tagsWithZeroPosts: { name: string; slug: string }[];
    totalTags: number;
  };
}

export default function TagAnalytics({ tagAnalytics }: TagAnalyticsProps) {
  const maxCount = tagAnalytics.topTags[0]?.count || 1;

  return (
    <div className="section-card">
      <div className="section-title">Phân tích thẻ</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Top 10 thẻ phổ biến
          </h4>
          <div className="space-y-3">
            {tagAnalytics.topTags.map((tag) => {
              const width = maxCount > 0 ? (tag.count / maxCount) * 100 : 0;
              return (
                <div key={tag.slug} className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-text-primary)] w-32 truncate">
                    {tag.name}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                      style={{ width: `${width}%`, opacity: 0.85 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] w-8 text-right">
                    {tag.count}
                  </span>
                </div>
              );
            })}
            {tagAnalytics.topTags.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] italic">Chưa có thẻ nào</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Thẻ chưa có bài viết ({tagAnalytics.tagsWithZeroPosts.length})
          </h4>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {tagAnalytics.tagsWithZeroPosts.map((tag) => (
              <span
                key={tag.slug}
                className="px-2 py-1 text-xs rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-body)]"
              >
                {tag.name}
              </span>
            ))}
            {tagAnalytics.tagsWithZeroPosts.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] italic">
                Tất cả thẻ đều có bài viết
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
