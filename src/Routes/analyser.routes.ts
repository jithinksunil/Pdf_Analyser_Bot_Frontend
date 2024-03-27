import { Routes } from '../interfaces';
import { AnalyserPage } from '../pages/analyser';

export const ananyserRoutes: Routes[] = [
  {
    routes: [{ path: '/analyser', Component: AnalyserPage, requireAuth: true }],
  },
];
