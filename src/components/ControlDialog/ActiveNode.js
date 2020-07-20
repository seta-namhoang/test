import React from 'react';
import get from 'lodash/get';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { requiredValidate } from '../../helper/validate';
import { isObjectEmpty } from '../../helper/util';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%'
  },
  dialogContent: {
    overflowY: 'unset'
  }
}));

const defaultForm = {
  node_serial: '',
  name: '',
  business: ''
};

export default function UpdateActiveInfo({ open, handleClose, handleActive }) {
  const classes = useStyles();
  const [formData, setFormData] = React.useState(defaultForm);
  const [formError, setFormError] = React.useState(defaultForm);

  const handleChange = type => event => {
    const value = event.target.value;
    setFormError(error => ({
      ...error,
      [type]: ''
    }));
    setFormData(form => ({
      ...form,
      [type]: value
    }));
  };
  const isValidFormInfo = () => {
    const error = {
      ...formError,
      node_serial: requiredValidate(formData.node_serial),
      // business: requiredValidate(formData.business),
      name: requiredValidate(formData.name)
    };
    setFormError(error);
    if (!isObjectEmpty(error)) {
      return false;
    }
    return true;
  };

  const onSaveClick = async () => {
    if (isValidFormInfo()) {
      handleActive(formData);
      setTimeout(() => {
        handleClose();
        setFormData(defaultForm);
      }, 500);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle id="alert-dialog-slide-title">
        Thông tin cảm biến
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="node_serial"
              label="Serial*"
              variant="outlined"
              className={classes.textField}
              value={formData.node_serial}
              onChange={handleChange('node_serial')}
              margin="normal"
              error={formError.node_serial !== ''}
              helperText={formError.node_serial}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="name"
              label="Tên cảm biến*"
              variant="outlined"
              className={classes.textField}
              value={formData.name}
              onChange={handleChange('name')}
              margin="normal"
              error={formError.name !== ''}
              helperText={formError.name}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              id="business"
              label="Loại hình kinh doanh"
              variant="outlined"
              className={classes.textField}
              value={formData.business}
              onChange={handleChange('business')}
              margin="normal"
              error={formError.business !== ''}
              helperText={formError.business}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        <Button onClick={onSaveClick} color="primary" variant="contained">
          Kích hoạt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
