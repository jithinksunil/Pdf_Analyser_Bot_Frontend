import { memo } from 'react';
import { PrimaryButton } from '../common';
interface PropTypes {
  handleDelete: () => Promise<void>;
  deleting: boolean;
  handleClose: () => void;
}
export const DeleteFileModal = memo(
  ({ handleDelete, deleting, handleClose }: PropTypes) => {
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
);
