import { lazy } from 'react';
import { Routes } from '../interfaces/other.interface';
const Signin = lazy(() =>
  import('../pages/auth/Signin').then((module) => ({
    default: module.default,
  }))
);
export const authRoutes: Routes[] = [
  { routes: [{ path: '/', Component: Signin }] },
];
