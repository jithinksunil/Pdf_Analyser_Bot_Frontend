import { useCallback, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { shakeHandRefreshToken } from '../requests';
import toast from 'react-hot-toast';

export const useAxiosPrivate = () => {
  const refresh = useCallback(async (refreshToken: string) => {
    const res = await shakeHandRefreshToken(refreshToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    return res.data.accessToken;
  }, []);
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        config.headers['Authorization'] = accessToken;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const refreshToken = localStorage.getItem('refreshToken');
          const newAccessToken = await refresh(refreshToken || '');
          localStorage.setItem('accessToken', newAccessToken);
          prevRequest.headers['Authorization'] = newAccessToken;
          return axiosPrivate(prevRequest);
        }
        console.log(error);

        if (!error.response) toast.error(error.message);
        else toast.error((error as any).response.data.message);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};
