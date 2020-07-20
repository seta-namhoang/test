import React from 'react';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import styles from './styles.module.scss';
import _ from 'lodash';

import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

import HomeIcon from '../../asset/icons/home-icon.svg';
import BuildingIcon from '../../asset/icons/building.svg';
import CarIcon from '../../asset/icons/car.svg';
import DollarsIcon from '../../asset/icons/dollars.svg';
import MotoIcon from '../../asset/icons/moto.svg';
import PvnIcon from '../../asset/icons/pvn-icon.svg';

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  }
}));

const Marker = props => {
  const {
    color,
    onMarkerClick = _.noop,
    gateway = {},
    productTypes = []
  } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const markerClick = () => {
    onMarkerClick(gateway);
  };
  const { gateway_config = {} } = gateway;
  const { state = '' } = gateway;
  const gatewayType = productTypes.filter(type => {
    return type.id === gateway.product_type_id;
  });
  const getActiveMode = () => {
    const mode = _.get(gateway_config, 'mode', 1);
    return mode === 1
      ? 'Tắt cảnh báo'
      : mode === 2
      ? 'Đang ở nhà'
      : 'Rời khỏi nhà';
  };

  const getIcon = () => {
    const code = _.get(gatewayType, [0, 'code'], '');
    if (code) {
      switch (code) {
        case 'SGPS-MT1':
          return MotoIcon;

        case 'SGPS-CT0':
          return CarIcon;

        case 'SGPS-RB2':
          return DollarsIcon;

        case 'SGW-A01':
          return BuildingIcon;

        case 'SGW-PM1':
          return PvnIcon;

        default:
          return HomeIcon;
      }
    }
  };

  return (
    <>
      <div
        className={cx([styles['pin'], styles['bounce']])}
        style={{ backgroundColor: color, cursor: 'pointer' }}
        onClick={markerClick}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <div className={cx(styles['pin-icon'])}>
          <img src={getIcon()} alt="" />
        </div>
      </div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        onClose={handlePopoverClose}
        // disableRestoreFocus
      >
        <>
          <Typography
            color="inherit"
            className={cx(styles['item-hover-tooltip'])}
          >
            <span>Tên thiết bị:</span>
            <span>{gateway_config.name}</span>
          </Typography>
          <Typography
            color="inherit"
            className={cx(styles['item-hover-tooltip'])}
          >
            <span>Loại thiết bị:</span>
            <span>{_.upperFirst(_.get(gatewayType, [0, 'name'], ''))}</span>
          </Typography>
          {!['SGW-A01', 'SGW-PM1', 'SGW-GM2'].includes(
            _.get(gatewayType, [0, 'code'], '')
          ) && (
            <Typography
              color="inherit"
              className={cx(styles['item-hover-tooltip'])}
            >
              <span>Chế độ hoạt động:</span>
              <span>{getActiveMode()}</span>
            </Typography>
          )}
          <Typography
            color="inherit"
            className={cx(styles['item-hover-tooltip'])}
          >
            <span>Serial:</span>
            <span>{gateway.imei}</span>
          </Typography>
          {_.get(gatewayType, [0, 'code'], '') !== 'SGW-A01' && (
            <Typography
              color="inherit"
              className={cx(styles['item-hover-tooltip'])}
            >
              <span>Số cảm biến:</span>
              <span>{gateway.nodes ? gateway.nodes.length : 0} cảm biến</span>
            </Typography>
          )}

          <Typography
            color="inherit"
            className={cx(styles['item-hover-tooltip'])}
          >
            <span>
              {_.get(gatewayType, [0, 'code'], '') !== 'SGW-A01'
                ? 'Tình trạng pin: '
                : 'Điện áp: '}
            </span>
            <span>
              {_.get(gatewayType, [0, 'code'], '') !== 'SGW-A01'
                ? _.get(JSON.parse(state), 'battery', 0) + '%'
                : _.get(JSON.parse(state), 'voltage', 0) + ' V'}
            </span>
          </Typography>
        </>
      </Popover>
      <div
        className={cx(
          styles['pulse'],
          _.get(gateway, 'alert') === 1 ? styles['pulse-wave'] : ''
        )}
      />
    </>
  );
};

export default Marker;
