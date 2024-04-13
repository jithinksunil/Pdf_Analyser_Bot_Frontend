import { LazyExoticComponent, ReactNode } from 'react';

export interface Routes {
  Layout?: () => ReactNode;
  routes: Route[];
}
interface Route {
  Component: LazyExoticComponent<() => JSX.Element>;
  path: string;
  requireAuth?: boolean;
}

export interface File {
  id: string;
  name: string;
}
