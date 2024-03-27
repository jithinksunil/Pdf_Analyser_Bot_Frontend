export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
export interface GetGoogleUrlResponse {
  url: string;
}
export interface GenarateTokenRensponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}
