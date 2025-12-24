import React from 'react';
import { LayoutDashboard, PlusCircle, FileText, MessageCircleHeart } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log Vitals', icon: PlusCircle },
    { id: 'report', label: 'Simplifier', icon: FileText },
    { id: 'chat', label: 'Assistant', icon: MessageCircleHeart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg md:relative md:border-t-0 md:h-screen md:w-64 md:flex-col md:border-r z-50">
      <div className="hidden md:flex items-center justify-center h-20 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <MessageCircleHeart className="w-8 h-8" />
          HealthPulse
        </h1>
      </div>
      
      <div className="flex justify-around md:flex-col md:justify-start md:p-4 md:space-y-2 h-16 md:h-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col md:flex-row items-center justify-center md:justify-start md:px-4 md:py-3 rounded-xl w-full transition-all duration-200
                ${isActive 
                  ? 'text-primary-600 md:bg-primary-50' 
                  : 'text-slate-500 hover:text-primary-500 hover:bg-slate-50'
                }`}
            >
              <Icon className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className={`text-xs md:text-sm md:ml-3 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;