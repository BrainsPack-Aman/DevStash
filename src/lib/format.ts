const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatShortDate(isoDate: string): string {
  return SHORT_DATE.format(new Date(isoDate));
}
