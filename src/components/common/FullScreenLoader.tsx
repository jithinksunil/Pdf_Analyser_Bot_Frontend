import { useMemo } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/screenLoader.json';

export function FullScreenLoader() {
  const defaultOptions = useMemo(
    () => ({
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }),
    []
  );

  return (
    <div className='h-screen flex justify-center items-center'>
      <Lottie options={defaultOptions} height={130} width={130} />
    </div>
  );
}
