import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
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
import { requiredValidate } from '../../helper/validate';
import useStyles, { styles } from './styles';

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

const defaultForm = {
  name: '',
  sim: '',
  lat: '',
  lng: ''
};

export default function GatewayDialog({ open, handleClose, handleSubmit }) {
  const classes = useStyles();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState(defaultForm);

  const handleChange = type => event => {
    const value = event.target.value;
    setError(error => ({
      ...error,
      [type]: ''
    }));
    setForm(form => ({
      ...form,
      [type]: value
    }));
  };

  const handleSubmitWp = event => {
    let error = {
      name: requiredValidate(form.name),
      sim: requiredValidate(form.sim),
      lat: requiredValidate(form.lat),
      lng: requiredValidate(form.lng)
    };
    setError(error);
    if (JSON.stringify(error) === JSON.stringify(defaultForm)) {
      handleSubmit({
        name: form.name,
        sim: form.sim,
        lat: form.lat,
        lng: form.lng
      });
      handleCloseWp(event);
    }
  };

  const handleCloseWp = e => {
    setForm(defaultForm);
    setError(defaultForm);
    handleClose(e);
  };
  return (
    <>
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
          Kích hoạt Gateway
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.item}>
            <Container maxWidth="sm" className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    label="Tên gateway*"
                    className={classes.textField}
                    value={form.name}
                    onChange={handleChange('name')}
                    margin="normal"
                    error={error.name !== ''}
                    helperText={error.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="sim"
                    label="Số thẻ sim*"
                    className={classes.textField}
                    value={form.sim}
                    onChange={handleChange('sim')}
                    margin="normal"
                    error={error.sim !== ''}
                    helperText={error.sim}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="lng"
                    label="Kinh độ*"
                    className={classes.textField}
                    value={form.lng}
                    onChange={handleChange('lng')}
                    margin="normal"
                    error={error.lng !== ''}
                    helperText={error.lng}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="lat"
                    label="Vĩ độ*"
                    className={classes.textField}
                    value={form.lat}
                    onChange={handleChange('lat')}
                    margin="normal"
                    error={error.lat !== ''}
                    helperText={error.lat}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWp} color="primary">
            Huỷ
          </Button>
          <Button onClick={handleSubmitWp} color="primary" variant="contained">
            Kích hoạt
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
