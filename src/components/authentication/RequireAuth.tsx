import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
interface PropTypes {
  children: ReactNode;
}
export function RequireAuth({ children }: PropTypes) {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? children : <Navigate to={'/'} replace />;
}
