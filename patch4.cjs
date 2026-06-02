const { addTranslations } = require('./addTranslations.cjs');

const en = {
  "shopkeeper.no_feedback_title": "No feedback yet",
  "shopkeeper.no_feedback_desc": "When customers review your shops, they will appear here.",
  "My Shops": "My Shops",
  "shopkeeper.manage_desc": "Manage your service listings and business profile.",
  "Add New Shop": "Add New Shop",
  "Shop Insights": "Shop Insights",
  "Customer Feedback": "Customer Feedback",
  "Shop Info": "Shop Info",
  "Service Type": "Service Type",
  "Base Price": "Base Price",
  "Actions": "Actions",
  "No shops listed": "No shops listed",
  "shopkeeper.no_shops_desc": "You haven't listed any services yet. Click the button above to add your first shop.",
  "shopkeeper.total_views": "Total Views",
  "shopkeeper.search_appearances": "Search Appearances",
  "shopkeeper.avg_rating": "Avg. Shop Rating",
  "shopkeeper.this_week": "this week",
  "shopkeeper.based_on": "Based on",
  "shopkeeper.total_reviews_text": "total reviews",
  "shop.name": "Shop Name",
  "Price (₹)": "Price (₹)"
};

const hi = {
  "shopkeeper.no_feedback_title": "अभी तक कोई प्रतिक्रिया नहीं",
  "shopkeeper.no_feedback_desc": "जब ग्राहक आपकी दुकानों की समीक्षा करेंगे, तो वे यहां दिखाई देंगे।",
  "My Shops": "मेरी दुकानें",
  "shopkeeper.manage_desc": "अपनी सेवा लिस्टिंग और व्यावसायिक प्रोफ़ाइल प्रबंधित करें।",
  "Add New Shop": "नई दुकान जोड़ें",
  "Shop Insights": "दुकान अंतर्दृष्टि",
  "Customer Feedback": "ग्राहक प्रतिक्रिया",
  "Shop Info": "दुकान की जानकारी",
  "Service Type": "सेवा प्रकार",
  "Base Price": "मूल कीमत",
  "Actions": "कार्रवाई",
  "No shops listed": "कोई दुकान सूचीबद्ध नहीं है",
  "shopkeeper.no_shops_desc": "आपने अभी तक कोई सेवा सूचीबद्ध नहीं की है। अपनी पहली दुकान जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें।",
  "shopkeeper.total_views": "कुल दृश्य",
  "shopkeeper.search_appearances": "खोज में उपस्थिति",
  "shopkeeper.avg_rating": "औसत दुकान रेटिंग",
  "shopkeeper.this_week": "इस सप्ताह",
  "shopkeeper.based_on": "आधारित है",
  "shopkeeper.total_reviews_text": "कुल समीक्षाओं पर",
  "shop.name": "दुकान का नाम",
  "Price (₹)": "कीमत (₹)"
};

const mr = {
  "shopkeeper.no_feedback_title": "अद्याप कोणताही अभिप्राय नाही",
  "shopkeeper.no_feedback_desc": "जेव्हा ग्राहक तुमच्या दुकानांचे पुनरावलोकन करतील, तेव्हा ते येथे दिसतील.",
  "My Shops": "माझी दुकाने",
  "shopkeeper.manage_desc": "तुमची सेवा सूची आणि व्यवसाय प्रोफाइल व्यवस्थापित करा.",
  "Add New Shop": "नवीन दुकान जोडा",
  "Shop Insights": "दुकान अंतर्दृष्टी",
  "Customer Feedback": "ग्राहक अभिप्राय",
  "Shop Info": "दुकानाची माहिती",
  "Service Type": "सेवा प्रकार",
  "Base Price": "मूळ किंमत",
  "Actions": "क्रिया",
  "No shops listed": "कोणतीही दुकाने सूचीबद्ध नाहीत",
  "shopkeeper.no_shops_desc": "तुम्ही अद्याप कोणत्याही सेवा सूचीबद्ध केलेल्या नाहीत. तुमचे पहिले दुकान जोडण्यासाठी वरील बटणावर क्लिक करा.",
  "shopkeeper.total_views": "एकूण दृश्ये",
  "shopkeeper.search_appearances": "शोध उपस्थिती",
  "shopkeeper.avg_rating": "सरासरी दुकान रेटिंग",
  "shopkeeper.this_week": "या आठवड्यात",
  "shopkeeper.based_on": "वर आधारित",
  "shopkeeper.total_reviews_text": "एकूण पुनरावलोकने",
  "shop.name": "दुकानाचे नाव",
  "Price (₹)": "किंमत (₹)"
};

addTranslations(en, hi, mr);
