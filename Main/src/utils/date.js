export const getIndianDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export const addIndianDays = (date, days) => {
  const base = new Date(date);
  base.setDate(base.getDate() + days);
  return getIndianDate(base);
};
