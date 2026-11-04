export interface SidebarNavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly route: string;
  readonly matchRoutes: readonly string[];
}

export interface ToastMessage {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
}
