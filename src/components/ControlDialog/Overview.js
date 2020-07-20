import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import styles from './styles.module.scss';
import Typography from '@material-ui/core/Typography';
import { guid, timestampToDateTime } from '../../helper/util';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    // display: 'flex',
    // overflow: 'auto',
    // flexDirection: 'column',
    // borderRadius: 0,
    // boxShadow: '1px 1px 5px 0px #88888826',
    height: '100%'
  },
  fixedHeight: {
    // height: '30vh'
  }
}));

function Overview({ gateway = {}, gatewayTypes, agencies = [] }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const gateway_config = _.get(gateway, 'gateway_config', {});
  const gateway_subscription = _.get(gateway, 'gateway_subscription', {});

  const gatewayType = gatewayTypes.filter(type => {
    return type.id === gateway.product_type_id;
  });

  const getDiffDay = () => {
    const end = _.get(gateway_subscription, 'end');
    const now = moment(new Date());
    const endDate = moment(new Date(end));
    if (now.isAfter(endDate)) {
      return 'Hết hạn';
    }
    return Math.round(moment.duration(endDate.diff(now)).asDays());
  };

  const getAgencyName = () => {
    const agency = agencies.find(a => a.id === gateway.agency_id);
    return _.get(agency, 'name', '');
  };

  const getStatus = gatewayStatusId => {
    switch (gatewayStatusId) {
      case 1:
        return 'Hoạt động';
      case 2:
        return 'Đang cảnh báo';
      case 3:
        return 'Lỗi cảm biến';
      case 4:
        return 'Mất kết nối';
      default:
        return 'Hoạt động';
    }
  };
  const state = JSON.parse(_.get(gateway, 'state'));
  return (
    <div className={cx(styles['overview-container'])}>
      <div className={cx(styles['info-gateway'])}>
        <Box className={fixedHeightPaper}>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Tên:</span>
            <span>{gateway_config.name || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Loại:</span>
            <span>{_.upperFirst(_.get(gatewayType, [0, 'name'], ''))}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Serial:</span>
            <span>{gateway.imei || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Phiên bản:</span>
            <span>{gateway.hardware_version}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Địa chỉ:</span>
            <span>{gateway_config.address || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Đại lý:</span>
            <span>{getAgencyName() || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Loại hình kinh doanh:</span>
            <span>{gateway_config.business || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Số điện thoại:</span>
            <span>
              {gateway_config.agent_phone
                ? gateway_config.agent_phone
                    .split(',')
                    .map(phone => <span key={guid()}>{phone}, </span>)
                : null}
            </span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Số sim thiết bị:</span>
            <span>{gateway.sim || '--'}</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Ngày kích hoạt:</span>
            <span>
              {moment(gateway_subscription.start).format('DD/MM/YYYY HH:mm')}
            </span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Cập nhật lần cuối:</span>
            <span>
              {state ? timestampToDateTime(_.get(state, 'timestamp', 0)) : '--'}
            </span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Số ngày còn lại:</span>
            <span>{getDiffDay()} ngày</span>
          </Typography>
          <Typography variant="subtitle1" className={cx(styles['text-info'])}>
            <span>Trạng thái:</span>
            <span>{getStatus(_.get(gateway, 'gatewayStatusId', ''))} </span>
          </Typography>
        </Box>
      </div>
    </div>
  );
}
export default Overview;
