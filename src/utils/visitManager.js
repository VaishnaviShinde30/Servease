// Utility to track user visits to shops

export const recordVisit = (shopId, user) => {
  if (!user || !shopId) return;

  const visits = JSON.parse(localStorage.getItem('shop_visits') || '[]');
  
  // Check if this user recently visited this shop (within last 1 hour) to prevent spamming visits
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentVisit = visits.find(v => 
    v.shopId === shopId && 
    v.userId === user.id && 
    new Date(v.date) > oneHourAgo
  );

  if (!recentVisit) {
    const newVisit = {
      id: Date.now().toString(),
      shopId,
      userId: user.id,
      userEmail: user.email,
      date: new Date().toISOString()
    };
    localStorage.setItem('shop_visits', JSON.stringify([...visits, newVisit]));
  }
};

export const getVisitsForShop = (shopId) => {
  const visits = JSON.parse(localStorage.getItem('shop_visits') || '[]');
  return visits.filter(v => v.shopId === shopId).sort((a, b) => new Date(b.date) - new Date(a.date));
};
