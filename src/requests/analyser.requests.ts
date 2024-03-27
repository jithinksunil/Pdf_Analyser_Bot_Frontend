import { Axios } from 'axios';

export const getAllFiles = (axiosPrivate: Axios) => {
  return axiosPrivate.get<{ files: [{ id: string; name: string }] }>(
    '/analyser/get-files'
  );
};

export const getAnswer = (
  axiosPrivate: Axios,
  question: string,
  fileId: string
) => {
  return axiosPrivate.post<{ answer: string }>('/analyser/' + fileId, {
    question,
  });
};
