import React from 'react';
import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import SelectPosition from '../ActiveInMap/SelectPosition';

const DialogTitle = withStyles({
  root: {
    margin: 0,
    padding: '10px'
  },
  closeButton: {
    position: 'absolute',
    right: '5px',
    top: '5px'
  }
})(props => {
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
    padding: 0
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: '5px 15px',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const defaultForm = {
  lat: '',
  lng: '',
  name: '',
  business: '',
  address: '',
  agent_phone: ''
};

const EditPosition = ({ open, gateway, handleSave, handleClose }) => {
  const [selectedPosition, setSelectedPosition] = React.useState(null);
  const [formData, setFormData] = React.useState({ defaultForm });

  React.useEffect(() => {
    const agentPhoneStr = get(gateway, 'gateway_config.agent_phone', '');
    const agentPhone = agentPhoneStr.includes(',')
      ? agentPhoneStr.split(',')
      : [agentPhoneStr];
    setFormData({
      lat: get(gateway, 'gateway_config.lat'),
      lng: get(gateway, 'gateway_config.lng'),
      name: get(gateway, 'gateway_config.name'),
      business: get(gateway, 'gateway_config.business'),
      address: get(gateway, 'gateway_config.address'),
      agent_phone: agentPhone
    });
  }, []);
  const handleSelectedPosition = position => {
    setSelectedPosition(position);
  };
  const handleSaveClick = () => {
    handleSave({
      ...formData,
      lat: selectedPosition.lat,
      lng: selectedPosition.lng
    });
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="lg"
        // classes={{
        //   paper: classes.paperDialog
        // }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Chỉnh sửa vị trí lắp đặt
        </DialogTitle>
        <DialogContent dividers>
          <Box height="500px" display="flex" flexDirection="column">
            <SelectPosition
              selectedPosition={selectedPosition}
              handleSelectedPosition={handleSelectedPosition}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPosition;
