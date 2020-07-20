import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepButton';
import Box from '@material-ui/core/Box';
import useStyles, { styles } from './styles';
import SelectPosition from './SelectPosition';
import GatewayInfo from './GatewayInfo';
import ReviewInfo from './ReviewInfo';
import { showToast } from '../../state/modules/notification/index';
import { requiredValidate } from '../../helper/validate';
import { isObjectEmpty } from '../../helper/util';

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
    padding: 0
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: '5px 15px',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const steps = [
  'Chọn vị trí lắp đặt (Bấm vào vị trí trên bản đồ)',
  'Điền thông tin kích hoạt',
  'Hoàn tất kích hoạt'
];

const defaultForm = {
  name: '',
  business: '',
  address: '',
  agent_phone: ['']
};
const defaultError = {
  name: '',
  business: '',
  address: '',
  agent_phone: ''
};
export default function ActiveInMap({
  open,
  user,
  gateway,
  handleClose,
  handleSubmit
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedPosition, setSelectedPosition] = React.useState(null);
  const [formData, setFormData] = React.useState(defaultForm);
  const [formError, setFormError] = React.useState(defaultError);

  const handleChangeInfoGateway = type => event => {
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

  const handleChangeAgencyPhone = (e, index) => {
    const newData = { ...formData };
    newData['agent_phone'][index] = e.target.value.replace(
      /[^0-9()+\-\s]/g,
      ''
    );
    setFormData(newData);
    if (newData.agent_phone[0]) {
      setFormError(error => ({
        ...error,
        agent_phone: ''
      }));
    }
  };
  const handleAddAgencyPhone = () => {
    setFormData(data => {
      return {
        ...data,
        agent_phone: [...data.agent_phone, '']
      };
    });
  };

  const handleRemoveAgencyPhone = index => {
    setFormData(data => {
      return {
        ...data,
        agent_phone: data.agent_phone.filter(
          (phone, indexItem) => indexItem !== index
        )
      };
    });
  };

  const isValidFormInfo = () => {
    const error = {
      ...formError,
      name: requiredValidate(formData.name),
      address: requiredValidate(formData.address),
      agent_phone:
        formData.agent_phone[0] === ''
          ? 'Phải điền ít nhất một số điện thoại'
          : ''
    };
    setFormError(error);
    if (!isObjectEmpty(error)) {
      return false;
    }
    return true;
  };

  const totalSteps = () => {
    return steps.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = async () => {
    if (isLastStep()) {
      handleSubmit(formData);
      handleCloseWp();
    } else {
      if (activeStep === 0 && !selectedPosition) {
        dispatch(
          showToast({
            message: 'Bạn phải chọn vị trí trên bản đồ',
            action: 'Dismiss',
            type: 'error'
          })
        );
        return null;
      }
      if (activeStep === 1) {
        if (!isValidFormInfo()) {
          return null;
        }
        setFormData({
          ...formData,
          lat: selectedPosition.lat,
          lng: selectedPosition.lng,
          gateway_serial: gateway.imei,
          user_id: user.id
        });
      }
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSelectedPosition = position => {
    setSelectedPosition(position);
  };

  const handleCloseWp = () => {
    setFormData(defaultForm);
    setFormError(defaultError);
    handleClose();
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <SelectPosition
            selectedPosition={selectedPosition}
            handleSelectedPosition={handleSelectedPosition}
          />
        );
      case 1:
        return (
          <GatewayInfo
            form={formData}
            error={formError}
            handleChange={handleChangeInfoGateway}
            handleChangePhone={handleChangeAgencyPhone}
            onAddphone={handleAddAgencyPhone}
            onRemovephone={handleRemoveAgencyPhone}
          />
        );
      case 2:
        return <ReviewInfo data={formData} />;
      default:
        return 'Unknown step';
    }
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
          Kích hoạt Gateway
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <Stepper activeStep={activeStep}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              height="500px"
              display="flex"
              flexDirection="column"
              bgcolor="#efefef"
            >
              {getStepContent(activeStep)}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
