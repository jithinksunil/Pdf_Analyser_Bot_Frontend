import { Axios } from 'axios';
import {
  DeleteFileResponse,
  DownloadFileResponse,
  GetAllFilesResponse,
  GetAnswerResponse,
  GetQuestionResponse,
  UploadFileResponse,
} from '../interfaces';

export const getAllFiles = (axiosPrivate: Axios) =>
  axiosPrivate.get<GetAllFilesResponse>('/analyser/get-files');

export const getAnswer = (
  axiosPrivate: Axios,
  question: string,
  fileId: string
) =>
  axiosPrivate.post<GetAnswerResponse>('/analyser/' + fileId, {
    question,
  });

export const uploadFile = (axiosPrivate: Axios, formData: FormData) =>
  axiosPrivate.post<UploadFileResponse>('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getAllQuestions = (axiosPrivate: Axios, fileId: string) =>
  axiosPrivate.get<GetQuestionResponse>('/analyser/get-questions/' + fileId);

export const deleteFile = (axiosPrivate: Axios, fileId: string) =>
  axiosPrivate.delete<DeleteFileResponse>('/file/delete/' + fileId);

export const downloadFile = (axiosPrivate: Axios, fileId: string) =>
  axiosPrivate.get<DownloadFileResponse>('/file/download/' + fileId);
