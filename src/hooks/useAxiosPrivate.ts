import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { shakeHandRefreshToken } from '../requests';
import toast from 'react-hot-toast';

export const useAxiosPrivate = () => {
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        config.headers['Authorization'] = accessToken;
        return config;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
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
          const {
            data: { accessToken },
          } = await shakeHandRefreshToken(refreshToken || '');
          localStorage.setItem('accessToken', accessToken);
          prevRequest.headers['Authorization'] = accessToken;
          return axiosPrivate(prevRequest);
        }
        if (!error.response) toast.error(error.message);
        else toast.error((error as any).response.data.message);
        console.log(error);
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
