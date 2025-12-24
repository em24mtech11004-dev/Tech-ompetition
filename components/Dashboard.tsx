import React from 'react';
import { DailyLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Moon, Zap, TrendingUp } from 'lucide-react';

interface DashboardProps {
  logs: DailyLog[];
  onLogClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, onLogClick }) => {
  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Prepare data for chart (last 7 entries)
  const chartData = sortedLogs.slice(-7).map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: log.mood,
    energy: log.energy,
    sleep: log.sleepHours
  }));

  const latestLog = sortedLogs[sortedLogs.length - 1];

  const StatCard = ({ title, value, icon: Icon, colorClass, label }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {label && <p className="text-xs text-slate-400 mt-1">{label}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Health Overview</h2>
          <p className="text-slate-500">Your vitals at a glance</p>
        </div>
        <button 
          onClick={onLogClick}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm md:hidden"
        >
          + Log Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Avg. Sleep" 
          value={latestLog ? `${latestLog.sleepHours} hrs` : '--'} 
          label="Last recorded"
          icon={Moon} 
          colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Energy Level" 
          value={latestLog ? `${latestLog.energy}/10` : '--'} 
          label="Self-reported"
          icon={Zap} 
          colorClass="bg-amber-500" 
        />
        <StatCard 
          title="Mood Score" 
          value={latestLog ? `${latestLog.mood}/10` : '--'} 
          label="Self-reported"
          icon={Activity} 
          colorClass="bg-pink-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Wellness Trends (Last 7 Logs)
          </h3>
        </div>
        
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" name="Mood" />
                <Area type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" name="Energy" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-12 h-12 mb-2 opacity-20" />
              <p>No data yet. Start by logging your day!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Logs</h3>
        <div className="space-y-4">
          {sortedLogs.slice().reverse().slice(0, 3).map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{log.notes || "No notes added."}</p>
              </div>
              <div className="flex gap-2 text-xs font-medium text-slate-600">
                <span className="bg-white px-2 py-1 rounded-md border shadow-sm">Mood: {log.mood}</span>
                <span className="bg-white px-2 py-1 rounded-md border shadow-sm">Sleep: {log.sleepHours}h</span>
              </div>
            </div>
          ))}
          {sortedLogs.length === 0 && (
             <p className="text-sm text-slate-400 italic">Your history will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;