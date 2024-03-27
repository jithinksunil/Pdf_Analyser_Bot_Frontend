import { useEffect } from 'react';
import { genarateToken, getGoogleUrl } from '../../requests';

export function Signin() {
  const handleSigninWithGoogle = async () => {
    const res = await getGoogleUrl();
    window.location.href = res.data.url;
  };
  const handleCreateToken = async (code: string) => {
    const res = await genarateToken(code);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    if (code) {
      handleCreateToken(code);
    }
  });
  return (
    <div className='h-screen flex justify-center items-center'>
      <button
        className='bg-orange-400 text-white p-5 text-2xl font-bold rounded-xl'
        type='button'
        onClick={handleSigninWithGoogle}
      >
        Sign in with google
      </button>
    </div>
  );
}
