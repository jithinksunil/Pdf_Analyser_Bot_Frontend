import { ButtonLoader } from './ButtonLoader';

type ButtonTypes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type OtherTypes = {
  isLoading?: boolean;
};
type PropTypes = ButtonTypes & OtherTypes;
export function PrimaryButton({ children, isLoading, ...props }: PropTypes) {
  return (
    <button
      {...props}
      className={`${props.className} bg-primary rounded-custom px-4 py-1 font-semibold relative`}
    >
      {isLoading ? (
        <span className='absolute top-0 left-0 flex h-full w-full justify-center items-center'>
          <ButtonLoader />
        </span>
      ) : null}
      <span className={`${isLoading ? 'invisible' : ''} text-secondary`}>
        {children}
      </span>
    </button>
  );
}
