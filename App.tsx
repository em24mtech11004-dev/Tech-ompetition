import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SymptomTracker from './components/SymptomTracker';
import ReportSimplifier from './components/ReportSimplifier';
import WellnessChat from './components/WellnessChat';
import { ViewState, DailyLog } from './types';

// Mock Data for Demo
const MOCK_LOGS: DailyLog[] = [
  { id: '1', date: new Date(Date.now() - 6 * 86400000).toISOString(), mood: 6, energy: 5, sleepHours: 6.5, symptoms: ['Fatigue'], notes: 'Long day' },
  { id: '2', date: new Date(Date.now() - 5 * 86400000).toISOString(), mood: 7, energy: 6, sleepHours: 7, symptoms: [], notes: '' },
  { id: '3', date: new Date(Date.now() - 4 * 86400000).toISOString(), mood: 8, energy: 8, sleepHours: 8, symptoms: [], notes: 'Good workout' },
  { id: '4', date: new Date(Date.now() - 3 * 86400000).toISOString(), mood: 5, energy: 4, sleepHours: 5, symptoms: ['Headache'], notes: 'Stressful' },
  { id: '5', date: new Date(Date.now() - 2 * 86400000).toISOString(), mood: 7, energy: 7, sleepHours: 7.5, symptoms: [], notes: '' },
  { id: '6', date: new Date(Date.now() - 1 * 86400000).toISOString(), mood: 9, energy: 8, sleepHours: 8, symptoms: [], notes: 'Great sleep' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    // In a real app, load from LocalStorage or DB
    return MOCK_LOGS;
  });

  const handleSaveLog = (newLog: DailyLog) => {
    setLogs(prev => [...prev, newLog]);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard logs={logs} onLogClick={() => setCurrentView('log')} />;
      case 'log':
        return <SymptomTracker onSave={handleSaveLog} onCancel={() => setCurrentView('dashboard')} />;
      case 'report':
        return <ReportSimplifier />;
      case 'chat':
        return <WellnessChat />;
      default:
        return <Dashboard logs={logs} onLogClick={() => setCurrentView('log')} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto h-full">
           {/* Mobile Header (Only visible on very small screens if needed, usually nav handles it) */}
           <div className="md:hidden mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">HealthPulse</h1>
                <p className="text-xs text-slate-500">Your Personal Companion</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                HP
              </div>
           </div>

           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;