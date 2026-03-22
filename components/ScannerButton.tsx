
import React from 'react';

interface ScannerButtonProps {
  label: string;
  icon: string;
  isScanned: boolean;
  onScan: () => void;
  isLoading?: boolean;
  scannedInfo?: string;
}

const ScannerButton: React.FC<ScannerButtonProps> = ({ 
  label, 
  icon, 
  isScanned, 
  onScan, 
  isLoading,
  scannedInfo 
}) => {
  return (
    <button 
      onClick={onScan}
      disabled={isLoading}
      className={`flex items-center gap-4 w-full bg-white dark:bg-slate-800 border ${
        isScanned ? 'border-primary' : 'border-slate-200 dark:border-slate-700'
      } rounded-2xl p-4 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group relative overflow-hidden`}
    >
      <div className={`${isScanned ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} p-2 rounded-xl transition-colors`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      
      <div className="flex flex-col flex-1 text-left">
        <span className="font-semibold text-slate-800 dark:text-slate-100">{label}</span>
        {scannedInfo && (
          <span className="text-xs text-primary font-medium">{scannedInfo}</span>
        )}
      </div>

      <div className="flex items-center">
        {isLoading ? (
          <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        ) : (
          <span className={`material-symbols-outlined ${isScanned ? 'text-primary' : 'text-slate-400'} transition-colors`}>
            {isScanned ? 'check_circle' : 'photo_camera'}
          </span>
        )}
      </div>
      
      {isScanned && !isLoading && (
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </div>
      )}
    </button>
  );
};

export default ScannerButton;
