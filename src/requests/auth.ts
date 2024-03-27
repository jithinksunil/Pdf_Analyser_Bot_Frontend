import { axiosPublic } from '../api/axios';
import {
  GenarateTokenRensponse,
  GetGoogleUrlResponse,
  RefreshResponse,
} from '../interfaces';

export const shakeHandRefreshToken = (refreshToken: string) => {
  return axiosPublic.patch<RefreshResponse>('/auth/google/refresh', {
    refreshToken,
  });
};

export const getGoogleUrl = () =>
  axiosPublic.get<GetGoogleUrlResponse>('/auth/google/signin');
export const genarateToken = (code: string) =>
  axiosPublic.get<GenarateTokenRensponse>(
    '/auth/google/generate-token?code=' + code
  );
