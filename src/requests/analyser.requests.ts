import { Axios } from 'axios';

export const getAllFiles = (axiosPrivate: Axios) =>
  axiosPrivate.get<{ files: [{ id: string; name: string }]; email: string }>(
    '/analyser/get-files'
  );

export const getAnswer = (
  axiosPrivate: Axios,
  question: string,
  fileId: string
) =>
  axiosPrivate.post<{ questions: { question: string; answer: string }[] }>(
    '/analyser/' + fileId,
    {
      question,
    }
  );

export const uploadFile = (axiosPrivate: Axios, formData: FormData) =>
  axiosPrivate.post<{ fileId: string; name: string; message: string }>(
    '/file/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
export const getAllQuestions = (axiosPrivate: Axios, fileId: string) =>
  axiosPrivate.get<{ questions: { question: string; answer: string }[] }>(
    '/analyser/get-questions/' + fileId
  );

export const deleteFile = (axiosPrivate: Axios, fileId: string) =>
  axiosPrivate.delete<{ message: string }>('/file/delete/' + fileId);
