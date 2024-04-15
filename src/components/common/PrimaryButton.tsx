import { memo } from 'react';
import { ButtonLoader } from './ButtonLoader';

type ButtonTypes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type OtherTypes = {
  isLoading?: boolean;
};
type PropTypes = ButtonTypes & OtherTypes;
export const PrimaryButton = memo(
  ({ children, isLoading, ...props }: PropTypes) => {
    return (
      <span className='relative'>
        <button
          {...props}
          className={`${
            props.className
          } h-full bg-primary rounded-custom px-4 py-1 font-medium ${
            isLoading ? 'text-primary' : 'text-secondary'
          } `}
        >
          {children}
        </button>
        {isLoading ? (
          <span className='absolute top-0 left-0 flex h-full w-full justify-center items-center'>
            <ButtonLoader />
          </span>
        ) : null}
      </span>
    );
  }
);
