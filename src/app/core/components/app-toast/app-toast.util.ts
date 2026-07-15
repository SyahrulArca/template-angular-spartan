import { toast } from '@spartan-ng/brain/sonner';
import { AppToast } from './app-toast';
import type { AppToastOptions } from './app-toast.types';

export function appToast(options: AppToastOptions): string | number {
  const { duration, actionInputs, location, ...componentProps } = options;
  const toastId = `app-toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return toast.custom(AppToast, {
    id: toastId,
    componentProps: {
      ...componentProps,
      toastId,
      actionInputs: actionInputs ?? {},
    },
    unstyled: true,
    class: 'w-full max-w-md p-0! bg-transparent! border-0! shadow-none!',
    duration: duration ?? 4000,
    position: location,
  });
}
