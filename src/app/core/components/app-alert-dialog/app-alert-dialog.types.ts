export type AppAlertType = 'success' | 'error' | 'warning' | 'info';

export interface AppAlertOptions {
  type: AppAlertType;
  title: string;
  description?: string;
  /** Default: OK */
  confirmLabel?: string;
}

export interface AppAlertDialogData {
  type: AppAlertType;
  title: string;
  description?: string;
  confirmLabel: string;
}

export interface AppAlertDialogContext extends AppAlertDialogData {
  close: (result?: void) => void;
}
