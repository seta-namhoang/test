import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import UpdatePreAgentPhoneModal from './UpdatePreAgentPhoneModal';
import UpdateActiveInfo from './UpdateActiveInfo';
import EditPosition from './EditPosition';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '100%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  borderBottom: {
    borderBottom: '1px solid #ddd'
  },
  phoneText: {
    lineHeight: '40px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function Setting({
  user,
  role,
  turnOffAlert,
  gateway,
  enableCallPremiumAgent,
  updatePremiumAgentPhone,
  saveUpdateInfoActiveOfficeGateway,
  handleEnableCallAgent,
  gatewayType
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isDisableTurnOffAlert, setIsDisableTurnOffAlert] = React.useState(
    false
  );
  const [openUpdatePhone, setOpenUpdatePhone] = React.useState(false);
  const [openUpdateActiveInfo, setOpenUpdateActiveInfo] = React.useState(false);
  const [
    isEnableCallPremiumAgent,
    setIsEnableCallPremiumAgent
  ] = React.useState(false);
  const [isEnableCallgent, setIsEnableCallgent] = React.useState(false);
  const [openEditPosition, setOpenEditPosition] = React.useState(false);

  React.useEffect(() => {
    setIsDisableTurnOffAlert(!_.get(gateway, 'alert', false));
    setIsEnableCallPremiumAgent(
      _.get(gateway, 'gateway_config.enable_call_premium_agent', 0)
    );
    setIsEnableCallgent(_.get(gateway, 'gateway_config.enable_call_agent', 0));
  }, [gateway]);

  const handleTurnOffAlert = (e, gatewayImei) => {
    const agencyId = _.get(user, 'agency_id', 1);
    const checked = e.target.checked;
    if (!checked) {
      turnOffAlert(gatewayImei, agencyId);
    }
  };

  const handleChangeEnableCallPreAgent = (e, gatewayId) => {
    dispatch(enableCallPremiumAgent(gatewayId, !isEnableCallPremiumAgent));
  };
  const handleChangeEnableCallgent = (e, gatewayId) => {
    handleEnableCallAgent(gatewayId, !isEnableCallgent);
  };

  const onEditPhoneClick = phones => {
    setOpenUpdatePhone(true);
  };

  const handleCloseUpdatePhone = () => {
    setOpenUpdatePhone(false);
  };
  const handleCloseUpdateActiveInfo = () => {
    setOpenUpdateActiveInfo(false);
  };

  const onEditActiveInfoClick = gateway => {
    setOpenUpdateActiveInfo(true);
  };

  const handleSaveInfoActiveGateway = data => {
    saveUpdateInfoActiveOfficeGateway(_.get(user, 'agency_id', 1), gateway.id, {
      ...data,
      user_id: user.id
    });
  };

  const onEditPositionClick = gateway => {
    setOpenEditPosition(true);
  };

  const handleCloseEditPosition = () => {
    setOpenEditPosition(false);
  };

  const handleSaveEditPosition = data => {
    saveUpdateInfoActiveOfficeGateway(_.get(user, 'agency_id', 1), gateway.id, {
      ...data,
      user_id: user.id
    });
  };

  const premiumAgentPhone = _.get(
    gateway,
    'gateway_config.premium_agent_phone',
    '--'
  );
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={5} className={classes.borderBottom}>
          <Typography variant="subtitle1">
            <span>Trạng thái cảnh báo:</span>
          </Typography>
        </Grid>
        <Grid item xs={7} className={classes.borderBottom}>
          <Box>
            <Tooltip title="Gateway đang có cảnh báo, bấm để tắt">
              <Button
                disabled={isDisableTurnOffAlert}
                variant="outlined"
                color="secondary"
                onClick={event =>
                  handleTurnOffAlert(event, _.get(gateway, 'imei', ''))
                }
              >
                Đã xử lý
              </Button>
            </Tooltip>
          </Box>
        </Grid>
        {(role.name === 'admin' || role.name === 'agency_admin') && (
          <>
            <Grid item xs={5} className={classes.borderBottom}>
              <Typography variant="subtitle1">
                <span>Tổng đài cảnh báo:</span>
              </Typography>
            </Grid>
            <Grid item xs={7} className={classes.borderBottom}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!isEnableCallgent}
                    onChange={event =>
                      handleChangeEnableCallgent(
                        event,
                        _.get(gateway, 'id', '')
                      )
                    }
                  />
                }
                className={classes.statusFiel}
                label="Bật"
              />
            </Grid>
          </>
        )}
        {role.name === 'admin' && (
          <>
            <Grid item xs={5} className={classes.borderBottom}>
              <Typography variant="subtitle1">
                <span>Dùng số điện thoại bổ sung:</span>
              </Typography>
            </Grid>
            <Grid item xs={7} className={classes.borderBottom}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!isEnableCallPremiumAgent}
                    onChange={event =>
                      handleChangeEnableCallPreAgent(
                        event,
                        _.get(gateway, 'id', '')
                      )
                    }
                  />
                }
                className={classes.statusFiel}
                label="Cho phép"
              />
            </Grid>
            <Grid item xs={5} className={classes.borderBottom}>
              <Typography variant="subtitle1">
                <span>Số điện thoại bổ sung:</span>
              </Typography>
            </Grid>
            <Grid item xs={7} className={classes.borderBottom}>
              <Box display="flex" justifyContent="space-between">
                <Box className={classes.phoneText}>
                  {premiumAgentPhone || ''}
                </Box>
                <Box>
                  <IconButton
                    aria-label="delete"
                    onClick={event =>
                      onEditPhoneClick(event, premiumAgentPhone)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </>
        )}
        {(role.name === 'admin' || role.name === 'agency_admin') &&
          ['SGW-A01', 'SGW-PM1', 'SGW-GM2'].includes(gatewayType.code) && (
            <>
              <Grid item xs={5} className={classes.borderBottom}>
                <Typography variant="subtitle1">
                  <span>Chỉnh sửa thông tin kích hoạt:</span>
                </Typography>
              </Grid>
              <Grid item xs={7} className={classes.borderBottom}>
                <Box display="flex" justifyContent="space-between">
                  <Box className={classes.phoneText} />
                  <Box>
                    <IconButton
                      aria-label="delete"
                      onClick={event => onEditActiveInfoClick(gateway)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={5} className={classes.borderBottom}>
                <Typography variant="subtitle1">
                  <span>Chỉnh sửa vị trí lắp đặt:</span>
                </Typography>
              </Grid>
              <Grid item xs={7} className={classes.borderBottom}>
                <Box display="flex" justifyContent="space-between">
                  <Box className={classes.phoneText} />
                  <Box>
                    <IconButton
                      aria-label="delete"
                      onClick={event => onEditPositionClick(gateway)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
      </Grid>
      <UpdatePreAgentPhoneModal
        open={openUpdatePhone}
        handleClose={handleCloseUpdatePhone}
        phones={premiumAgentPhone}
        gateway={gateway}
        updatePremiumAgentPhone={updatePremiumAgentPhone}
      />
      <UpdateActiveInfo
        open={openUpdateActiveInfo}
        handleClose={handleCloseUpdateActiveInfo}
        phones={premiumAgentPhone}
        gateway={gateway}
        updatePremiumAgentPhone={updatePremiumAgentPhone}
        handleSave={handleSaveInfoActiveGateway}
      />
      <EditPosition
        open={openEditPosition}
        gateway={gateway}
        handleClose={handleCloseEditPosition}
        handleSave={handleSaveEditPosition}
      />
    </div>
  );
}
