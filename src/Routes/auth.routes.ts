import { Routes } from '../interfaces/other.interface';
import { SigninLayout } from '../Layouts';
import { Signin } from '../pages/auth';

export const authRoutes: Routes[] = [
  { Layout: SigninLayout, routes: [{ path: '/', Component: Signin }] },
  {
    routes: [{ path: '/signin', Component: Signin }],
  },
];
