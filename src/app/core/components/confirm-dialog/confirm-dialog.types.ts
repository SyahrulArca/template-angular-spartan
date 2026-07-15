export type ConfirmVariant = 'default' | 'destructive';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

export interface ConfirmDialogData {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmVariant;
}

export interface ConfirmDialogContext extends ConfirmDialogData {
  close: (result?: boolean) => void;
}
