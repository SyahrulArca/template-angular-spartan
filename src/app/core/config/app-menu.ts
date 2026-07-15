import { lucideLayoutDashboard, lucideListTodo, lucideSettings } from '@ng-icons/lucide';

export const appMenuIcons = {
  lucideLayoutDashboard,
  lucideListTodo,
  lucideSettings,
} as const;

export type AppMenuIcon = keyof typeof appMenuIcons;

export interface AppMenuSidebarItem {
  title: string;
  icon: AppMenuIcon;
  path?: string;
  children?: AppMenuSidebarItem[];
}

export interface AppMenuSidebarGroup {
  group: string;
  label?: string;
  items: AppMenuSidebarItem[];
}

export const appMenuSidebar: AppMenuSidebarGroup[] = [
  {
    group: 'analytics',
    label: 'Analytics',
    items: [{ title: 'Dashboard', path: '/dashboard', icon: 'lucideLayoutDashboard' }],
  },
  {
    group: 'transaction',
    label: 'Transaction',
    items: [
      { title: 'Tasks (CRUD)', path: '/tasks', icon: 'lucideListTodo' },
      // {
      //   title: 'Procurement',
      //   path: '',
      //   icon: 'lucideListTodo',
      //   children: [
      //     { title: 'Procurement', path: '/procurement', icon: 'lucideListTodo' },
      //     { title: 'Procurement', path: '/procurement', icon: 'lucideListTodo' },
      //     { title: 'Procurement', path: '/procurement', icon: 'lucideListTodo' },
      //   ],
      // },
      { title: 'Settings', path: '/settings', icon: 'lucideSettings' },
    ],
  },
];

export function formatAppMenuGroupLabel(menuGroup: AppMenuSidebarGroup): string {
  return menuGroup.label ?? menuGroup.group.charAt(0).toUpperCase() + menuGroup.group.slice(1);
}

export function hasAppMenuChildren(item: AppMenuSidebarItem): boolean {
  return (item.children?.length ?? 0) > 0;
}

export function getAppMenuItemTrackId(item: AppMenuSidebarItem): string {
  return item.path ?? item.title;
}
