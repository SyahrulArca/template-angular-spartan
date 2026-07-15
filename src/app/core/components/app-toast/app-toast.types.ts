import type { Type } from '@angular/core';

export type AppToastType = 'warning' | 'success' | 'error' | 'info';

export type AppToastLocation =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

export const DEFAULT_APP_TOAST_LOCATION: AppToastLocation = 'bottom-right';

export interface AppToastOptions {
  type: AppToastType;
  title: string;
  description?: string;
  action?: Type<unknown>;
  actionInputs?: Record<string, unknown>;
  duration?: number;
  location?: AppToastLocation;
}
