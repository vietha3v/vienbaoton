import { getTranslations } from "next-intl/server";

const timelineYears = ["1982", "1990", "1999", "2007", "2018", "Nay"];

export default async function HeritageTimeline() {
  const t = await getTranslations("Timeline");

  return (
    <section className="heritage-timeline">
      {timelineYears.map((year) => {
        const key = `event_${year}`;
        return (
          <div key={year} className="timeline-item">
            <div className="timeline-dot">❖</div>
            <div className="timeline-content">
              <h3 className="timeline-year">{year}</h3>
              <h4 className="timeline-event">{t(`${key}_title`)}</h4>
              <p>{t(`${key}_desc`)}</p>
            </div>
          </div>
        );
      })}
      <div className="timeline-end">✽</div>
    </section>
  );
}
