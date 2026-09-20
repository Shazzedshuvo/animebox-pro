// src/components/common/ToastContainer.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="toast-icon success" />;
      case 'error': return <AlertCircle size={18} className="toast-icon error" />;
      case 'warning': return <AlertTriangle size={18} className="toast-icon warning" />;
      default: return <Info size={18} className="toast-icon info" />;
    }
  };

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-card ${toast.type}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <span className="toast-msg">{toast.message}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
          <div 
            className="toast-progress-bar"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      ))}
    </div>
  );
};
