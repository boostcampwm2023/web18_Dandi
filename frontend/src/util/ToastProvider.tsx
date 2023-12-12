import { createContext, useState, useEffect } from 'react';

interface ToastProviderProps {
  children: JSX.Element;
}

interface IToastContext {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<IToastContext | undefined>(undefined);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="bg-mint fixed bottom-[10%] left-1/2 z-50 m-0 w-auto -translate-x-1/2 rounded-xl p-6 text-xs font-bold sm:text-sm ">
          {toastMessage}
        </div>
      )}
    </ToastContext.Provider>
  );
};
