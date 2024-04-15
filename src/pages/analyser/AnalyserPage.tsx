import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useAxiosPrivate } from '../../hooks';
import {
  getAllFiles,
  getAllQuestions,
  getAnswer,
  uploadFile,
} from '../../requests';
import { useNavigate } from 'react-router-dom';
import {
  FullScreenLoader,
  InLayoutLoader,
  PrimaryButton,
} from '../../components/common';
import { AttachFile, Segment } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import toast from 'react-hot-toast';
import { GFile, Question } from '../../interfaces';
import { SideBar } from '../../components/analyser';

export default function AnalyserPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const fileId = searchParams.get('fileId');
  const [files, setFiles] = useState<GFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [questionAnswers, setQuestionAnswers] = useState<Question[]>([]);
  const [question, setQuestion] = useState<string>('');

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [fetchingQuestions, setFetchingQuestions] = useState<boolean>(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchAllFiles = useCallback(async () => {
    try {
      const res = await getAllFiles(axiosPrivate);
      setFiles(res.data.files);
      return res.data.files;
    } catch (error) {
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoadingAnswer(true);

      try {
        const res = await getAnswer(axiosPrivate, question, fileId!);
        setQuestionAnswers(res.data.questions);

        setQuestion('');
      } catch (error) {
      } finally {
        setLoadingAnswer(false);
        if (textRef.current) {
          textRef.current.value = '';
        }
      }
    },
    [textRef.current, question, fileId]
  );
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setUploading(true);
        const file: File = e.target.files![0];
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(axiosPrivate, formData);
        const { id, name, message } = res.data;
        await fetchAllFiles();
        navigate('?fileId=' + id, { replace: true });
        setSelectedFile(name);
        setQuestionAnswers([]);

        toast.success(message);
      } catch (error) {
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [fileRef.current]
  );
  const handleFetchQuestions = useCallback(async (id: string, name: string) => {
    setFetchingQuestions(true);
    setQuestionAnswers([]);
    navigate(`?fileId=${id}`);
    setSelectedFile(name);
    try {
      const res = await getAllQuestions(axiosPrivate, id);
      setQuestionAnswers(res.data.questions);
    } catch (error) {
    } finally {
      setFetchingQuestions(false);
    }
  }, []);

  const initialFetching = useCallback(async () => {
    const files = await fetchAllFiles();
    if (fileId && files) {
      const file = files.find((item) => item.id == fileId);
      handleFetchQuestions(fileId, file!.name);
    }
  }, [fileId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questionAnswers]);

  useEffect(() => {
    initialFetching();
  }, []);
  return isLoadingPage ? (
    <FullScreenLoader />
  ) : (
    <div className='flex h-screen overflow-hidden md:gap-5'>
      <div className='flex-grow grid grid-rows-[1fr_auto] h-full py-10 relative'>
        <div className='overflow-y-auto px-10 md:px-24'>
          {!files.length ? (
            <div className='flex justify-center items-center h-full'>
              No files
            </div>
          ) : !fileId ? (
            <div className='h-full flex items-center justify-center'>
              <p className='text-2xl font-bold text-center max-w-[850px]'>
                Please upload a file or choose one from your Google Drive list
                located in the right sidebar.And ask question related to the
                content of the pdf!
                <br />
              </p>
            </div>
          ) : fetchingQuestions ? (
            <InLayoutLoader />
          ) : !questionAnswers.length ? (
            <div className='h-full flex flex-col items-center justify-center gap-4'>
              <h3 className='text-3xl md:text-5xl font-medium text-center'>
                {selectedFile}
              </h3>
              <p className=' md:text-xl text-center '>How can i help you?</p>
              <p className=' md:text-xl text-center '>
                You can ask question related this pdf!
              </p>
            </div>
          ) : (
            <>
              <h3 className='text-xl md:text-3xl font-bold mb-10'>
                {selectedFile}
              </h3>
              {questionAnswers.map(({ question, answer }, index) => (
                <div
                  key={question}
                  ref={index === questionAnswers.length - 1 ? scrollRef : null}
                  className='mb-6 text-base md:text-lg'
                >
                  <p className='leading-7'>
                    <span className='font-semibold '>Question</span> :{' '}
                    {question}
                  </p>
                  <p className='leading-7'>
                    <span className='font-semibold '>Answer</span> : {answer}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
        <form className='flex gap-3 px-5 md:px-20' onSubmit={handleSubmit}>
          <div className='flex flex-grow rounded-custom bg-slate-300 text-secondary py-1 items-center'>
            <span className='mx-3 border rounded-full'>
              <IconButton
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <ButtonLoader /> : <AttachFile />}
              </IconButton>
            </span>
            <textarea
              ref={textRef}
              className='text-sm md:text-sm w-full h-full bg-transparent resize-none flex-grow focus:outline-none pl-2 pr-5 overflow-hidden'
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              disabled={
                loadingAnswer ||
                !fileId ||
                uploading ||
                isLoadingPage ||
                fetchingQuestions
              }
            />
            <input
              type='file'
              className='hidden'
              ref={fileRef}
              onChange={handleFileChange}
            />
          </div>
          <PrimaryButton
            isLoading={loadingAnswer}
            disabled={
              loadingAnswer ||
              !fileId ||
              !question ||
              uploading ||
              isLoadingPage ||
              fetchingQuestions
            }
            className='!text-sm !md:text-base'
          >
            Get Answer
          </PrimaryButton>
        </form>
        <span className='absolute top-3 right-3 md:hidden'>
          <IconButton
            onClick={() => {
              setShowSidebar(true);
            }}
            size='large'
          >
            <Segment className='text-primary' />
          </IconButton>
        </span>
      </div>
      <div
        className={`${
          showSidebar
            ? 'w-[350px] opacity-100'
            : 'w-0 md:w-[350px] opacity-0 md:opacity-100'
        } duration-300 overflow-y-auto overflow-x-hidden flex-shrink-0 bg-tertiary h-screen absolute md:relative top-0 right-0`}
      >
        <SideBar
          fetchAllFiles={fetchAllFiles}
          files={files}
          handleFetchQuestions={handleFetchQuestions}
          showSideBar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </div>
    </div>
  );
}
