import React, { useState, useEffect } from 'react';
import { bool, func, shape } from 'prop-types';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
  requiredValidate,
  emailValidate,
  passwordValidate,
  rePasswordValidate,
  lengthValidate4
} from '../../helper/validate';

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
    top: '-10%'
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
  fullName: '',
  password: '',
  rePassword: '',
  email: '',
  userName: '',
  phone: ''
};

const validateAll = err => {
  return !(
    err.fullName !== '' ||
    err.password !== '' ||
    err.rePassword !== '' ||
    err.email !== '' ||
    err.phone !== '' ||
    err.userName !== ''
  );
};

const validateEdit = err => {
  return !(
    err.fullName !== '' ||
    err.email !== '' ||
    err.phone !== '' ||
    err.userName !== ''
  );
};

export default function UserDialog(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    type,
    createUser,
    editUser,
    user = {},
    fromUserWidget = false
  } = props;
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    password: '',
    rePassword: '',
    phone: '',
    email: ''
  });
  const [status, setStatus] = useState(true);
  const [error, setError] = useState(defaultError);

  useEffect(() => {
    const { user } = props;
    setForm({
      fullName: user.name,
      userName: user.username,
      phone: user.phone,
      email: user.email
    });
    return () => {
      setForm({
        fullName: '',
        userName: '',
        phone: '',
        email: ''
      });
      setError(defaultError);
    };
  }, [props]);
  const getTitle = () => {
    return type === 'New'
      ? 'Tạo người dùng mới'
      : 'Sửa đổi thông tin người dùng';
  };
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
  const handleChangeStatus = () => {
    setStatus(!status);
  };
  const handleSubmit = () => {
    let error = {
      fullName: requiredValidate(form.fullName),
      email: emailValidate(form.email),
      password: passwordValidate(form.password),
      rePassword: rePasswordValidate(form.password, form.rePassword),
      userName:
        requiredValidate(form.userName) || lengthValidate4(form.userName),
      phone: requiredValidate(form.phone)
    };
    setError(error);
    if (type === 'New' && validateAll(error)) {
      setError(defaultError);
      createUser({
        name: form.fullName,
        email: form.email,
        password: form.password,
        username: form.userName,
        phone: form.phone,
        confirmed: 1,
        status: status ? 'active' : 'inactive'
      });
    }
    if (type === 'Edit' && validateEdit(error)) {
      setError(defaultError);
      editUser(
        {
          id: user.id,
          name: form.fullName,
          username: form.userName,
          email: form.email,
          phone: form.phone,
          confirmed: 1,
          status: status ? 'active' : 'inactive'
        },
        fromUserWidget
      );
    }
  };
  return (
    <div>
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
          {getTitle()}
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.item}>
            <Container maxWidth="sm" className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="name"
                    label="Tên đầy đủ"
                    variant="outlined"
                    className={classes.textField}
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    margin="normal"
                    error={error.fullName !== ''}
                    helperText={error.fullName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="email"
                    label="Email*"
                    variant="outlined"
                    className={classes.textField}
                    value={form.email}
                    onChange={handleChange('email')}
                    margin="normal"
                    error={error.email !== ''}
                    helperText={error.email}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="phone"
                    label="Phone"
                    variant="outlined"
                    className={classes.textField}
                    value={form.phone}
                    onChange={handleChange('phone')}
                    margin="normal"
                    error={error.phone !== ''}
                    helperText={error.phone}
                  />
                </Grid>
                {!fromUserWidget && (
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="userName"
                      label="Tên đăng nhập"
                      variant="outlined"
                      className={classes.textField}
                      value={form.userName}
                      onChange={handleChange('userName')}
                      margin="normal"
                      error={error.userName !== ''}
                      helperText={error.userName}
                    />
                  </Grid>
                )}
                {type === 'New' && (
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="password"
                      label="Mật khẩu"
                      variant="outlined"
                      className={classes.textField}
                      value={form.password}
                      onChange={handleChange('password')}
                      margin="normal"
                      type="password"
                      error={error.password !== ''}
                      helperText={error.password}
                    />
                  </Grid>
                )}
                {type === 'New' && (
                  <Grid item xs={6}>
                    <TextField
                      id="password"
                      label="Nhập lại mật khẩu"
                      variant="outlined"
                      className={classes.textField}
                      value={form.rePassword}
                      onChange={handleChange('rePassword')}
                      margin="normal"
                      type="password"
                      error={error.rePassword !== ''}
                      helperText={error.rePassword}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={status}
                        onChange={handleChangeStatus}
                      />
                    }
                    className={classes.statusFiel}
                    label="Hoạt động"
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
        </DialogContent>
        {!(type === 'view') && (
          <DialogActions>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Lưu
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

UserDialog.propTypes = {
  open: bool.isRequired,
  handleClose: func.isRequired,
  user: shape(Object),
  edit: bool.isRequired,
  createUser: func,
  updateUser: func
};
