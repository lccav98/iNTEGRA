
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'registro', label: 'Registro', icon: 'description' },
    { id: 'mapa', label: 'Mapa', icon: 'map' },
    { id: 'ayuda', label: 'Ayuda', icon: 'chat_bubble' },
    { id: 'perfil', label: 'Perfil', icon: 'person' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center max-w-md mx-auto z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center transition-colors ${
            activeTab === tab.id ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span className={`material-symbols-outlined text-2xl ${activeTab === tab.id ? 'filled' : ''}`}>
            {tab.icon}
          </span>
          <span className="text-[11px] mt-1 font-semibold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
