import { getHeroPosts, getNewsPosts, getResearchPosts } from "@/lib/ghost";
import { getLocale } from "next-intl/server";
import HeroCarousel from "@/components/home/HeroCarousel";
import InstituteIntro from "@/components/home/InstituteIntro";
import NewsSection from "@/components/home/NewsSection";
import ResearchSection from "@/components/home/ResearchSection";
import EventsSection from "@/components/home/EventsSection";

export const revalidate = 300;

export default async function HomePage() {
  const locale = await getLocale();
  let heroPosts: Awaited<ReturnType<typeof getHeroPosts>> = [];
  let newsPosts: Awaited<ReturnType<typeof getNewsPosts>> = [];
  let researchPosts: Awaited<ReturnType<typeof getResearchPosts>> = [];

  try {
    [heroPosts, newsPosts, researchPosts] = await Promise.all([
      getHeroPosts(locale),
      getNewsPosts(locale),
      getResearchPosts(locale),
    ]);
  } catch (e) {
    console.error("Failed to fetch homepage data:", e);
  }

  return (
    <div className="home-container">
      <HeroCarousel posts={heroPosts} />
      <InstituteIntro />
      <NewsSection posts={newsPosts} />
      <ResearchSection posts={researchPosts} />
      <EventsSection />
    </div>
  );
}
