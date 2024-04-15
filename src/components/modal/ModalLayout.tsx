import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { memo, ReactNode, useCallback, useState } from 'react';
import { Colors } from '../../utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 350,
  border: `1px solid ${Colors.PENTA}`,
  boxShadow: 24,
  borderRadius: '10px',
  padding: '24px',
  outline: 'none',
};

interface PropTypes {
  children: ReactNode;
  Component: any;
  props: any;
}

export const ModalLayout = memo(({ children, Component, props }: PropTypes) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div>
      <div className='hover:cursor-pointer' onClick={handleOpen}>
        {children}
      </div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open} className=' bg-black'>
          <Box sx={style}>
            <Component {...props} handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
});
