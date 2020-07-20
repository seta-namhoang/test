import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

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
  titleDialog: {
    color: '#456083'
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6" className={classes.titleDialog}>
        {children}
      </Typography>
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
    margin: '5px 20px 15px',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function ExtendTimeDialog({
  open,
  handleClose,
  handleSubmit,
  gateway = {}
}) {
  const [time] = React.useState(new Date());
  const handleSubmitData = () => {
    handleSubmit(moment(time).format('DD-MM-YYYY'));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">Gia hạn thời gian</DialogTitle>
      <DialogContent>
        {/* <Container maxWidth="sm" className={cx(styles['container'])}>
          <div>Chọn mốc thời gian:</div>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/DD/YYYY"
              minDate={minDate}
              margin="normal"
              id="date-picker-inline"
              label="Thời gian"
              value={time}
              onChange={handleChangeTime}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </Container> */}
        <DialogContentText id="alert-dialog-description">
          Bạn có chắc muốn ra hạn thêm 1 năm cho gateway có serial là{' '}
          {gateway.imei} không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmitData} color="primary">
          Gia hạn
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Huỷ bỏ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
