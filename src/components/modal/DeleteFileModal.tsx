import { PrimaryButton } from '../common';
interface PropTypes {
  handleDelete: () => void;
  deleting: boolean;
  handleClose: () => void;
}
export function DeleteFileModal({
  handleDelete,
  deleting,
  handleClose,
}: PropTypes) {
  return (
    <div className='flex justify-evenly'>
      <PrimaryButton
        onClick={async () => {
          await handleDelete();
          handleClose();
        }}
        disabled={deleting}
        isLoading={deleting}
      >
        Delete
      </PrimaryButton>
    </div>
  );
}
