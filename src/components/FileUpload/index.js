import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
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

function FileUploadContainer({ open = false, onClose, type, url, token }) {
  const classes = useStyles();
  const [openState, setOpenState] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [completed, setCompleted] = React.useState(0);
  React.useEffect(() => {
    setOpenState(open);
    return () => {
      setOpenState(false);
    };
  }, [open]);

  React.useEffect(() => {
    let timer;
    if (uploading) {
      function progress() {
        setCompleted(oldCompleted => {
          if (oldCompleted === 100) {
            setUploaded(true);
            clearInterval(timer);
            return 0;
          }
          const diff = 20;
          return Math.min(oldCompleted + diff, 100);
        });
      }
      timer = setInterval(progress, 500);
    }
    return () => {
      clearInterval(timer);
    };
  }, [uploading]);

  function handleClose() {
    onClose();
    setOpenState(false);
    setUploaded(false);
    setUploading(false);
  }

  const handleFileSelection = file => {
    file && file[0] ? setFiles([file[0]]) : setFiles(files);
  };

  const handleUpload = () => {
    setUploading(true);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openState}
        onClose={handleClose}
        disableBackdropClick
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Upload</DialogTitle>
        {!uploaded && (
          <DialogContent>
            <DialogContentText>
              Chọn file chứa danh sách {type} của bạn
            </DialogContentText>
            {uploading && !uploaded && (
              <LinearProgress variant="determinate" value={completed} />
            )}
            <List>
              {files.map(item => {
                return (
                  <ListItem
                    className={cx(styles.highlight)}
                    key={item.lastModified}
                  >
                    <ListItemAvatar>
                      <InsertDriveFile />
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>

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
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
        {uploaded && (
          <DialogContent>
            <div className={cx(styles.processContainer)}>
              <CircularProgress className={classes.progress} />
              <div className={cx(styles.processingText)}>Processing </div>
            </div>
          </DialogContent>
        )}
        <DialogActions>
          {files.length !== 0 && !uploaded && !uploading && (
            <Button variant="contained" onClick={handleUpload} color="primary">
              Tải lên
            </Button>
          )}
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default connect(
  state => ({
    token: state.auth.loginStatus
  }),
  null
)(FileUploadContainer);
