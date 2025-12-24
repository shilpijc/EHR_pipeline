// Date calculation utilities
export const computeRelativeDate = ({ yearsAgo, daysAgo }) => {
  const d = new Date();
  if (yearsAgo) {
    d.setFullYear(d.getFullYear() - yearsAgo);
  }
  if (daysAgo) {
    d.setDate(d.getDate() - daysAgo);
  }
  return d.toISOString().slice(0, 10);
};

