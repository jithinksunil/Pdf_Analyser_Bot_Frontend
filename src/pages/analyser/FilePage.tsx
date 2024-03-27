import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxiosPrivate } from '../../hooks';
import { getAnswer } from '../../requests';

export function FilePage() {
  const { fileId } = useParams();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getAnswer(axiosPrivate, question, fileId!);
      setAnswer(res.data.answer);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return !fileId ? (
    <div>No files selected</div>
  ) : (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          className='border roundec'
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button
          disabled={loading}
          type='submit'
          className='bg-orange-800 p-2 text-white'
        >
          {loading ? 'Loading...' : 'Get answer'}
        </button>
      </form>
      <p>{answer || 'No questions asked'}</p>
    </>
  );
}
