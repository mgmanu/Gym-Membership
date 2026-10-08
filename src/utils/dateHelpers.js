import {
  addMonths,
  addYears,
  format,
} from "date-fns";

export function calculateExpiryDate(planType) {
  const today = new Date();

  switch (planType) {
    case "1 Month":
      return format(
        addMonths(today, 1),
        "yyyy-MM-dd"
      );

    case "3 Months":
      return format(
        addMonths(today, 3),
        "yyyy-MM-dd"
      );

    case "1 Year":
      return format(
        addYears(today, 1),
        "yyyy-MM-dd"
      );

    default:
      return format(
        addMonths(today, 1),
        "yyyy-MM-dd"
      );
  }
}


export function getDaysLeft(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}


export function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}