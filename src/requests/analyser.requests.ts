import { Axios } from 'axios';

export const getAllFiles = (axiosPrivate: Axios) =>
  axiosPrivate.get<{ files: [{ id: string; name: string }] }>(
    '/analyser/get-files'
  );

export const getAnswer = (
  axiosPrivate: Axios,
  question: string,
  fileId: string
) =>
  axiosPrivate.post<{ answer: string }>('/analyser/' + fileId, {
    question,
  });

export const uploadFile = (axiosPrivate: Axios, formData: FormData) =>
  axiosPrivate.post<{ fileId: string; name: string; message: string }>(
    '/file/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
