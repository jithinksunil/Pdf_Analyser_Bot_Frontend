import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAxiosPrivate } from '../../hooks';
import { getAllFiles, getAnswer, uploadFile } from '../../requests';
import { useNavigate } from 'react-router-dom';
import { FullScreenLoader, PrimaryButton } from '../../components/common';

export function AnalyserPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const fetchAllFiles = async () => {
    try {
      const res = await getAllFiles(axiosPrivate);
      setFiles(res.data.files);
    } catch (error) {
      console.log(error);
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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await getAnswer(axiosPrivate, question, fileId!);
      setQuestionAnswers([
        ...questionAnswers,
        { question, answer: res.data.answer },
      ]);
      if (textRef.current) {
        textRef.current.value = '';
      }
      setQuestion('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file: File = e.target.files![0];
      console.log(file);

      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(axiosPrivate, formData);
      const { fileId, name, message } = res.data;
      setSelectedFile(name);
      navigate('?fileId=' + fileId, { replace: true });
      await fetchAllFiles();
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAllFiles();
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
              <p>Upload a file of select one from the list</p>
            </div>
          ) : !questionAnswers.length ? (
            <div className='h-full flex flex-col items-center justify-center gap-4'>
              <h3 className='text-5xl font-medium text-center'>
                {selectedFile}
              </h3>
              <p className='text-xl text-center'>How can i help you?</p>
            </div>
          ) : (
            <>
              <h3 className='text-3xl font-bold mb-10'>{selectedFile}</h3>
              {questionAnswers.map(({ question, answer }) => (
                <div className='mb-6'>
                  <p className='leading-7'>Question: {question}</p>
                  <p className='leading-7'>Answer: {answer}</p>
                </div>
              ))}
            </>
          )}
        </div>
        <form className='flex gap-3 px-5 md:px-20' onSubmit={handleSubmit}>
          <p onClick={() => fileRef.current?.click()} className='hover:cursor-pointer'>File</p>
          <input
            type='file'
            className='hidden'
            ref={fileRef}
            onChange={handleFileChange}
          />
          <textarea
            ref={textRef}
            className='flex-grow rounded-custom bg-slate-300 text-secondary px-3 py-1 focus:outline-none'
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            disabled={!fileId}
          />
          <PrimaryButton isLoading={loading} disabled={loading || !fileId}>
            Get Answer
          </PrimaryButton>
        </form>
        <p
          className='absolute top-0 right-0 cursor-pointer md:hidden'
          onClick={() => {
            setShowSidebar(true);
          }}
        >
          Open
        </p>
      </div>
      <div
        className={`${
          showSidebar
            ? 'w-[300px] opacity-100'
            : 'w-0 md:w-[300px] opacity-0 md:opacity-100'
        } duration-300 overflow-y-auto overflow-x-hidden flex-shrink-0 bg-tertiary h-screen absolute md:relative top-0 right-0 py-10`}
      >
        <div className='w-[290px] relative '>
          {files.map(({ id, name }, index) => (
            <p
              key={id}
              onClick={() => {
                navigate(`?fileId=${id}`);
                setSelectedFile(name);
              }}
              className={`hover:cursor-pointer hover:bg-quaternary hover:text-secondary py-3 px-10 mr-1 ${
                fileId == id ? 'bg-primary text-secondary' : ''
              }`}
            >
              {index + 1}. {name}
            </p>
          ))}
          <p
            className='absolute top-0 left-0 cursor-pointer md:hidden'
            onClick={() => {
              setShowSidebar(false);
            }}
          >
            close
          </p>
        </div>
      </div>
    </div>
  );
}
