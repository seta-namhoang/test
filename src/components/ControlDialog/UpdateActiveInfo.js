import React from 'react';
import get from 'lodash/get';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
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
  lat: '',
  lng: '',
  name: '',
  business: '',
  address: '',
  agent_phone: ''
};
const defaultError = {
  lat: '',
  lng: '',
  name: '',
  business: '',
  address: '',
  agent_phone: ''
};

const validateAgentPhone = phones => {
  if (!phones.trim()) {
    return 'Phải điền ít nhất một số điện thoại';
  }

  return '';
};

export default function UpdateActiveInfo({
  gateway,
  open,
  handleClose,
  handleSave
}) {
  const classes = useStyles();
  const [formData, setFormData] = React.useState({ defaultForm });
  const [formError, setFormError] = React.useState(defaultError);

  React.useEffect(() => {
    setFormData({
      lat: get(gateway, 'gateway_config.lat'),
      lng: get(gateway, 'gateway_config.lng'),
      name: get(gateway, 'gateway_config.name'),
      business: get(gateway, 'gateway_config.business'),
      address: get(gateway, 'gateway_config.address'),
      agent_phone: get(gateway, 'gateway_config.agent_phone')
    });
  }, []);

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
      lat: requiredValidate(formData.lat),
      lng: requiredValidate(formData.lng),
      name: requiredValidate(formData.name),
      address: requiredValidate(formData.address),
      agent_phone: validateAgentPhone(formData.agent_phone)
    };
    setFormError(error);
    if (!isObjectEmpty(error)) {
      return false;
    }
    return true;
  };

  const onSaveClick = async () => {
    if (isValidFormInfo()) {
      handleSave({
        ...formData,
        agent_phone: formData.agent_phone.split(','),
        lat: formData.lat,
        lng: formData.lng
      });
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={handleClose}>
      <DialogTitle id="alert-dialog-slide-title">
        Thông tin chi tiết
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={3}>
          {/* <Grid item xs={6}>
            <TextField
              id="lat"
              label="Vĩ độ (lat)*"
              variant="outlined"
              className={classes.textField}
              value={formData.lat}
              onChange={handleChange('lat')}
              margin="normal"
              error={formError.lat !== ''}
              helperText={formError.lat}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="lng"
              label="Kinh độ (lng)*"
              variant="outlined"
              className={classes.textField}
              value={formData.lng}
              onChange={handleChange('lng')}
              margin="normal"
              error={formError.lng !== ''}
              helperText={formError.lng}
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              id="name"
              label="Tên gateway*"
              variant="outlined"
              className={classes.textField}
              value={formData.name}
              onChange={handleChange('name')}
              margin="normal"
              error={formError.name !== ''}
              helperText={formError.name}
            />
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="address"
              label="Địa chỉ*"
              variant="outlined"
              className={classes.textField}
              value={formData.address}
              onChange={handleChange('address')}
              margin="normal"
              error={formError.address !== ''}
              helperText={formError.address}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="agent_phone"
              label="Số điện thoại(cách nhau bởi dấu ',')"
              variant="outlined"
              className={classes.textField}
              value={formData.agent_phone}
              onChange={handleChange('agent_phone')}
              margin="normal"
              error={formError.agent_phone !== ''}
              helperText={formError.agent_phone}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSaveClick} color="primary" variant="contained">
          Lưu
        </Button>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
