import { useContext } from 'react';
import { ToastContext } from '@util/ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider와 함께 사용되어야 합니다.');
  }
  return context.showToast;
};
