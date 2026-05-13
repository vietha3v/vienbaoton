import { computeAnalytics } from "@/lib/analytics";
import ContentOverview from "@/components/dashboard/ContentOverview";
import SeoHealthPanel from "@/components/dashboard/SeoHealthPanel";
import TagAnalytics from "@/components/dashboard/TagAnalytics";
import AiSeoAudit from "@/components/dashboard/AiSeoAudit";
import AiSeoResearch from "@/components/dashboard/AiSeoResearch";
import RecentActivity from "@/components/dashboard/RecentActivity";

export const revalidate = 300;

export default async function DashboardPage() {
  let data: Awaited<ReturnType<typeof computeAnalytics>> | null = null;

  try {
    data = await computeAnalytics();
  } catch (e) {
    console.error("[DashboardPage] Failed to load analytics:", e);
  }

  if (!data) {
    return (
      <div className="section-card">
        <div className="empty-state">Không thể tải dữ liệu phân tích. Vui lòng kiểm tra kết nối Ghost CMS.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
          Dashboard SEO & Content
        </h1>
        {data.settings && (
          <a
            href={data.settings.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            {data.settings.title} →
          </a>
        )}
      </div>

      <ContentOverview overview={data.overview} />
      <SeoHealthPanel seoHealth={data.seoHealth} overview={data.overview} />
      <RecentActivity recentPosts={data.recentPosts} contentQuality={data.contentQuality} />
      <TagAnalytics tagAnalytics={data.tagAnalytics} />
      <AiSeoAudit recentPosts={data.recentPosts.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))} />
      <AiSeoResearch />
    </div>
  );
}
