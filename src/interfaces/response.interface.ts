import { GFile, Question } from './other.interface';

export interface RefreshResponse {
  accessToken: string;
  message: string;
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

export interface GetAllFilesResponse {
  files: GFile[];
}

export interface GetAnswerResponse {
  questions: Question[];
}

export interface GetQuestionResponse extends GetAnswerResponse {}

export interface UploadFileResponse extends GFile {
  message: string;
}

export interface DeleteFileResponse {
  message: string;
}
export interface DownloadFileResponse {
  message: string;
  publicUrl: string;
}
