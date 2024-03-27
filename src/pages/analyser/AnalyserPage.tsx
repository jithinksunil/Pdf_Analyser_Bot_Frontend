import { useEffect, useState } from 'react';
import { useAxiosPrivate } from '../../hooks';
import { getAllFiles } from '../../requests';
import { useNavigate } from 'react-router-dom';
import { FullScreenLoader, PrimaryButton } from '../../components/common';

export function AnalyserPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const fetchAllFiles = async () => {
    try {
      const res = await getAllFiles(axiosPrivate);
      setFiles(res.data.files);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllFiles();
  }, []);
  return isLoading ? (
    <FullScreenLoader />
  ) : !files.length ? (
    <div>No files</div>
  ) : (
    <div className='flex h-screen'>
      <div className='flex-grow'></div>
      <div className='w-[250px]'>
        {files.map(({ id, name }, index) => (
          <p
            key={id}
            onClick={() => navigate(`${id}`)}
            className='hover:cursor-pointer hover:bg-slate-400 py-2'
          >
            {index + 1}. {name}
          </p>
        ))}
      </div>
    </div>
  );
}
