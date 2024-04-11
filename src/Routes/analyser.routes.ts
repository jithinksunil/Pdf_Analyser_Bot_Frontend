import { lazy } from 'react';
import { Routes } from '../interfaces';
const AnalyserPage = lazy(() =>
  import('../pages/analyser/AnalyserPage').then((module) => ({
    default: module.default,
  }))
);

export const ananyserRoutes: Routes[] = [
  {
    routes: [{ path: '/analyser', Component: AnalyserPage, requireAuth: true }],
  },
];
