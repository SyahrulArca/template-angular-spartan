import { HlmToggleGroup } from './lib/hlm-toggle-group';
import { HlmToggleGroupItem } from './lib/hlm-toggle-group-item';

export { HlmToggleGroup } from './lib/hlm-toggle-group';
export { HlmToggleGroupItem } from './lib/hlm-toggle-group-item';
export {
  HlmToggleGroupToken,
  injectHlmToggleGroup,
  provideHlmToggleGroup,
} from './lib/hlm-toggle-group.token';
export type { HlmToggleGroupContext } from './lib/hlm-toggle-group.token';

export const HlmToggleGroupImports = [HlmToggleGroup, HlmToggleGroupItem];
