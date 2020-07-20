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
  nodeTypeId: '',
  status: '',
  emei: '',
  version: ''
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

export default function NodeDialog({
  open = false,
  handleClose,
  type,
  createNode,
  editNode,
  node = {},
  nodeTypes = [],
  role
}) {
  const classes = useStyles();
  const { access_token } = useSelector(authSelector);
  const [nodeTypeId, setProductTypeId] = useState('');
  const [name, setName] = useState('');
  const [emei, setEmei] = useState('');
  const [mfg, setMfg] = useState(new Date());
  const [status, setStatus] = useState(1);
  const [version, setVersion] = useState('');
  const [error, setError] = useState(defaultError);
  const [tabIndex, setTabIndex] = useState(ADD_TAB);
  const [file, setFile] = useState();
  const [fileTemp, setFileTemp] = useState([]);
  const [uploading, uploaded, progress, success, data] = useUpload(
    file,
    access_token,
    '/nodes/import'
  );
  useEffect(() => {
    if (!_.isEmpty(node)) {
      if (!_.isEmpty(node)) {
        const dateStr = node.mfg;
        if (dateStr) {
          const date = new Date(dateStr);
          setMfg(date);
        }
        setProductTypeId(node.product_type_id);
        setEmei(node.imei);
        setVersion(node.version);
        setStatus(node.status);
        setName(node.name);
      }
    }
    return () => {
      setProductTypeId('');
      setEmei('');
      setVersion('');
      setMfg(new Date());
      setStatus(1);
      setName('');
      setFile();
      setFileTemp([]);
      setTabIndex(ADD_TAB);
    };
  }, [node]);
  const getTitle = () => {
    return type === 'New' ? 'Thêm mới Node' : 'Sửa đổi thông tin Node';
  };

  const handleChangenodeTypeId = event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      nodeTypeId: ''
    }));
    setProductTypeId(value);
  };
  const handleChangeNodeImei = event => {
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
      version: ''
    }));
    setVersion(value);
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
      nodeTypeId: requiredValidate(nodeTypeId),
      emei: requiredValidate(emei),
      version: requiredValidate(version),
      status: requiredValidate(status)
    };

    setError(error);
    if (type === 'New' && validateAll(error)) {
      setError(defaultError);
      createNode({
        product_type_id: nodeTypeId,
        imei: emei,
        version,
        name,
        mfg: moment(mfg).format('YYYY-MM-DD HH:mm:ss'),
        status
      });
    }
    if (type === 'Edit' && validateAll(error)) {
      setError(defaultError);
      editNode({
        id: node.id,
        product_type_id: nodeTypeId,
        imei: emei,
        version,
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
              <Tab label="THÊM NODE" />
              <Tab label="THÊM NODE TỪ FILE" />
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
                            error={error.nodeTypeId !== ''}
                            variant="outlined"
                            disabled={disabledEditInfoGateway}
                          >
                            <InputLabel
                              htmlFor="status"
                              className={classes.label}
                            >
                              Loại sản phẩm
                            </InputLabel>
                            <Select
                              value={nodeTypeId}
                              onChange={handleChangenodeTypeId}
                            >
                              {nodeTypes.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.code} - {_.upperFirst(item.name)}
                                </MenuItem>
                              ))}
                            </Select>
                            {error.nodeTypeId && (
                              <FormHelperText>
                                {error.nodeTypeId}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="name"
                            label="Mô tả"
                            variant="outlined"
                            className={classes.textField}
                            value={name}
                            onChange={handleChangeName}
                            margin="normal"
                            disabled={disabledEditInfoGateway}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="imei"
                            label="Imei"
                            variant="outlined"
                            className={classes.textField}
                            value={emei}
                            onChange={handleChangeNodeImei}
                            margin="normal"
                            error={error.emei !== ''}
                            helperText={error.emei}
                            disabled={disabledEditInfoGateway}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="version"
                            label="Phiên bản"
                            variant="outlined"
                            className={classes.textField}
                            value={version}
                            onChange={handleChangeVersion}
                            margin="normal"
                            error={error.version !== ''}
                            helperText={error.version}
                            disabled={disabledEditInfoGateway}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                              className={classes.textField}
                              variant="inline"
                              inputVariant="outlined"
                              label="Ngày xuất xưởng"
                              value={mfg}
                              format="DD/MM/YYYY"
                              onChange={handleChangeMfg}
                              disabled={disabledEditInfoGateway}
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
                        type="node"
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

NodeDialog.propTypes = {
  open: bool,
  handleClose: func.isRequired,
  user: shape(Object),
  edit: bool.isRequired,
  createNode: func,
  updateUser: func
};
