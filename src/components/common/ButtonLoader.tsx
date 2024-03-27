import { Children, useMemo } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/buttonLoader.json';

export function ButtonLoader() {
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
    <span className='absolute top-0 left-0 flex h-full w-full justify-center items-center'>
      <span>
        <Lottie options={defaultOptions} height={24} />
      </span>
    </span>
  );
}
