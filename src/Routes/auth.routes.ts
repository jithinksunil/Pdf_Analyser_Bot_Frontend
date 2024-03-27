import { Routes } from '../interfaces/other.interface';
import { Signin } from '../pages/auth';

export const authRoutes: Routes[] = [
  { routes: [{ path: '/', Component: Signin }] },
];
