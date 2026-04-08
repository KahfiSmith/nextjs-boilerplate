export const formatDate = (
  value: Date | number | string,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions
) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(new Date(value));
