import { Route, Routes } from 'react-router-dom';
import { Routes as AllRoutes } from '../interfaces/other.interface';
import { Fragment } from 'react/jsx-runtime';
import { authRoutes } from './auth.routes';
import { RequireAuth } from '../components/authentication';

export function Router() {
  const allRoutes: AllRoutes[] = [...authRoutes];
  return (
    <>
      {allRoutes.map(({ Layout, routes }, fragmentIndex) => {
        const RouteLayout = Layout || Fragment;
        return (
          <Routes key={`${fragmentIndex}th fragment`}>
            <Route element={<RouteLayout />}>
              {routes.map(({ Component, path, requireAuth }, index) => {
                const Guard = requireAuth ? RequireAuth : Fragment;
                return (
                  <Route
                    key={`${index}th route of ${fragmentIndex}th fragment`}
                    element={
                      <Guard>
                        <Component />
                      </Guard>
                    }
                    path={path}
                  />
                );
              })}
            </Route>
          </Routes>
        );
      })}
    </>
  );
}