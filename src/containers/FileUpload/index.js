/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import CloudUpload from '@material-ui/icons/CloudUpload';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import baseApi, { baseUrl } from '../../api/baseApi';

import styles from './styles.module.scss';

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content'
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120
  },
  formControlLabel: {
    marginTop: theme.spacing(1)
  }
}));

function FileUploadContainer({
  open,
  onClose,
  type,
  url,
  token,
  reFetchData,
  fileTypeSupport = '',
  handleUploadComplete = _.noop,
  enableShowResult = true
}) {
  const classes = useStyles();
  const [openState, setOpenState] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [completed, setCompleted] = React.useState(0);
  const [processed, setProcessed] = React.useState(false);
  const [total, setTotal] = React.useState();
  const [success, setSuccess] = React.useState();
  const [fileError, setFileError] = React.useState();
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setOpenState(open);
    return () => {
      setOpenState(false);
    };
  }, [open]);

  React.useEffect(() => {
    if (uploading) {
      var data = new FormData();
      data.append('file', file);
      var config = {
        onUploadProgress: progressEvent => {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setCompleted(percentCompleted);
        }
      };
      baseApi(token)
        .post(url, data, config)
        .then(res => {
          const data = _.get(res, 'data.data', {});
          if (type) {
            setFileName(data);
          }
          setTotal(data.totalRow);
          setSuccess(data.totalSuccess);
          setFileError(data.fileError);
          setProcessed(true);
          setUploaded(true);
        })
        .catch(err => {
          setUploaded(true);
          setError(true);
        });
    }
  }, [uploading]);

  React.useEffect(() => {
    if (uploaded) {
      handleUploadComplete({
        type,
        file,
        fileName,
        success,
        error
      });
      if (!enableShowResult && !error) {
        handleClose();
      }
    }
  }, [uploaded]);

  function handleClose() {
    if (processed) {
      reFetchData();
    }
    setOpenState(false);
    setUploaded(false);
    setUploading(false);
    setProcessed(false);
    setError(false);
    setFile(null);
    onClose();
  }

  const handleFileSelection = fileUpload => {
    fileUpload && fileUpload[0] && setFile(fileUpload[0]);
  };

  const handleUpload = () => {
    setUploading(true);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openState}
      onClose={handleClose}
      disableBackdropClick
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Upload</DialogTitle>
      {!uploaded && !processed && (
        <DialogContent>
          <DialogContentText>Chọn file chứa {type} của bạn</DialogContentText>
          {uploading && !uploaded && (
            <LinearProgress variant="determinate" value={completed} />
          )}
          {file && (
            <List>
              <ListItem
                className={cx(styles.highlight)}
                key={file.lastModified}
              >
                <ListItemAvatar>
                  <InsertDriveFile />
                </ListItemAvatar>
                <ListItemText primary={file.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          )}

          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <label htmlFor="file">
                <Button component="span" disableFocusRipple disableRipple>
                  <CloudUpload className={cx(styles.iconUpload)} />
                  <span
                    className={cx(
                      styles.fileUploaderSubtext,
                      styles.subtextBlue
                    )}
                  >
                    Chọn file
                  </span>
                </Button>
              </label>
              <input
                accept={fileTypeSupport}
                style={{ display: 'none' }}
                id="file"
                multiple={true}
                type="file"
                onChange={e => handleFileSelection(e.target.files)}
              />
            </FormControl>
          </form>
        </DialogContent>
      )}
      {uploaded && !processed && !error && (
        <DialogContent>
          <div className={cx(styles.processContainer)}>
            <CircularProgress className={classes.progress} />
            <div className={cx(styles.processingText)}>Processing </div>
          </div>
        </DialogContent>
      )}
      {enableShowResult && uploaded && processed && (
        <DialogContent>
          <div className={cx(styles.resultContainer)}>
            <div>Tổng số thiết bị được nhập: {total}</div>
            <div>Tổng số thiết bị được nhập thành công: {success}</div>
            {fileError ? (
              <a
                target="_blank"
                href={`${baseUrl}/download/${fileError}`}
                download
              >
                Tải file lỗi
              </a>
            ) : null}
          </div>
        </DialogContent>
      )}
      {uploaded && error && (
        <DialogContent>
          <div className={cx(styles.processContainer)}>Đã có lỗi xảy ra</div>
        </DialogContent>
      )}
      <DialogActions>
        {file && !uploaded && !uploading && (
          <Button variant="contained" onClick={handleUpload} color="primary">
            Tải lên
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default connect(
  state => ({
    token: state.auth.access_token
  }),
  null
)(FileUploadContainer);
