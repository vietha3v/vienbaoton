export function formatDate(
  dateString: string,
  locale: string = "vi"
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatReadingTime(
  minutes: number,
  t: (key: string, params?: Record<string, unknown>) => string
): string {
  if (minutes <= 1) return t("reading_time_1");
  return t("reading_time", { count: minutes });
}
