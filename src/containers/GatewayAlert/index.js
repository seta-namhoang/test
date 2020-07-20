import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/CancelRounded';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { notificationQueue as notificationQueueSelector } from '../../state/modules/notification/selector';
import { gatewaySelector } from '../../state/modules/gateways/selector';
import { removeNotificationFromQueue } from '../../state/modules/notification';
import { setTargetGateway } from '../../state/modules/control/index';
import image from '../../resources/image.js';

import useStyles from './styles';

export default function QueueAlertDialog({ user, turnOffAlert }) {
  const classes = useStyles();
  const { length, queue } = useSelector(notificationQueueSelector);
  const { allGateways, gateways } = useSelector(gatewaySelector);
  const dispatch = useDispatch();
  const [currentNotify, setCurrentNotify] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [audio, setAudio] = React.useState(null);
  const [timer, setTimer] = React.useState(null);
  const handleClose = () => {
    if (audio) {
      audio.pause();
    }
    clearInterval(timer);
    setOpen(false);
    dispatch(removeNotificationFromQueue(currentNotify));
    setCurrentNotify({});
  };

  const handleProcessed = () => {
    const gateway = allGateways.find(
      item => item.imei === currentNotify.gatewaySerial
    );
    const agencyId = get(user, 'agency_id', 1);
    const gatewayImei = get(gateway, 'imei', '');
    handleClose();
    turnOffAlert(gatewayImei, agencyId);
  };

  const handleRoute = () => {
    handleClose();
    dispatch(setTargetGateway(currentNotify.gatewaySerial));
    dispatch({
      type: 'route/ROUTE_CONTROL'
    });
  };
  const getNotifiTimeStamp = time => {
    const dateTime = new Date(parseInt(time) * 1000);
    return moment(dateTime).format('hh:mm:ss DD-MM-YYYY');
  };
  const gatewaysAddress = gatewaySerial => {
    const gateway = allGateways.filter(item => item.imei === gatewaySerial)[0];
    return get(gateway, 'gateway_config.address', '');
  };
  React.useEffect(() => {
    if (open) {
      const audioMessage = new Audio(
        'http://pic.pikbest.com/00/25/35/888piC1N888piCh4S.mp3'
      );
      setAudio(audioMessage);
      let timer = setInterval(() => {
        play();
      }, 3000);
      function play() {
        const playPromise = audioMessage.play();
        if (playPromise !== undefined) {
          playPromise
            .then(_ => {
              // Automatic playback started!
              // Show playing UI.
              // console.log('audio played auto');
            })
            .catch(error => {
              // Auto-play was prevented
              // Show paused UI.
              // eslint-disable-next-line no-console
              console.log('playback prevented', error);
            });
        }
      }
      play();
      setTimer(timer);
    }
  }, [open]);
  React.useEffect(() => {
    if (length > 1 && !isEmpty(currentNotify)) {
      handleClose();
    } else if (length > 0) {
      const currentNotify = queue[0];
      setTimeout(() => {
        setCurrentNotify(currentNotify);
      }, 500);
    }
  }, [length]);
  React.useEffect(() => {
    if (!isEmpty(currentNotify) && isNil(timer)) {
      const type = get(currentNotify, 'messageBody.data.type', '');
      if (type === 'warning') {
        setOpen(true);
      }
      // const timer = setTimeout(() => {
      //   setOpen(false);
      //   dispatch(removeNotificationFromQueue(currentNotify));
      //   setCurrentNotify({});
      // }, 5000);
      // setTimer(timer);
    }
    if (isEmpty(currentNotify) && !isNil(timer)) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [currentNotify, timer]);
  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent className={classes.dialogContent}>
          <div className={classes.title}>
            <IconButton
              className={classes.iconButton}
              color="primary"
              aria-label="add to shopping cart"
              onClick={handleClose}
            >
              <Cancel />
            </IconButton>
          </div>
          <div className={classes.alertImage}>
            <img alt="#" src={image.alertImage} />
          </div>
          <DialogContentText className={classes.contentText}>
            {`${currentNotify.notificationText} - Địa chỉ: ${gatewaysAddress(
              get(currentNotify, 'gatewaySerial')
            )}`}
          </DialogContentText>
          <DialogContentText className={classes.contentText}>
            Yêu cầu kiểm tra xử lý!
          </DialogContentText>
          <DialogContentText className={classes.contentTime}>
            {getNotifiTimeStamp(currentNotify.timestamp)}
          </DialogContentText>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              color="primary"
              variant="outlined"
              onClick={handleProcessed}
            >
              ĐÃ XỬ LÝ
            </Button>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleRoute}
            >
              XEM CHI TIẾT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
