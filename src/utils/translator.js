// Utility to translate text using MyMemory Translation API
// Free usage: up to 500 words/day (or 5000 with valid email)

export const translateText = async (text, targetLang) => {
  if (!text) return '';
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.error(`Translation to ${targetLang} failed:`, error);
  }
  return text; // fallback to original text if translation fails
};

export const translateShopDynamic = async (shopData) => {
  try {
    const [name_hi, name_mr, desc_hi, desc_mr] = await Promise.all([
      translateText(shopData.name, 'hi'),
      translateText(shopData.name, 'mr'),
      translateText(shopData.description || '', 'hi'),
      translateText(shopData.description || '', 'mr')
    ]);
    
    return {
      ...shopData,
      name_hi,
      name_mr,
      desc_hi,
      desc_mr
    };
  } catch (error) {
    console.error('Error in translateShopDynamic:', error);
    return shopData;
  }
};
