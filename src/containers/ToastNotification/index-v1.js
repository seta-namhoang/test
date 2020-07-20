import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { bool, func, number, object, shape, string } from 'prop-types';

import { hideToast } from '../../state/modules/notification';

export const constants = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  WARNING: 'Warning'
};

const listColor = {
  [constants.FAILED]: '#ff0000',
  [constants.SUCCESS]: '#2196F3',
  [constants.WARNING]: '#FF5B28'
};

const customButton = type =>
  createMuiTheme({
    overrides: {
      MuiButton: {
        root: {
          color: listColor[type]
        }
      }
    }
  });

class ToastNotification extends Component {
  // eslint-disable-line
  static propTypes = {
    hideToast: func,
    toast: shape({
      open: bool,
      position: object,
      message: string,
      action: string,
      autoHideDuration: number,
      type: string
    })
  };
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.props.hideToast();
  };

  render() {
    const {
      open,
      position,
      message,
      action,
      autoHideDuration,
      type
    } = this.props.toast;
    const actionToast = (
      <Button size="small" onClick={this.handleClose}>
        {action}
      </Button>
    );
    return (
      <div>
        <MuiThemeProvider theme={customButton(type)}>
          <Snackbar
            anchorOrigin={position}
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={this.handleClose}
          >
            <SnackbarContent message={message} action={actionToast} />
          </Snackbar>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default connect(
  state => ({
    toast: state.notification.toast
  }),
  dispatch => ({
    hideToast: compose(
      dispatch,
      hideToast
    )
  })
)(ToastNotification);
