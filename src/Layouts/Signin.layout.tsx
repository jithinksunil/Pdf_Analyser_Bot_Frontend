import { Outlet } from 'react-router-dom';

export function SigninLayout() {
  return (
    <div>
      <h1>SigninLayout</h1>
      <Outlet />
      <h1>End</h1>
    </div>
  );
}
