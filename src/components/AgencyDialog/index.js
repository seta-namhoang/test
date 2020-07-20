import React, { useState, useEffect } from 'react';
import get from 'lodash/get';
import noop from 'lodash/noop';
import isEmpty from 'lodash/isEmpty';
import { bool, func, shape } from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';

import PermissionWrapper from '../../hocs/Permission';
import Upload from '../../containers/FileUpload/index';
import { baseUrl } from '../../api/baseApi';

import {
  requiredValidate,
  passwordValidate,
  rePasswordValidate
} from '../../helper/validate';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    marginTop: '0',
    width: '100%'
  },
  container: {
    padding: '0',
    marginRight: '15px'
  },
  paperDialog: {
    // top: '-5%'
  },
  statusFiel: {
    marginLeft: 0
  },
  buttonContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  img: {
    width: '100%',
    objectFit: 'contain'
  },
  textUpload: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  formBox: {
    paddingLeft: 10
  },
  thumbnail: {
    height: 160,
    width: 'auto',
    maxWidth: 120
  }
});

const useStyles = makeStyles(styles);

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
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: '5px 15px',
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const defaultError = {
  agencyName: '',
  address: '',
  password: '',
  rePassword: '',
  userName: '',
  phone: '',
  subDomain: '',
  headerTitle: '',
  logoLogin: '',
  logoHeader: '',
  companyName: ''
};

const validateAllForUpdate = err => {
  return err.agencyName === '';
};

const validateAll = err => {
  return (
    err.agencyName !== '' ||
    err.password !== '' ||
    err.rePassword !== '' ||
    err.phone !== '' ||
    err.userName !== '' ||
    err.subDomain !== '' ||
    err.headerTitle !== '' ||
    err.companyName !== ''
  );
};

export default function AgencyDialog({
  open = false,
  handleClose,
  type,
  createAgency,
  editAgency,
  fromUserWidget = false,
  agency = {}
}) {
  const classes = useStyles();
  const [form, setForm] = useState({
    agencyName: '',
    address: '',
    status: '',
    password: '',
    rePassword: '',
    userName: '',
    phone: '',
    subDomain: '',
    headerTitle: '',
    logoLogin: '',
    logoHeader: '',
    companyName: ''
  });
  const [openUpload, setUploadOpen] = useState({
    type: '',
    status: false,
    name: ''
  });
  const [file, setFile] = useState({
    logoLogin: null,
    logoHeader: null
  });
  const [status, setStatus] = useState(true);
  const [useCustomDomain, setCustomeDomain] = useState(false);
  const [error, setError] = useState(defaultError);

  useEffect(() => {
    const agency_information = get(agency, 'agency_information') || {};
    if (!isEmpty(agency_information)) {
      setCustomeDomain(true);
    }
    setForm({
      ...form,
      agencyName: agency.name,
      address: agency.address,
      subDomain: agency_information.subdomain,
      headerTitle: agency_information.header_title,
      logoLogin: agency_information.logo_login,
      logoHeader: agency_information.logo_header,
      companyName: agency_information.company_name
    });
    return () => {
      setForm({
        agencyName: '',
        address: '',
        status: '',
        password: '',
        rePassword: '',
        userName: '',
        phone: '',
        subDomain: '',
        headerTitle: '',
        logoLogin: '',
        logoHeader: '',
        companyName: ''
      });
      setError(defaultError);
      setCustomeDomain(false);
    };
  }, [agency]);

  const getTitle = () => {
    return type === 'New' ? 'Thêm đại lý' : 'Sửa đổi thông tin đại lý';
  };

  const handleChange = name => event => {
    setForm({ ...form, [name]: event.target.value });
    setError(error => ({
      ...error,
      [name]: ''
    }));
  };
  const handleChangeStatus = () => {
    setStatus(!status);
  };

  const handleChangeDomainStatus = () => {
    setCustomeDomain(!useCustomDomain);
  };

  const handleUpload = type => () => {
    const name = type === 'logoHeader' ? 'Logo tiêu đề' : 'Logo đăng nhập';
    setUploadOpen({
      type,
      name,
      status: true
    });
  };

  const handleRemove = type => () => {
    setForm(form => ({
      ...form,
      [type]: ''
    }));
  };

  const handleCloseUpload = () => {
    setUploadOpen({
      type: '',
      name: '',
      status: false
    });
  };

  const handleUploadComplete = data => {
    const { type, file: newFile, error, fileName } = data;
    if (!error) {
      setFile(file => ({
        ...file,
        [type]: newFile
      }));
      setForm(form => ({
        ...form,
        [type]: fileName
      }));
    }
  };

  const handleSubmit = () => {
    let currentError = {
      ...error,
      agencyName: requiredValidate(form.agencyName),
      password: passwordValidate(form.password),
      rePassword: rePasswordValidate(form.password, form.rePassword),
      userName: requiredValidate(form.userName),
      phone: requiredValidate(form.phone),
      subDomain: useCustomDomain ? requiredValidate(form.subDomain) : '',
      headerTitle: useCustomDomain ? requiredValidate(form.headerTitle) : '',
      companyName: useCustomDomain ? requiredValidate(form.companyName) : ''
    };
    setError(currentError);
    const agency_information = useCustomDomain
      ? {
          subdomain: form.subDomain,
          header_title: form.headerTitle,
          logo_login: form.logoLogin,
          logo_header: form.logoHeader,
          company_name: form.companyName
        }
      : {};
    if (type === 'New' && !validateAll(currentError)) {
      setError(defaultError);

      createAgency({
        name: form.agencyName,
        address: form.address,
        status: status ? 'active' : 'inactive',
        user: {
          username: form.userName,
          password: form.password,
          phone: form.phone,
          name: 'Agency Admin',
          confirmed: 1,
          status: 'active'
        },
        agency_information
      });
    }
    if (type === 'Edit' && validateAllForUpdate(error)) {
      setError(defaultError);
      editAgency(
        {
          id: agency.id,
          name: form.agencyName,
          address: form.address,
          status: status ? 'active' : 'inactive',
          agency_information
        },
        fromUserWidget
      );
    }
  };
  const getUrl = type => {
    return `${baseUrl}/storage/${type}`;
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
        classes={{
          paper: classes.paperDialog
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {getTitle()}
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.item}>
            {type === 'New' && (
              <Container className={classes.container}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="phone"
                      label="Phone"
                      variant="outlined"
                      className={classes.textField}
                      value={form.phone}
                      onChange={handleChange('phone')}
                      margin="normal"
                      error={error.phone !== ''}
                      helperText={error.phone}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="userName"
                      label="Tên đăng nhập"
                      variant="outlined"
                      className={classes.textField}
                      value={form.userName}
                      onChange={handleChange('userName')}
                      margin="normal"
                      error={error.userName !== ''}
                      helperText={error.userName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="password"
                      label="Mật khẩu"
                      variant="outlined"
                      className={classes.textField}
                      value={form.password}
                      onChange={handleChange('password')}
                      margin="normal"
                      type="password"
                      error={error.password !== ''}
                      helperText={error.password}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="rePassword"
                      label="Nhập lại mật khẩu"
                      variant="outlined"
                      className={classes.textField}
                      value={form.rePassword}
                      onChange={handleChange('rePassword')}
                      margin="normal"
                      type="password"
                      error={error.rePassword !== ''}
                      helperText={error.rePassword}
                    />
                  </Grid>
                </Grid>
              </Container>
            )}
            <Container className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="agencyName"
                    label="Tên đại lý"
                    variant="outlined"
                    className={classes.textField}
                    value={form.agencyName}
                    onChange={handleChange('agencyName')}
                    margin="normal"
                    error={error.agencyName !== ''}
                    helperText={error.agencyName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="address"
                    label="Địa chỉ"
                    variant="outlined"
                    className={classes.textField}
                    value={form.address}
                    onChange={handleChange('address')}
                    margin="normal"
                    error={error.address !== ''}
                    helperText={error.address}
                  />
                </Grid>
                {useCustomDomain && (
                  <Grid container item spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="subDomain"
                        label="Tên miền"
                        variant="outlined"
                        className={classes.textField}
                        value={form.subDomain}
                        onChange={handleChange('subDomain')}
                        margin="normal"
                        error={error.subDomain !== ''}
                        helperText={error.subDomain}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="headerTitle"
                        label="Tiêu đề"
                        variant="outlined"
                        className={classes.textField}
                        value={form.headerTitle}
                        onChange={handleChange('headerTitle')}
                        margin="normal"
                        error={error.headerTitle !== ''}
                        helperText={error.headerTitle}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="companyName"
                        label="Tên công ty"
                        variant="outlined"
                        className={classes.textField}
                        value={form.companyName}
                        onChange={handleChange('companyName')}
                        margin="normal"
                        error={error.companyName !== ''}
                        helperText={error.companyName}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={classes.formBox}>
                        <div className={classes.textUpload}>
                          Logo Đăng nhâp{' '}
                        </div>
                        <Box className={classes.thumbnail}>
                          {form.logoLogin && (
                            <img
                              className={classes.img}
                              alt="logoLogin"
                              id="logoLogin"
                              src={getUrl(form.logoLogin)}
                            />
                          )}
                        </Box>
                        <Typography variant="subtitle1">
                          {form.logoLogin ? `${form.logoLogin}` : ''}
                        </Typography>
                        <div className={classes.buttonContainer}>
                          <Button
                            onClick={handleUpload('logoLogin')}
                            variant="outlined"
                            color="primary"
                          >
                            Chọn File
                          </Button>
                          {form.logoLogin && (
                            <IconButton onClick={handleRemove('logoLogin')}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </div>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={classes.formBox}>
                        <div className={classes.textUpload}>Logo tiêu đề </div>
                        <Box className={classes.thumbnail}>
                          {form.logoHeader && (
                            <img
                              className={classes.img}
                              alt="logoHeader"
                              src={getUrl(form.logoHeader)}
                              id="logoHeader"
                            />
                          )}
                        </Box>
                        <Typography variant="subtitle1">
                          {form.logoHeader ? `${form.logoHeader}` : ''}
                        </Typography>
                        <div className={classes.buttonContainer}>
                          <Button
                            onClick={handleUpload('logoHeader')}
                            variant="outlined"
                            color="primary"
                          >
                            Chọn File
                          </Button>
                          {form.logoHeader && (
                            <IconButton onClick={handleRemove('logoHeader')}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </div>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={status}
                        onChange={handleChangeStatus}
                      />
                    }
                    className={classes.statusFiel}
                    label="Hoạt động"
                  />
                </Grid>
                <PermissionWrapper permissionRequired={['agency_advance']}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useCustomDomain}
                          onChange={handleChangeDomainStatus}
                        />
                      }
                      className={classes.statusFiel}
                      label="Sử dụng tên miền tuỳ chọn"
                    />
                  </Grid>
                </PermissionWrapper>
              </Grid>
            </Container>
          </div>
        </DialogContent>
        {!(type === 'view') && (
          <DialogActions>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Lưu
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Upload
        onClose={handleCloseUpload}
        open={openUpload.status}
        reFetchData={noop}
        type={openUpload.type}
        url="/files/upload"
        fileTypeSupport="image/*"
        enableShowResult={false}
        handleUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

AgencyDialog.propTypes = {
  open: bool,
  handleClose: func,
  user: shape(Object),
  edit: bool.isRequired,
  createAgency: func,
  updateUser: func
};
