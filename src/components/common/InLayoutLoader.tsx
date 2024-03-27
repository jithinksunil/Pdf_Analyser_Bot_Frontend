import { useMemo } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/screenLoader.json';

export function InLayoutLoader() {
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
    <div className='h-full flex justify-center items-center w-full'>
      <Lottie options={defaultOptions} height={130} width={130} />
    </div>
  );
}
