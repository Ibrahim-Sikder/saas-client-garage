/* eslint-disable react/prop-types */
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';



export default function TASRightSideModal({
  open = false,
  setOpen,
  title = '',
  children,
  width = '900px', 
  sx,
}) {
  const toggleDrawer = (open) => (
    event
  ) => {
    if (
      event.type === 'keydown' &&
      ((event).key === 'Tab' ||
        (event).key === 'Shift')
    ) {
      return;
    }
    setOpen(open);
  };

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          ...sx,
          '& .MuiDrawer-paper': {
            width: width, 
            transition: 'transform 0.5s ease-in-out', 
            transform: open ? 'translateX(0)' : 'translateX(100%)',
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={{
          enter: 400, 
          exit: 300, 
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {title && (
          <p className='font-bold mt-4 ml-4 md:text-2xl'>{title}</p>
          
        )}
        <div>{children}</div>
      </Drawer>
    </React.Fragment>
  );
}
