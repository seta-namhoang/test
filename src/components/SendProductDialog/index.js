import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import styles from './styles.module.scss';

const stylesDialog = theme => ({
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
  titleDialog: {
    color: '#456083'
  }
});

const DialogTitle = withStyles(stylesDialog)(props => {
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

export default function SendProductDialog({
  open,
  type,
  agencies,
  productIds,
  handleClose,
  sellProduct,
  resetData
}) {
  const [agencyId, setAgencyId] = React.useState();
  const [error, setError] = React.useState();
  const handleChange = event => {
    const value = event.target.value;
    setError('');
    setAgencyId(value);
  };

  const handleSubmit = () => {
    if (!agencyId) {
      setError('Chưa chọn cửa hàng');
      return;
    }
    sellProduct({
      agency_id: agencyId,
      ids: productIds.join(',')
    });
    resetData();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">Chuyển {type}</DialogTitle>
      <DialogContent>
        <DialogContentText>Chọn cửa hàng muốn chuyển</DialogContentText>
        <Container maxWidth="sm" className={cx(styles['container'])}>
          <Grid container spacing={2}>
            <FormControl
              className={cx(styles['full-width-text'])}
              error={!!error}
            >
              <InputLabel htmlFor="agency">Cửa hàng</InputLabel>
              <Select
                fullWidth
                value={agencyId}
                onChange={handleChange}
                inputProps={{
                  name: 'agency',
                  id: 'agency'
                }}
              >
                {agencies.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error}</FormHelperText>
            </FormControl>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Huỷ bỏ
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Chuyển
        </Button>
      </DialogActions>
    </Dialog>
  );
}
