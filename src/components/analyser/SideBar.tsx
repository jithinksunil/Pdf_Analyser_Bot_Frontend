import { Close, Delete, Download, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ButtonLoader } from '../common/ButtonLoader';
import { DeleteFileModal, ModalLayout } from '../modal';
import { Dispatch, useEffect, useState } from 'react';
import { deleteFile, downloadFile, getUserEmail } from '../../requests';
import toast from 'react-hot-toast';
import { useAxiosPrivate } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { GFile } from '../../interfaces';

interface PropTypes {
  setShowSidebar: Dispatch<boolean>;
  showSideBar: boolean;
  fetchAllFiles: () => Promise<GFile[] | undefined>;
  files: GFile[];
  handleFetchQuestions: (id: string, name: string) => Promise<void>;
}

export function SideBar({
  setShowSidebar,
  fetchAllFiles,
  files,
  handleFetchQuestions,
}: PropTypes) {
  const [email, setEmail] = useState<string>('');

  const [downloading, setDownloading] = useState<boolean>(false);
  const [fileDownload, setFileDownload] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const fileId = searchParams.get('fileId');

  const axiosPrivate = useAxiosPrivate();

  const handleDownload = async (id: string) => {
    setFileDownload(id);
    setDownloading(true);
    try {
      const res = await downloadFile(axiosPrivate, id);
      toast.success(res.data.message);
      window.open(res.data.publicUrl);
    } catch (error) {
    } finally {
      setDownloading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      const res = await deleteFile(axiosPrivate, id);
      await fetchAllFiles();
      if (fileId == id) {
        navigate('/analyser');
      }
      toast.success(res.data.message);
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
    toast.success('Logged out');
  };
  const getchEmail = async () => {
    const res = await getUserEmail(axiosPrivate);
    setEmail(res.data.email);
  };

  useEffect(() => {
    getchEmail();
  }, []);
  return (
    <>
      <div className='sticky top-0 bg-tertiary h-16  border-b border-gray-600 flex items-center z-10 pr-2'>
        <span className='md:hidden'>
          <IconButton
            onClick={() => {
              setShowSidebar(false);
            }}
          >
            <Close className='text-primary' />
          </IconButton>
        </span>
        <h3 className='ml-1 md:ml-10 flex-grow'>{email}</h3>
        <IconButton onClick={handleLogout}>
          <Logout className='text-primary' />
        </IconButton>
      </div>
      <div className='w-[calc(100%-10px)] pb-16'>
        {files.map(({ id, name }, index) => (
          <div
            key={id}
            className={`flex items-center hover:cursor-pointer hover:text-secondary hover:bg-quaternary pr-2 ${
              fileId == id ? '!bg-primary text-black' : ''
            }`}
          >
            <p
              onClick={() => {
                handleFetchQuestions(id, name);
                setShowSidebar(false);
              }}
              key={id}
              className={`flex-grow text-sm md:text-base  pl-10 pr-3 py-3 ${
                fileId == id ? 'text-secondary' : ''
              }`}
            >
              {index + 1}. {name}
            </p>
            <div>
              <IconButton onClick={() => handleDownload(id)}>
                {downloading && fileDownload == id ? (
                  <ButtonLoader />
                ) : (
                  <Download
                    className={`${
                      fileId == id ? 'text-secondary' : 'text-primary'
                    }`}
                  />
                )}
              </IconButton>
            </div>
            <div>
              <ModalLayout
                Component={DeleteFileModal}
                props={{
                  handleDelete: async () => {
                    await handleDelete(id);
                  },
                  deleting,
                }}
              >
                <IconButton>
                  <Delete
                    className={`${
                      fileId == id ? 'text-secondary' : 'text-primary'
                    }`}
                  />
                </IconButton>
              </ModalLayout>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
