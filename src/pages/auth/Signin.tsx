import { useCallback, useEffect, useState } from 'react';
import {
  genarateToken,
  getGoogleUrl,
  shakeHandRefreshToken,
} from '../../requests';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../components/common';
import toast from 'react-hot-toast';

export default function Signin() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSigninWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGoogleUrl();
      window.location.href = res.data.url;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);
  const refresh = async () => {
    setLoading(true);
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (currentRefreshToken) {
        const {
          data: { accessToken, message },
        } = await shakeHandRefreshToken(currentRefreshToken);
        localStorage.setItem('accessToken', accessToken);
        toast.success(message);
        navigate('/analyser', { replace: true });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleCreateToken = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const res = await genarateToken(code);
      localStorage.setItem('accessToken', res.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
      toast.success(res.data.message);
      navigate('/analyser', { replace: true });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    if (code) {
      handleCreateToken(code);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className='h-screen flex justify-center items-center'>
      <PrimaryButton
        type='button'
        onClick={handleSigninWithGoogle}
        isLoading={loading}
        className='py-3 text-xl md:text-3xl'
      >
        Sign in with google
      </PrimaryButton>
    </div>
  );
}
