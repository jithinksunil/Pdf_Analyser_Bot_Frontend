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

export interface GFile {
  id: string;
  name: string;
}

export interface Question {
  question: string;
  answer: string;
}
