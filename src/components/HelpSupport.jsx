import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { addReport } from '../utils/reportManager';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FAQS = [
  {
    question: 'How do I book a service?',
    answer: 'Search for a shop on your dashboard, view their details, and contact them directly using the provided phone number. We will be adding online booking soon!'
  },
  {
    question: 'How do I list my shop?',
    answer: 'Sign up as a Shopkeeper. In your dashboard, click "Add New Shop" and fill in your details.'
  },
  {
    question: 'What if a shop overcharges me?',
    answer: 'Please use the "Contact Support" tab here to report the shop. Provide their name and details so we can investigate.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Log out and click "Forgot Password" on the Login screen. You will receive an email to reset it.'
  }
];

export default function HelpSupport() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  const [reportType, setReportType] = useState('general');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please enter a description.');
      return;
    }
    
    addReport(
      reportType,
      'platform',
      'system',
      'Platform Support',
      user?.id || 'anonymous',
      user?.email || 'Anonymous User',
      description
    );
    
    toast.success('Your message has been sent to Support!');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/40 z-40 transition-colors"
      >
        <HelpCircle className="w-7 h-7" />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:justify-end sm:items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden sm:mb-20 sm:mr-4 flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" /> Help & Support
                  </h2>
                  <p className="text-primary-100 text-sm mt-1">How can we help you today?</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
                <button 
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'faq' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  FAQs
                </button>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'contact' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Contact Support
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {activeTab === 'faq' ? (
                  <div className="space-y-3">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                        <button 
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full p-4 text-left flex justify-between items-center font-bold text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <span className="pr-4">{faq.question}</span>
                          {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {openFaqIndex === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Issue Type</label>
                      <select 
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="bug">Report a Bug</option>
                        <option value="account">Account Issue</option>
                        <option value="scam">Report a Scam/Fraud</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your issue in detail..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium h-32 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full flex items-center justify-center py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all"
                    >
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
