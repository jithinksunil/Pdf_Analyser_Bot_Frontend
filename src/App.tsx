import { useState } from 'react';
import { axiosPrivate } from './api/axios';

function App() {
  const [file, setFile] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessToken', name);
    try {
      const res = await axiosPrivate.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This header is often unnecessary as browsers can automatically set it correctly with the boundary
        },
      });
      console.log(res.data);
      console.log('image uploaded');
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const res = await axiosPrivate.get('/api');
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='file'
        onChange={(e: any) => {
          setFile(e.target.files[0]);
        }}
      />
      <input
        type='text'
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button type='submit'>Fetch</button>
    </form>
  );
}
export default App;
