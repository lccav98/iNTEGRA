
import React from 'react';

interface TopAppBarProps {
  title: string;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ title }) => {
  return (
    <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800">
      <button 
        className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Volver"
      >
        <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
      </button>
      <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
        {title}
      </h2>
    </div>
  );
};

export default TopAppBar;
