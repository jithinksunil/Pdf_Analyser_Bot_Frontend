import { useEffect } from 'react';
import { genarateToken, getGoogleUrl } from '../../requests';
import { useNavigate } from 'react-router-dom';

export function Signin() {
  const navigate = useNavigate();
  const handleSigninWithGoogle = async () => {
    try {
      const res = await getGoogleUrl();
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateToken = async (code: string) => {
    try {
      const res = await genarateToken(code);
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      navigate('/analyser');
    } catch (error) {
      console.log(error);
    }
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
