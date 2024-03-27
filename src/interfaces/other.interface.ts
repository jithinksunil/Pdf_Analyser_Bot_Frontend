import { ReactNode } from 'react';

export interface Routes {
  Layout?: () => ReactNode;
  routes: Route[];
}
interface Route {
  Component: () => ReactNode;
  path: string;
  requireAuth?: boolean;
}
