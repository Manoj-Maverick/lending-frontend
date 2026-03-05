export const formatCurrencyINR = (value) => {
  const amount = Number(value || 0);
  return `Rs ${amount.toLocaleString("en-IN")}`;
};

export const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 10) return value || "";
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};
