import React, { useState, useEffect } from 'react';
import { bool, func, shape } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { requiredValidate } from '../../helper/validate';
import useStyles, { styles } from './styles';
import UploadForm from '../Upload';
import authSelector from '../../state/modules/auth/selector';
import { useUpload } from '../../hook/useUpload';
const ADD_TAB = 0;
const UPLOAD_TAD = 1;

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

const defaultError = {
  productTypeId: '',
  status: '',
  emei: '',
  hardware_version: ''
};

const validateAll = err => {
  for (const key in err) {
    if (err.hasOwnProperty(key)) {
      const element = err[key];
      if (element) {
        return false;
      }
    }
  }
  return true;
};

export default function GatewayDialog({
  open,
  handleClose,
  type,
  createGateway,
  editGateway,
  gateway = {},
  gatewayTypes = [],
  role
}) {
  const classes = useStyles();
  const { access_token } = useSelector(authSelector);
  const [productTypeId, setProductTypeId] = useState('');
  const [name, setName] = useState('');
  const [emei, setEmei] = useState('');
  const [mfg, setMfg] = useState(new Date());
  const [status, setStatus] = useState(1);
  const [hardwareVersion, setHardwareVersion] = useState('');
  const [error, setError] = useState(defaultError);
  const [tabIndex, setTabIndex] = useState(ADD_TAB);
  const [file, setFile] = useState();
  const [fileTemp, setFileTemp] = useState([]);
  const [uploading, uploaded, progress, success, data] = useUpload(
    file,
    access_token,
    '/gateways/import'
  );
  useEffect(() => {
    if (!_.isEmpty(gateway)) {
      const dateStr = gateway.mfg;
      if (dateStr) {
        const date = new Date(dateStr);
        setMfg(date);
      }
      setProductTypeId(gateway.product_type_id);
      setEmei(gateway.imei);
      setHardwareVersion(gateway.hardware_version);
      setStatus(gateway.status);
      setName(gateway.name);
    }
    return () => {
      setProductTypeId('');
      setEmei('');
      setHardwareVersion('');
      setMfg(new Date());
      setStatus(1);
      setName('');
      setFile();
      setFileTemp([]);
      setTabIndex(ADD_TAB);
    };
  }, [gateway]);
  const getTitle = () => {
    return type === 'New' ? 'Thêm mới Gateway' : 'Sửa đổi thông tin Gateway';
  };

  const handleChangeproductTypeId = event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      productTypeId: ''
    }));
    setProductTypeId(value);
  };
  const handleChangegatewayemei = event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      emei: ''
    }));
    setEmei(value);
  };
  const handleChangeStatus = event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      status: ''
    }));
    setStatus(value);
  };
  const handleChangeVersion = event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      hardware_version: ''
    }));
    setHardwareVersion(value);
  };

  const handleChangeMfg = date => {
    setError(error => ({
      ...error,
      mfg: ''
    }));
    setMfg(date);
  };

  const handleChangeName = event => {
    const value = event.target.value;
    setName(value);
  };

  const handleChangeTabs = (e, index) => {
    setTabIndex(index);
  };

  const handleChooseFile = file => {
    setFileTemp(file);
  };

  const handleSubmit = () => {
    let error = {
      productTypeId: requiredValidate(productTypeId),
      emei: requiredValidate(emei),
      hardware_version: requiredValidate(hardwareVersion),
      status: requiredValidate(status)
    };
    setError(error);
    if (type === 'New' && validateAll(error)) {
      setError(defaultError);
      createGateway({
        product_type_id: productTypeId,
        imei: emei,
        hardware_version: hardwareVersion,
        name,
        mfg: moment(mfg).format('YYYY-MM-DD HH:mm:ss'),
        status
      });
    }
    if (type === 'Edit' && validateAll(error)) {
      setError(defaultError);
      editGateway({
        id: gateway.id,
        product_type_id: productTypeId,
        imei: emei,
        hardware_version: hardwareVersion,
        name,
        mfg: moment(mfg).format('YYYY-MM-DD HH:mm:ss'),
        status
      });
    }
  };
  const handleUpload = () => {
    setFile(fileTemp[0]);
  };

  const disabledEditInfoGateway = role.name === 'agency_admin';
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        classes={{
          paper: classes.paperDialog
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {getTitle()}
        </DialogTitle>
        <DialogContent className={classes.content}>
          {type === 'New' && (
            <Tabs
              value={tabIndex}
              onChange={handleChangeTabs}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs gateway"
              className={classes.tabs}
            >
              <Tab label="THÊM GATEWAY" />
              <Tab label="THÊM GATEWAY TỪ FILE" />
            </Tabs>
          )}
          {(function() {
            switch (tabIndex) {
              case ADD_TAB:
                return (
                  <div className={classes.item}>
                    <Container maxWidth="sm" className={classes.container}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl
                            className={classes.textField}
                            disabled={disabledEditInfoGateway}
                            error={error.productTypeId !== ''}
                            variant="outlined"
                          >
                            <InputLabel
                              htmlFor="status"
                              className={classes.label}
                            >
                              Loại sản phẩm
                            </InputLabel>

                            <Select
                              value={productTypeId}
                              onChange={handleChangeproductTypeId}
                            >
                              {gatewayTypes.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.code} - {_.upperFirst(item.name)}
                                </MenuItem>
                              ))}
                            </Select>
                            {error.productTypeId && (
                              <FormHelperText>
                                {error.productTypeId}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="name"
                            label="Mô tả"
                            className={classes.textField}
                            value={name}
                            onChange={handleChangeName}
                            disabled={disabledEditInfoGateway}
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="imei"
                            variant="outlined"
                            label="Imei"
                            className={classes.textField}
                            disabled={disabledEditInfoGateway}
                            value={emei}
                            onChange={handleChangegatewayemei}
                            margin="normal"
                            error={error.emei !== ''}
                            helperText={error.emei}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="hardware_version"
                            label="Phiên bản"
                            className={classes.textField}
                            disabled={disabledEditInfoGateway}
                            value={hardwareVersion}
                            onChange={handleChangeVersion}
                            margin="normal"
                            error={error.hardware_version !== ''}
                            helperText={error.hardware_version}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              className={classes.textField}
                              label="Ngày xuất xưởng"
                              value={mfg}
                              format="DD/MM/YYYY"
                              onChange={handleChangeMfg}
                              disabled={disabledEditInfoGateway}
                              variant="inline"
                              inputVariant="outlined"
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl
                            className={classes.textField}
                            required
                            error={error.status !== ''}
                            variant="outlined"
                          >
                            <InputLabel
                              htmlFor="status"
                              className={classes.label}
                            >
                              Trạng thái
                            </InputLabel>
                            <Select
                              value={status}
                              onChange={handleChangeStatus}
                            >
                              <MenuItem value={1}>Lưu kho</MenuItem>
                              {/* <MenuItem value={2}>Online</MenuItem> */}
                              <MenuItem value={3}>Bảo hành</MenuItem>
                            </Select>
                            <FormHelperText>{error.status}</FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Container>
                  </div>
                );
              case UPLOAD_TAD:
                return (
                  <div className={classes.item}>
                    <Container maxWidth="sm" className={classes.container}>
                      <UploadForm
                        uploaded={uploaded}
                        uploading={uploading}
                        success={success}
                        data={data}
                        progress={progress}
                        fileTypeSupport="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        type="gateway"
                        handleChooseFile={handleChooseFile}
                      />
                    </Container>
                  </div>
                );
              default:
                break;
            }
          })()}
        </DialogContent>
        {!(type === 'view') && (
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
              HUỶ
            </Button>
            {tabIndex === ADD_TAB && (
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                {type === 'New' ? 'THÊM MỚI' : 'LƯU'}
              </Button>
            )}
            {tabIndex === UPLOAD_TAD && !uploaded && (
              <Button
                disabled={fileTemp.length === 0}
                onClick={handleUpload}
                color="primary"
                variant="contained"
              >
                TẢI LÊN
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

GatewayDialog.propTypes = {
  open: bool,
  handleClose: func.isRequired,
  user: shape(Object),
  edit: bool.isRequired,
  createGateway: func,
  updateUser: func
};
