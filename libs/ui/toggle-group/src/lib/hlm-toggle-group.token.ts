import {
  type ExistingProvider,
  type ForwardRefFn,
  InjectionToken,
  inject,
  type Type,
} from '@angular/core';
import type { ToggleVariants } from '@spartan-ng/helm/toggle';

export interface HlmToggleGroupContext {
  variant(): ToggleVariants['variant'];
  size(): ToggleVariants['size'];
  spacing(): number;
}

export const HlmToggleGroupToken = new InjectionToken<HlmToggleGroupContext>('HlmToggleGroupToken');

export function injectHlmToggleGroup(): HlmToggleGroupContext {
  return inject(HlmToggleGroupToken);
}

export function provideHlmToggleGroup(
  toggleGroup: Type<unknown> | ForwardRefFn,
): ExistingProvider {
  return { provide: HlmToggleGroupToken, useExisting: toggleGroup };
}
