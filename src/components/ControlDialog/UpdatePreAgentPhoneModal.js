import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
  input: {
    width: '100%'
  }
}));

export default function UpdatePreAgentPhoneModal({
  gateway,
  open,
  phones,
  handleClose,
  updatePremiumAgentPhone
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newPhones, setNewPhone] = React.useState('');
  const handleChange = e => {
    const value = e.target.value;
    setNewPhone(value);
  };

  const onSaveClick = async () => {
    dispatch(updatePremiumAgentPhone(_.get(gateway, 'id', ''), newPhones));
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle id="alert-dialog-slide-title">
        Thông tin chi tiết
      </DialogTitle>
      <DialogContent>
        <TextField
          id="outlined-multiline-static"
          label="Danh sách số điện thoại"
          multiline
          rows="5"
          defaultValue={phones}
          onChange={handleChange}
          variant="outlined"
          className={classes.input}
          helperText={`* Các số điện thoại cách nhau bởi dấu ","`}
        />
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
