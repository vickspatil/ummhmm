
import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const bgColor = toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
  const icon = toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColor} animate-toast-in`}
    >
      <i className={`fa-solid ${icon}`}></i>
      <span>{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-auto text-white/80 hover:text-white">&times;</button>
    </div>
  );
};


interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 space-y-2 z-50 w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
       <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
      `}</style>
    </>
  );
};
