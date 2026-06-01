import { DUMMY_SHOPS } from '../data/dummyShops';

const FEEDBACK_STORAGE_KEY = 'servease_feedback_v1';

// Initial dummy feedback to make the dashboard look populated
const INITIAL_FEEDBACK = [
  { id: 'fb-1', shopId: '1', userId: 'user-001', userName: 'Aarav M.', rating: 5, comment: 'Excellent printing quality and very fast!', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'fb-2', shopId: '1', userId: 'user-002', userName: 'Neha K.', rating: 4, comment: 'Good service but had to wait a bit.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'fb-3', shopId: '2', userId: 'user-003', userName: 'Rahul P.', rating: 5, comment: 'Perfect fitting for my blazer!', date: new Date(Date.now() - 86400000 * 1).toISOString() }
];

export const getFeedback = () => {
  const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(INITIAL_FEEDBACK));
    return INITIAL_FEEDBACK;
  }
  return JSON.parse(data);
};

export const getFeedbackForShop = (shopId) => {
  const allFeedback = getFeedback();
  return allFeedback.filter(fb => fb.shopId === shopId);
};

export const addFeedback = (shopId, userId, userName, rating, comment) => {
  const allFeedback = getFeedback();
  const newFeedback = {
    id: `fb-${Date.now()}`,
    shopId,
    userId,
    userName: userName || 'Anonymous User',
    rating,
    comment,
    date: new Date().toISOString()
  };
  
  const updatedFeedback = [newFeedback, ...allFeedback];
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
  return newFeedback;
};
