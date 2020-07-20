import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => createStyles({}));

const DLDialog = withStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  paper: {
    borderBottomRightRadius: '8px',
    borderTopRightRadius: '8px',
    margin: 0,
    height: '100%',
    width: '60%',
    maxHeight: 'calc(100%)'
  }
}))(Dialog);

export default function CustomDialog({ children, open = false, onClose }) {
  const classes = useStyles({});

  return (
    <div>
      <DLDialog
        open={open}
        onClose={onClose}
        aria-labelledby="custom-dialog"
        fullWidth={true}
        maxWidth="xl"
      >
        {children}
      </DLDialog>
    </div>
  );
}
