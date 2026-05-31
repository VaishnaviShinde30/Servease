export const DUMMY_REPORTS = [
  {
    id: 'rep-001',
    type: 'scam',
    target_type: 'shop',
    target_id: '1',
    target_name: 'Sai Digital Print & Xerox',
    reporter_id: 'usr-401',
    reporter_name: 'Rahul Sharma',
    description: 'Shop charged me ₹500 for a ₹50 service and refused to return change. Seems like a scam operation.',
    status: 'pending',
    date: '2026-05-30T10:30:00Z'
  },
  {
    id: 'rep-002',
    type: 'fake_listing',
    target_type: 'shop',
    target_id: '6',
    target_name: 'Bright Spark Electricals',
    reporter_id: 'usr-402',
    reporter_name: 'Priya Patel',
    description: 'I went to this location and there is no electrical shop here. It is a residential building.',
    status: 'pending',
    date: '2026-05-29T14:15:00Z'
  },
  {
    id: 'rep-003',
    type: 'abuse',
    target_type: 'user',
    target_id: 'usr-999',
    target_name: 'Unknown User',
    reporter_id: 'uuid-shop-002',
    reporter_name: 'New Bharat Tailoring',
    description: 'This user keeps booking appointments and not showing up, then leaves 1-star reviews.',
    status: 'resolved',
    date: '2026-05-25T09:00:00Z'
  },
  {
    id: 'rep-004',
    type: 'quality',
    target_type: 'shop',
    target_id: '3',
    target_name: 'A-1 Plumbing Solutions',
    reporter_id: 'usr-405',
    reporter_name: 'Amit Kumar',
    description: 'Plumber broke the pipe further and demanded extra cash to fix his own mistake. Very unprofessional.',
    status: 'pending',
    date: '2026-05-31T08:45:00Z'
  }
];
