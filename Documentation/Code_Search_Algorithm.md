
# Smart Search & Recommendation Algorithm
```javascript
// src/pages/UserDashboard.jsx
const getRecommendations = () => {
  // 1. Initial Filtering (Type, Search Query, Price Limits, Minimum Rating)
  const filteredShops = shopsWithDistance.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || shop.type === selectedType;
    const matchesPrice = filterPrice === "all" 
      ? true 
      : filterPrice === "low" ? shop.price < 500
      : filterPrice === "medium" ? (shop.price >= 500 && shop.price <= 1000)
      : shop.price > 1000;
    const matchesRating = shop.rating >= filterRating;

    return matchesSearch && matchesType && matchesPrice && matchesRating;
  });

  if (filteredShops.length === 0) return [];

  // 2. Normalization for Smart Recommendation Scoring
  const maxP = Math.max(...filteredShops.map(s => s.price));
  const maxD = Math.max(...filteredShops.map(s => s.distance || 0));

  // 3. Weighted Scoring System
  const scoredShops = filteredShops.map(shop => {
    // Normalize values between 0 and 1
    const normDistance = shop.distance ? (shop.distance / maxD) : 0;
    const normPrice = shop.price ? (shop.price / maxP) : 0;
    const normRating = shop.rating / 5;

    // Recommendation Formula: Highest Score wins
    // Weights: Distance (40%), Price (30%), Rating (30%)
    const score = ((1 - normDistance) * 0.4) + ((1 - normPrice) * 0.3) + (normRating * 0.3);

    return { ...shop, score };
  });

  // 4. Sort and return the highest scored shops
  return scoredShops.sort((a, b) => b.score - a.score);
};
```
