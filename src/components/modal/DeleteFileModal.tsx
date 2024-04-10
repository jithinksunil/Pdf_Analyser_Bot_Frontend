import { PrimaryButton } from '../common';
interface PropTypes {
  handleDelete: () => void;
  isDeleting: boolean;
}
export function DeleteFileModal({ handleDelete, isDeleting }: PropTypes) {
  return (
    <div className='flex justify-evenly'>
      <PrimaryButton
        onClick={handleDelete}
        disabled={isDeleting}
        isLoading={isDeleting}
      >
        Delete
      </PrimaryButton>
    </div>
  );
}
