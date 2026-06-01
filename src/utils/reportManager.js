import { DUMMY_REPORTS } from '../data/dummyReports';

const REPORTS_STORAGE_KEY = 'servease_reports_v1';

export const getReports = () => {
  const data = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(DUMMY_REPORTS));
    return DUMMY_REPORTS;
  }
  return JSON.parse(data);
};

export const addReport = (type, target_type, target_id, target_name, reporter_id, reporter_name, description) => {
  const allReports = getReports();
  const newReport = {
    id: `rep-${Date.now()}`,
    type,
    target_type,
    target_id,
    target_name,
    reporter_id,
    reporter_name: reporter_name || 'Anonymous User',
    description,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  const updatedReports = [newReport, ...allReports];
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  return newReport;
};

export const resolveReport = (id) => {
  const allReports = getReports();
  const updatedReports = allReports.map(r => 
    r.id === id ? { ...r, status: 'resolved' } : r
  );
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  return updatedReports;
};
