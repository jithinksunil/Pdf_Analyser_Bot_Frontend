import { ButtonLoader } from './ButtonLoader';

type ButtonTypes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type OtherTypes = {
  isLoading?: boolean;
};
type PropTypes = ButtonTypes & OtherTypes;
export function PrimaryButton({ children, ...props }: PropTypes) {
  return (
    <button
      {...props}
      className={`${props.className} bg-primary rounded-custom px-4 py-1 font-semibold relative`}
    >
      {props.isLoading ? <ButtonLoader /> : null}
      <span className={`${props.isLoading ? 'invisible' : ''} text-secondary`}>
        {children}
      </span>
    </button>
  );
}
