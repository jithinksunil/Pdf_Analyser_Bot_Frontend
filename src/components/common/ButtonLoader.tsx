import { memo, useMemo } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../lotties/buttonLoader.json';

export const ButtonLoader = memo(() => {
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
    <span>
      <Lottie options={defaultOptions} height={24} />
    </span>
  );
});
