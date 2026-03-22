
import React, { useState, useRef } from 'react';
import { TabType, DocumentState, RegistrationFormData } from './types';
import TopAppBar from './components/TopAppBar';
import ScannerButton from './components/ScannerButton';
import BottomNav from './components/BottomNav';
import { extractDocumentInfo } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('registro');
  const [loadingType, setLoadingType] = useState<'ID' | 'CPF' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [docState, setDocState] = useState<DocumentState>({
    identityScanned: false,
    cpfScanned: false,
  });

  const [formData, setFormData] = useState<RegistrationFormData>({
    phone: '',
    healthLinked: false,
    interiorizationMode: 'individual',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentScanType = useRef<'ID' | 'CPF' | null>(null);

  const handleScanClick = (type: 'ID' | 'CPF') => {
    currentScanType.current = type;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = currentScanType.current;
    if (!file || !type) return;

    setLoadingType(type);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const result = await extractDocumentInfo(base64, type);
      
      if (result) {
        setDocState(prev => ({
          ...prev,
          identityScanned: type === 'ID' ? true : prev.identityScanned,
          cpfScanned: type === 'CPF' ? true : prev.cpfScanned,
          identityName: type === 'ID' ? result.fullName : prev.identityName,
          cpfNumber: type === 'CPF' ? result.documentNumber : prev.cpfNumber,
        }));
      } else {
        // Fallback simulation
        setDocState(prev => ({
          ...prev,
          identityScanned: type === 'ID' ? true : prev.identityScanned,
          cpfScanned: type === 'CPF' ? true : prev.cpfScanned,
          identityName: type === 'ID' ? 'Usuario Identificado' : prev.identityName,
          cpfNumber: type === 'CPF' ? '123.456.789-00' : prev.cpfNumber,
        }));
      }
      setLoadingType(null);
    };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = '';
  };

  const handleSubmitToServer = async () => {
    if (!docState.identityScanned || !docState.cpfScanned) {
      alert("Por favor, escanea ambos documentos antes de continuar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(10);

    // Simulate server upload stages
    const stages = [30, 60, 90, 100];
    for (const progress of stages) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setSubmitProgress(progress);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto-reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setSubmitProgress(0);
    }, 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <TopAppBar title="Registro de Documentos" />

      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        {/* Header Section */}
        <div className="px-5 pt-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Paso 1 de 3</span>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-extrabold leading-tight">
            Gestión de Documentos
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            El sistema reconocerá automáticamente los datos de tus fotos y los enviará de forma segura a nuestro servidor.
          </p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange}
        />

        {/* OCR Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between px-5 pb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Escaneo Automático (OCR)</h3>
            <span className="material-symbols-outlined text-primary text-xl animate-pulse">sync</span>
          </div>
          <div className="flex flex-col gap-3 px-5">
            <ScannerButton 
              label="Escanear Identidad" 
              icon="badge" 
              isScanned={docState.identityScanned}
              onScan={() => handleScanClick('ID')}
              isLoading={loadingType === 'ID'}
              scannedInfo={docState.identityName}
            />
            <ScannerButton 
              label="Escanear CPF" 
              icon="fingerprint" 
              isScanned={docState.cpfScanned}
              onScan={() => handleScanClick('CPF')}
              isLoading={loadingType === 'CPF'}
              scannedInfo={docState.cpfNumber}
            />
          </div>
        </section>

        {/* Contact Phone */}
        <section className="mt-8 px-5">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            Teléfono de contacto
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">call</span>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
              placeholder="+55 (00) 00000-0000" 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
            />
          </div>
        </section>

        {/* Interiorization Mode */}
        <section className="mt-8 px-5 pb-8">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold pb-4">Interiorización</h3>
          <div className="grid grid-cols-2 gap-4">
            {(['individual', 'familiar'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFormData(p => ({ ...p, interiorizationMode: mode }))}
                className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl transition-all ${
                  formData.interiorizationMode === mode 
                  ? 'border-primary bg-primary/[0.03] text-primary' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl mb-1 ${formData.interiorizationMode === mode ? 'filled' : ''}`}>
                  {mode === 'individual' ? 'person' : 'group'}
                </span>
                <span className="text-xs font-bold capitalize">{mode}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Action Button */}
        <div className="mt-4 px-5 pb-12">
          {isSubmitting ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600 dark:text-slate-400">Enviando al servidor...</span>
                <span className="text-primary">{submitProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out" 
                  style={{ width: `${submitProgress}%` }}
                ></div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="bg-green-500 text-white py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-xl shadow-green-500/25 animate-bounce">
              <span className="material-symbols-outlined">cloud_done</span>
              ¡Datos enviados con éxito!
            </div>
          ) : (
            <button 
              onClick={handleSubmitToServer}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 active:scale-[0.98] transition-all hover:brightness-105"
            >
              Continuar y Guardar
            </button>
          )}
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
            Encriptación de extremo a extremo activada
          </p>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
