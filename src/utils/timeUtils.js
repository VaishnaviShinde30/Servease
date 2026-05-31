export const isShopOpen = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return true; // Default to open if no timings provided
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closingTime.split(':').map(Number);
  
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const openTotalMinutes = openHour * 60 + openMin;
  const closeTotalMinutes = closeHour * 60 + closeMin;
  
  if (closeTotalMinutes < openTotalMinutes) {
    // Shop closes past midnight (e.g., 20:00 to 02:00)
    return currentTotalMinutes >= openTotalMinutes || currentTotalMinutes <= closeTotalMinutes;
  }
  
  return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes;
};
