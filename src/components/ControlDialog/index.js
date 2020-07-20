import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';

import RouteLoading from '../RouteLoadingScreen';
import Overview from './Overview';
import Details from './Details';
import Camera from './Camera';
import Setting from './Setting';
import useStyles from './styles';
import styles from './styles.module.scss';
import CustomDialog from './CustomDialog';
import GatewayLogs from './GatewayLogs';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

export default function ControlDialog({
  open,
  handleClose,
  editNode,
  processingControlStatus,
  gateway = {},
  agencies = [],
  nodeTypes = [],
  gatewayTypes = [],
  roles,
  user,
  turnOffAlert,
  getGatewayLogs,
  enableCallPremiumAgent,
  updatePremiumAgentPhone,
  saveUpdateInfoActiveOfficeGateway,
  handleEnableCallAgent,
  handleActivePVNNode,
  handleDeactivePVNNode,
  handlePingNode
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const gatewayName = () => {
    return gateway.name || gateway.gateway_config
      ? gateway.gateway_config.name
      : 'Thông tin gateway';
  };

  const editNodeCustom = node => {
    editNode(node, gateway);
  };

  const gatewayType = gatewayTypes.find(type => {
    return type.id === gateway.product_type_id;
  });

  return (
    <div>
      <CustomDialog
        open={open}
        onClose={handleClose}
        className={classes.dialog}
        // scroll="paper"
      >
        {processingControlStatus && (
          <div className={cx(styles['loading-container'])}>
            <RouteLoading />
          </div>
        )}
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {gatewayName()}
            </Typography>
          </Toolbar>
        </AppBar>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label="Thông tin chung" />
          {gatewayType && gatewayType.code !== 'SGW-A01' && (
            <Tab label="Danh sách nodes" />
          )}
          {gatewayType && gatewayType.code !== 'SGW-A01' && (
            <Tab label="Camera" />
          )}
          <Tab label="Cài đặt" />
          <Tab label="Nhật ký hoạt động" />
        </Tabs>
        <div className={classes.content}>
          {value === 0 && (
            <div className={classes.contenTabWapper}>
              <Overview
                agencies={agencies}
                gateway={gateway}
                nodeTypes={nodeTypes}
                gatewayTypes={gatewayTypes}
              />
            </div>
          )}
          {value === 1 && gatewayType && gatewayType.code !== 'SGW-A01' && (
            <div className={classes.contenTabWapper}>
              <Details
                agencies={agencies}
                gateway={gateway}
                gatewayTypes={gatewayTypes}
                nodeTypes={nodeTypes}
                editNode={editNodeCustom}
                user={user}
                handleActivePVNNode={handleActivePVNNode}
                handleDeactivePVNNode={handleDeactivePVNNode}
                handlePingNode={handlePingNode}
              />
            </div>
          )}
          {value === 2 && gatewayType && gatewayType.code !== 'SGW-A01' && (
            <div className={classes.contenTabWapper}>
              <Camera />
            </div>
          )}
          {(value === 3 ||
            (gatewayType && gatewayType.code === 'SGW-A01' && value === 1)) && (
            <div className={classes.contenTabWapper}>
              <Setting
                gateway={gateway}
                user={user}
                turnOffAlert={turnOffAlert}
                handleEnableCallAgent={handleEnableCallAgent}
                saveUpdateInfoActiveOfficeGateway={
                  saveUpdateInfoActiveOfficeGateway
                }
                enableCallPremiumAgent={enableCallPremiumAgent}
                updatePremiumAgentPhone={updatePremiumAgentPhone}
                role={_.get(roles, [0])}
                gatewayType={gatewayType}
              />
            </div>
          )}
          {(value === 4 ||
            (gatewayType && gatewayType.code === 'SGW-A01' && value === 2)) && (
            <div className={classes.contenTabWapper}>
              <GatewayLogs gateway={gateway} getGatewayLogs={getGatewayLogs} />
            </div>
          )}
        </div>
      </CustomDialog>
    </div>
  );
}
