export const formatCurrency = (
  value: number,
  currency = "USD",
  locale = "en-US"
) =>
  new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
  }).format(value);
