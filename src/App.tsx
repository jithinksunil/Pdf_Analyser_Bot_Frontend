import { axiosPrivate } from './axios';

function App() {
  const fetch = async () => {
    try {
      const res = await axiosPrivate.get('/');
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button type='button' onClick={fetch}>
      Fetch
    </button>
  );
}
export default App;
