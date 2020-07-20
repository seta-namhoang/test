import React, { useState } from 'react';
import { bool, func } from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { passwordValidate, rePasswordValidate } from '../../helper/validate';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    marginTop: '0',
    width: '100%'
  },
  container: {
    padding: '0',
    marginRight: '15px'
  },
  paperDialog: {
    top: '-15%'
  },
  statusFiel: {
    marginLeft: 0
  }
});

const useStyles = makeStyles(styles);

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: '5px 15px',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const defaultError = {
  oldPassword: '',
  password: '',
  rePassword: ''
};

const validateAll = err => {
  return !(
    err.oldPassword !== '' ||
    err.password !== '' ||
    err.rePassword !== ''
  );
};

export default function UserDialog(props) {
  const classes = useStyles();
  const { open, handleClose, onSubmit } = props;
  const [form, setForm] = useState({
    oldPassword: '',
    password: '',
    rePassword: ''
  });
  const [error, setError] = useState(defaultError);
  const handleChange = type => event => {
    setForm({
      ...form,
      [type]: event.target.value
    });
    setError({
      ...error,
      [type]: ''
    });
  };
  const handleSubmit = () => {
    let error = {
      oldPassword: passwordValidate(form.oldPassword),
      password: passwordValidate(form.password),
      rePassword: rePasswordValidate(form.password, form.rePassword)
    };
    setError(error);
    if (validateAll(error)) {
      onSubmit(form);
    }
  };
  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        classes={{
          paper: classes.paperDialog
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Đổi mật khẩu
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.item}>
            <Container maxWidth="sm" className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="oldPassword"
                    label="Mật khẩu cũ"
                    className={classes.textField}
                    value={form.oldPassword}
                    onChange={handleChange('oldPassword')}
                    margin="normal"
                    type="password"
                    error={error.oldPassword !== ''}
                    helperText={error.oldPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="password"
                    label="Mật khẩu"
                    className={classes.textField}
                    onChange={handleChange('password')}
                    margin="normal"
                    type="password"
                    error={error.password !== ''}
                    helperText={error.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label="Nhập lại mật khẩu"
                    className={classes.textField}
                    value={form.rePassword}
                    onChange={handleChange('rePassword')}
                    margin="normal"
                    type="password"
                    error={error.rePassword !== ''}
                    helperText={error.rePassword}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserDialog.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  onSubmit: func
};
