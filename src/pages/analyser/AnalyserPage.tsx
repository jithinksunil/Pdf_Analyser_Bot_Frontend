import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAxiosPrivate } from '../../hooks';
import {
  deleteFile,
  getAllFiles,
  getAllQuestions,
  getAnswer,
  uploadFile,
} from '../../requests';
import { useNavigate } from 'react-router-dom';
import { FullScreenLoader, PrimaryButton } from '../../components/common';
import {
  AttachFile,
  Close,
  Delete,
  Logout,
  Segment,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import toast from 'react-hot-toast';

export function AnalyserPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>('');
  const fetchAllFiles = async () => {
    try {
      const res = await getAllFiles(axiosPrivate);
      setFiles(res.data.files);
      setEmail(res.data.email);
    } catch (error) {
    } finally {
      setIsLoadingPage(false);
    }
  };
  const searchParams = new URLSearchParams(window.location.search);

  const fileId = searchParams.get('fileId');

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string>('');
  const [questionAnswers, setQuestionAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deletingFile, setDeletingFile] = useState<string>('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await getAnswer(axiosPrivate, question, fileId!);
      setQuestionAnswers(res.data.questions);
      if (textRef.current) {
        textRef.current.value = '';
      }
      setQuestion('');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file: File = e.target.files![0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(axiosPrivate, formData);
      const { fileId, name, message } = res.data;
      navigate('?fileId=' + fileId, { replace: true });
      setSelectedFile(name);
      setQuestionAnswers([]);
      await fetchAllFiles();
      toast.success(message);
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };
  const handleFetchQuestions = async (id: string, name: string) => {
    setQuestionAnswers([]);
    navigate(`?fileId=${id}`);
    setSelectedFile(name);
    try {
      const res = await getAllQuestions(axiosPrivate, id);
      setQuestionAnswers(res.data.questions);
    } catch (error) {}
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
    toast.success('Logged out');
  };
  const handleDelete = async (id: string) => {
    try {
      setDeletingFile(id);
      setDeleting(true);
      const res = await deleteFile(axiosPrivate, id);
      await fetchAllFiles();
      toast.success(res.data.message);
    } catch (error) {
    } finally {
      setDeleting(false);
      setDeletingFile('');
    }
  };
  useEffect(() => {
    fetchAllFiles();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questionAnswers]);
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
              <p className='text-2xl font-bold text-center'>
                Upload a file or select one from your Drive list.
                <br />
                To ask question related to the content of the pdf!
              </p>
            </div>
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
              {questionAnswers.map(({ question, answer }) => (
                <div ref={scrollRef} className='mb-6 text-base md:text-lg'>
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
              disabled={!fileId}
            />
            <input
              type='file'
              className='hidden'
              ref={fileRef}
              onChange={handleFileChange}
            />
          </div>
          <PrimaryButton
            isLoading={loading}
            disabled={
              loading || !fileId || !question || uploading || isLoadingPage
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
            ? 'w-[300px] opacity-100'
            : 'w-0 md:w-[300px] opacity-0 md:opacity-100'
        } duration-300 overflow-y-auto overflow-x-hidden flex-shrink-0 bg-tertiary h-screen absolute md:relative top-0 right-0`}
      >
        <div className='sticky top-0 bg-tertiary h-16  border-b border-gray-600 flex items-center z-10'>
          <span className='md:hidden'>
            <IconButton
              onClick={() => {
                setShowSidebar(false);
              }}
            >
              <Close className='text-primary' />
            </IconButton>
          </span>
          <h3 className='ml-1 md:ml-10'>{email}</h3>
          <IconButton onClick={handleLogout}>
            <Logout className='text-primary' />
          </IconButton>
        </div>
        <div className='w-[290px] pb-16'>
          {files.map(({ id, name }, index) => (
            <div
              onClick={() => {
                handleFetchQuestions(id, name);
              }}
              className={`flex items-center gap-3 hover:cursor-pointer  hover:text-secondary hover:bg-quaternary pl-10 pr-2 py-3 ${
                fileId == id ? '!bg-primary text-black' : ''
              }`}
            >
              <p
                key={id}
                className={`flex-grow text-sm md:text-base ${
                  fileId == id ? 'text-secondary' : ''
                }`}
              >
                {index + 1}. {name}
              </p>
              <IconButton
                onClick={() => {
                  handleDelete(id);
                }}
              >
                {deleting && id == deletingFile ? (
                  <ButtonLoader />
                ) : (
                  <Delete
                    className={`${
                      fileId == id
                        ? 'rounded-full text-secondary'
                        : 'text-primary'
                    }`}
                  />
                )}
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
