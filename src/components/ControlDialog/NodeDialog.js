import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import styles from './styles.module.scss';

export default function AlertDialogSlide({
  open,
  nodeData,
  handleClose,
  handleDeactiveClick,
  allowDeactive,
  handlePingNodeClick
}) {
  const nodeState = JSON.parse(_.get(nodeData, 'state', '{}')) || {};
  const getActiveMode = timestamp => {
    const now = new moment(Date.now());
    const lastConnect = new moment(new Date(timestamp * 10000));
    const duration = moment.duration(now.diff(lastConnect));
    const minDiff = duration.as('minutes');
    if (minDiff > 3) {
      return 'Mất kết nối';
    }
    return 'Online';
  };

  const onDeactiveClick = () => {
    handleDeactiveClick({ node_id: nodeData.id });
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const onPingClick = () => {
    handlePingNodeClick(nodeData.id);
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Thông tin chi tiết
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="md">
            <Grid container spacing={2}>
              {!_.isNil(nodeData.name) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Tên: {nodeData.name}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeData.nodeType) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Loại cảm biến: {nodeData.nodeType}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeData.imei) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Serial: {nodeData.imei}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeData.version) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Phiên bản: {nodeData.version}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeState.timestamp) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Trạng thái kết nối: {getActiveMode(nodeState.timestamp)}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeData.power) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Trạng thái: {nodeData.power === 1 ? 'Bật' : 'Tắt'}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeData.area) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Nhóm khu vực: {nodeData.area}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeState.camera) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Camera tương thích: {nodeState.camera}
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeState.battery) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Dung lượng pin: {nodeState.battery} %
                  </Typography>
                </Grid>
              )}
              {!_.isNil(nodeState.timestamp) && (
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    className={cx(styles['text-paper'])}
                  >
                    Lần cập nhật cuối:{' '}
                    {moment(new Date(nodeState.timestamp * 1000)).format(
                      'HH:mm:ss DD-MM-YYYY'
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          {allowDeactive && (
            <Button
              onClick={onDeactiveClick}
              variant="contained"
              color="primary"
            >
              Gỡ
            </Button>
          )}
          <Button onClick={onPingClick} variant="contained" color="primary">
            Ping
          </Button>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
