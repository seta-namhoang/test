import React from 'react';
import cx from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Close';
import { baseUrl } from '../../api/baseApi';
import images from '../../resources/image';
import useStyles from './styles';

const noop = () => {};

function Upload({
  uploaded,
  uploading,
  success,
  data = {},
  type,
  progress,
  fileTypeSupport,
  handleChooseFile = noop
}) {
  console.log('uploaded', uploaded);
  console.log('uploading', uploading);
  console.log('success', success);
  console.log('data', data);
  console.log('progress', progress);

  const [file, setFile] = React.useState([]);
  const classes = useStyles();
  const handleFileSelection = newFile => {
    const { length } = newFile;
    let fileList = [];
    for (let i = 0; i < length; i++) {
      fileList.push(newFile[i]);
    }
    setFile(fileList);
    handleChooseFile(fileList);
  };
  const handleItemClick = item => () => {
    const newFileList = file.filter(fileItem => fileItem.name !== item.name);
    setFile(newFileList);
    handleChooseFile(newFileList);
  };
  return (
    <div data-element="upload-form" className={classes.container}>
      {!uploaded && !uploading && (
        <div>
          <div>Chọn file chứa {type} của bạn</div>
          {uploading && !uploaded && (
            <LinearProgress variant="determinate" value={progress} />
          )}
          {file && (
            <List>
              {file.map(fileItem => (
                <ListItem
                  className={classes.highlight}
                  key={fileItem.lastModified}
                >
                  <ListItemAvatar>
                    <InsertDriveFile className={classes.fileIcon} />
                  </ListItemAvatar>
                  <ListItemText primary={fileItem.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={handleItemClick(fileItem)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <label htmlFor="file">
                <Button component="span" disableFocusRipple disableRipple>
                  <img
                    alt=""
                    src={images.uploadIcon}
                    className={classes.iconUpload}
                  />
                  <span className={classes.uploadText}>Chọn file</span>
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
        </div>
      )}
      {uploading && (
        <div>
          <div className={classes.processContainer}>
            <CircularProgress className={classes.progress} />
            <div className={classes.processingText}>Processing </div>
          </div>
        </div>
      )}
      {uploaded && success && (
        <div>
          <div className={classes.resultContainer}>
            <div>Tổng số thiết bị được nhập: {data ? data.totalRow : '-'} </div>
            <div>
              Tổng số thiết bị được nhập thành công:{' '}
              {data ? data.totalSuccess : '-'}
            </div>
            {data && data.fileError ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${baseUrl}/download/${data.fileError}`}
                download
              >
                Tải file lỗi
              </a>
            ) : null}
          </div>
        </div>
      )}
      {uploaded && !success && (
        <div>
          <div className={classes.processContainer}>Đã có lỗi xảy ra</div>
        </div>
      )}
    </div>
  );
}
export default Upload;
