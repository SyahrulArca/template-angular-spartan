import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Type } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import type { AppToastType } from './app-toast.types';

const TYPE_LABELS: Record<AppToastType, string> = {
  warning: 'Warning',
  success: 'Success',
  error: 'Error',
  info: 'Info',
};

const TYPE_STYLES: Record<AppToastType, { accent: string; container: string }> = {
  error: {
    accent: 'bg-[#e85d3a]',
    container:
      'border-[#e85d3a]/50 bg-[#e85d3a]/40 text-foreground  shadow-[0_0_16px_rgba(232,93,58,0.28)]',
  },
  success: {
    accent: 'bg-emerald-500',
    container:
      'border-emerald-500/50 bg-emerald-500/40 text-foreground shadow-[0_0_16px_rgba(16,185,129,0.28)]',
  },
  warning: {
    accent: 'bg-amber-400',
    container:
      'border-amber-400/50 bg-amber-400/40 text-foreground shadow-[0_0_16px_rgba(251,191,36,0.28)]',
  },
  info: {
    accent: 'bg-sky-400',
    container:
      'border-sky-400/50 bg-sky-400/40 text-foreground shadow-[0_0_16px_rgba(56,189,248,0.28)]',
  },
};

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, NgIcon],
  providers: [provideIcons({ lucideX })],
  templateUrl: './app-toast.html',
})
export class AppToast {
  readonly toastId = input.required<string | number>();
  readonly type = input.required<AppToastType>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly action = input<Type<unknown> | null>(null);
  readonly actionInputs = input<Record<string, unknown>>({});

  protected readonly typeLabel = computed(() => TYPE_LABELS[this.type()]);
  protected readonly accentClass = computed(() => TYPE_STYLES[this.type()].accent);
  protected readonly containerClass = computed(() => TYPE_STYLES[this.type()].container);

  protected close(): void {
    toast.dismiss(this.toastId());
  }
}
