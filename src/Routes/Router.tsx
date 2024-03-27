import { Outlet, Route, Routes } from 'react-router-dom';
import { Routes as AllRoutes } from '../interfaces/other.interface';
import { Fragment } from 'react/jsx-runtime';
import { RequireAuth } from '../components/authentication';
import { authRoutes } from './auth.routes';
import { ananyserRoutes } from './analyser.routes';

export function Router() {
  const allRoutes: AllRoutes[] = [...authRoutes, ...ananyserRoutes];
  return (
    <>
      {allRoutes.map(({ Layout, routes }, fragmentIndex) => {
        const RouteLayout = Layout || Outlet;
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
