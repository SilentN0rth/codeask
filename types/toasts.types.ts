import { ReactNode } from 'react';

export interface ToastMessage {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  timeout?: number;
}

export interface UseToastActionCooldownParams {
  addToast: (toast: {
    title: string;
    description?: string;
    timeout?: number;
    icon?: ReactNode;
    color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger';
  }) => void;

  cooldownMs?: number;
  disableButton?: boolean;

  onSuccessMessage: ToastMessage;
  onFailMessage?: ToastMessage;

  onSuccess?: () => void;
  onFail?: () => void;
}
