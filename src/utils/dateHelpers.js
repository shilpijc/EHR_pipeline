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

// Compute date from "how far back" parameters
export const computeHowFarBackDate = ({ yearsBack = 0, monthsBack = 0, daysBack = 0 }) => {
  const d = new Date();
  if (yearsBack) {
    d.setFullYear(d.getFullYear() - yearsBack);
  }
  if (monthsBack) {
    d.setMonth(d.getMonth() - monthsBack);
  }
  if (daysBack) {
    d.setDate(d.getDate() - daysBack);
  }
  return d.toISOString().slice(0, 10);
};

// Convert "how far back" values to date range for backend
export const convertHowFarBackToDateRange = (howFarBackConfig) => {
  const { yearsBack = 0, monthsBack = 0, daysBack = 0, daysBackTo = null, toRecent = false } = howFarBackConfig;
  
  const dateFrom = computeHowFarBackDate({ yearsBack, monthsBack, daysBack });
  
  let dateTo = null;
  if (daysBackTo !== null) {
    dateTo = computeHowFarBackDate({ daysBack: daysBackTo });
  } else if (toRecent) {
    // For "to recent", use today's date
    dateTo = new Date().toISOString().slice(0, 10);
  }
  
  return { dateFrom, dateTo };
};

