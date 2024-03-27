import { Routes } from '../interfaces';
import { AnalyserPage, FilePage } from '../pages/analyser';

export const ananyserRoutes: Routes[] = [
  {
    routes: [
      { path: '/analyser', Component: AnalyserPage, requireAuth: true },
      { path: '/analyser/:fileId', Component: FilePage, requireAuth: true },
    ],
  },
];
