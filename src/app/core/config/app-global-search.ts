import { lucideSunMoon } from '@ng-icons/lucide';
import { appHeaderProductIcons, appHeaderProducts } from './app-header';
import {
  appMenuIcons,
  appMenuSidebar,
  formatAppMenuGroupLabel,
  type AppMenuSidebarItem,
} from './app-menu';

export const appGlobalSearchIcons = {
  ...appMenuIcons,
  ...appHeaderProductIcons,
  lucideSunMoon,
} as const;

export type AppGlobalSearchIcon = keyof typeof appGlobalSearchIcons;
export type AppGlobalSearchCategory = 'page' | 'module' | 'action';
export type AppGlobalSearchAction = 'toggle-theme';

export interface AppGlobalSearchItem {
  id: string;
  category: AppGlobalSearchCategory;
  title: string;
  subtitle: string;
  /** Mono identifier under the subtitle, e.g. a route path. */
  meta?: string;
  badge: string;
  icon: AppGlobalSearchIcon;
  path?: string;
  action?: AppGlobalSearchAction;
}

export interface AppGlobalSearchHighlight {
  text: string;
  match: boolean;
}

export const appGlobalSearchCategories: ReadonlyArray<{
  value: AppGlobalSearchCategory;
  label: string;
}> = [
  { value: 'page', label: 'Pages' },
  { value: 'module', label: 'Modules' },
  { value: 'action', label: 'Actions' },
];

function flattenMenu(items: AppMenuSidebarItem[]): AppMenuSidebarItem[] {
  return items.flatMap((item) => [item, ...flattenMenu(item.children ?? [])]);
}

export const appGlobalSearchItems: AppGlobalSearchItem[] = [
  ...appMenuSidebar.flatMap((group) =>
    flattenMenu(group.items)
      .filter((item) => item.path)
      .map((item): AppGlobalSearchItem => ({
        id: `page:${item.path}`,
        category: 'page',
        title: item.title,
        subtitle: formatAppMenuGroupLabel(group),
        meta: item.path,
        badge: 'Page',
        icon: item.icon,
        path: item.path,
      })),
  ),
  ...appHeaderProducts.map((product): AppGlobalSearchItem => ({
    id: `module:${product.id}`,
    category: 'module',
    title: product.name,
    subtitle: product.description,
    meta: product.path,
    badge: 'Module',
    icon: product.icon,
    path: product.path,
  })),
  {
    id: 'action:toggle-theme',
    category: 'action',
    title: 'Toggle theme',
    subtitle: 'Switch between light and dark mode',
    badge: 'Action',
    icon: 'lucideSunMoon',
    action: 'toggle-theme',
  },
];

export function filterAppGlobalSearch(
  items: readonly AppGlobalSearchItem[],
  query: string,
): AppGlobalSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((item) =>
    [item.title, item.subtitle, item.meta ?? ''].some((field) => field.toLowerCase().includes(q)),
  );
}

/** Splits `text` into matched / unmatched parts for every case-insensitive occurrence of `query`. */
export function highlightAppGlobalSearch(text: string, query: string): AppGlobalSearchHighlight[] {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text, match: false }];

  const parts: AppGlobalSearchHighlight[] = [];
  const lower = text.toLowerCase();
  let start = 0;
  for (let i = lower.indexOf(q); i !== -1; i = lower.indexOf(q, start)) {
    if (i > start) parts.push({ text: text.slice(start, i), match: false });
    parts.push({ text: text.slice(i, i + q.length), match: true });
    start = i + q.length;
  }
  if (start < text.length) parts.push({ text: text.slice(start), match: false });
  return parts;
}
