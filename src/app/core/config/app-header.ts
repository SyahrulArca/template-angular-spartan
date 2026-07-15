import { lucideBoxes, lucideLayoutDashboard, lucideListTodo } from '@ng-icons/lucide';

export const appHeaderProductIcons = {
  lucideLayoutDashboard,
  lucideListTodo,
  lucideBoxes,
} as const;

export type AppHeaderProductIcon = keyof typeof appHeaderProductIcons;

export interface AppHeaderProductItem {
  id: string;
  name: string;
  description: string;
  icon: AppHeaderProductIcon;
  path: string;
}

export interface AppHeaderNotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const appHeaderProducts: AppHeaderProductItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Analytics & overview',
    icon: 'lucideLayoutDashboard',
    path: '/dashboard',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'CRUD demo workspace',
    icon: 'lucideListTodo',
    path: '/tasks',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Product catalog module',
    icon: 'lucideBoxes',
    path: '/settings',
  },
];

export const appHeaderNotifications: AppHeaderNotificationItem[] = [
  {
    id: '1',
    title: 'Task completed',
    message: 'Your task "Setup sidebar menu" was marked as done.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    title: 'New comment',
    message: 'Someone replied to your task update.',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'System update',
    message: 'Spartan UI components are up to date.',
    time: 'Yesterday',
    read: true,
  },
];

export function getUnreadNotificationCount(notifications: AppHeaderNotificationItem[]): number {
  return notifications.filter((notification) => !notification.read).length;
}
