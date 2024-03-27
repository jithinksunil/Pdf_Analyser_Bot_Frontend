import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAxiosPrivate } from '../../hooks';
import { getAllFiles, getAnswer } from '../../requests';
import { useNavigate, useParams } from 'react-router-dom';
import { FullScreenLoader, PrimaryButton } from '../../components/common';

export function AnalyserPage() {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
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
  const [answer, setAnswer] = useState<string>('');
  const [questionAnswers, setQuestionAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (textRef.current) {
      textRef.current.value = '';
    }
    try {
      const res = await getAnswer(axiosPrivate, question, fileId!);
      setAnswer(res.data.answer);
      setQuestionAnswers([
        ...questionAnswers,
        { question, answer: res.data.answer },
      ]);
      setQuestion('')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllFiles();
  }, []);
  return isLoadingPage ? (
    <FullScreenLoader />
  ) : !files.length ? (
    <div>No files</div>
  ) : (
    <div className='flex h-screen overflow-hidden p-5 pr-0 gap-5'>
      <div className='flex-grow grid grid-rows-[1fr_auto] h-full'>
        <div className='overflow-y-auto'>
          {questionAnswers.length ? (
            <>
              {questionAnswers.map(({ question, answer }) => (
                <>
                  <p>Question: {question}</p>
                  <p>Answer: {answer}</p>
                </>
              ))}
              {question ? <p>Question: {question}</p> : null}
            </>
          ) : (
            <p>No Questions Asked</p>
          )}
        </div>
        <div>
          <form className='flex gap-3' onSubmit={handleSubmit}>
            <textarea
              ref={textRef}
              className='flex-grow rounded-md bg-slate-300'
              onChange={(e) => {
                if (answer) {
                  setQuestionAnswers([
                    ...questionAnswers,
                    { question, answer },
                  ]);
                  setAnswer('');
                }
                setQuestion(e.target.value);
              }}
            />
            <PrimaryButton isLoading={loading} disabled={loading}>
              Get Answer
            </PrimaryButton>
          </form>
        </div>
      </div>
      <div className='w-[300px] overflow-y-auto'>
        {files.map(({ id, name }, index) => (
          <p
            key={id}
            onClick={() => navigate(`?fileId=${id}`)}
            className='hover:cursor-pointer hover:bg-slate-400 py-2'
          >
            {index + 1}. {name}
          </p>
        ))}
      </div>
    </div>
  );
}
