import { useEffect, useState } from 'react';
import { genarateToken, getGoogleUrl } from '../../requests';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../components/common';

export function Signin() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSigninWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await getGoogleUrl();
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };
  const handleCreateToken = async (code: string) => {
    setLoading(true);
    try {
      const res = await genarateToken(code);
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      navigate('/analyser');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    if (code) {
      handleCreateToken(code);
    }
  }, []);
  return (
    <div className='h-screen flex justify-center items-center'>
      <PrimaryButton
        type='button'
        onClick={handleSigninWithGoogle}
        isLoading={loading}
      >
        Sign in with google
      </PrimaryButton>
    </div>
  );
}
