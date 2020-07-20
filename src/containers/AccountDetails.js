import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import UserDialog from '../components/UserDialog';
import AgencyDialog from '../components/AgencyDialog';
import ResetPassworDialog from '../components/ResetPassword';
import SSCard from '../components/Card';

import { hideDetails } from '../state/modules/auth';
import {
  editUserSaga,
  processingUser,
  processedUser,
  changePasswordSaga
} from '../state/modules/users';
import { processingStatus as processingUserStatus } from '../state/modules/users/selector';
import {
  editAgencySaga,
  processedAgency,
  processingAgency
} from '../state/modules/agencies';
import { processingStatus as processingAgencyStatus } from '../state/modules/agencies/selector';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  container: {
    display: 'block',
    padding: 20
  },
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '75%'
  }
});

class FullScreenDialog extends React.Component {
  state = {
    openReset: false
  };

  handleClose = () => {
    this.setState({
      open: false,
      fullName: '',
      email: '',
      password: '',
      rePassword: ''
    });
    this.props.hideDetails();
  };

  onEditCurrentUser = () => {
    const { proccessingUser } = this.props;
    proccessingUser(true);
  };

  handleCloseUserEdit = () => {
    const { processedUser } = this.props;
    processedUser(true);
  };

  onEditAgency = () => {
    const { proccessingAgency } = this.props;
    proccessingAgency(true);
  };

  handleCloseAgencyEdit = () => {
    const { processedAgency } = this.props;
    processedAgency(true);
  };

  onEditPassword = () => {
    this.setState({ openReset: true });
  };

  handleCloseReset = () => {
    this.setState({ openReset: false });
  };

  onSubmitReset = data => {
    const { changePassword } = this.props;
    changePassword({
      user: {
        current_password: data.oldPassword,
        new_password: data.password
      }
    });
    this.handleCloseReset();
  };

  render() {
    const { classes, showDetails, user, agency } = this.props;
    const agencyRenderField = [
      {
        fieldName: 'Tên cửa hàng',
        field: 'name'
      },
      {
        fieldName: 'Địa chỉ',
        field: 'address'
      },
      {
        fieldName: 'Level',
        field: 'level'
      }
    ];
    const userRenderField = [
      {
        fieldName: 'Tên đăng nhập',
        field: 'username'
      },
      {
        fieldName: 'Tên người sử dụng',
        field: 'name'
      },
      {
        fieldName: 'Email',
        field: 'email'
      },
      {
        fieldName: 'Số điện thoại',
        field: 'phone'
      }
    ];
    const passwordRenderField = [
      {
        fieldName: 'Ngày cập nhật cuối',
        field: 'updated'
      }
    ];
    return (
      <div>
        <Dialog fullScreen open={showDetails} onClose={this.handleClose}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.flex}
              />
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            <div className={classes.cardContainer}>
              <SSCard
                renderField={userRenderField}
                data={user}
                title="Thông tin người dùng"
                handleAction={this.onEditCurrentUser}
              />
            </div>
            {!_.isEmpty(agency) && (
              <div className={classes.cardContainer}>
                <SSCard
                  renderField={agencyRenderField}
                  data={agency}
                  title="Thông tin cửa hàng"
                  handleAction={this.onEditAgency}
                />
              </div>
            )}
            <div className={classes.cardContainer}>
              <SSCard
                renderField={passwordRenderField}
                data={user}
                title="Mật khẩu"
                handleAction={this.onEditPassword}
              />
            </div>
          </div>
        </Dialog>
        <UserDialog
          open={this.props.processingUserStatus}
          user={user}
          edit
          fromUserWidget
          handleClose={this.handleCloseUserEdit}
          createUser={_.noop}
          editUser={this.props.editUser}
          type="Edit"
        />
        <AgencyDialog
          open={this.props.processingAgencyStatus}
          agency={agency}
          fromUserWidget
          edit
          handleClose={this.handleCloseAgencyEdit}
          createAgency={_.noop}
          editAgency={this.props.editAgency}
          type="Edit"
        />
        <ResetPassworDialog
          open={this.state.openReset}
          handleClose={this.handleCloseReset}
          onSubmit={this.onSubmitReset}
        />
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired
};
const ConnectDetails = connect(
  state => ({
    showDetails: state.auth.showDetails,
    user: state.auth.user,
    agency: state.auth.agency,
    processingUserStatus: processingUserStatus(true)(state),
    processingAgencyStatus: processingAgencyStatus(true)(state)
  }),
  dispatch => ({
    hideDetails: compose(
      dispatch,
      hideDetails
    ),
    editUser: compose(
      dispatch,
      editUserSaga
    ),
    proccessingUser: compose(
      dispatch,
      processingUser
    ),
    processedUser: compose(
      dispatch,
      processedUser
    ),
    editAgency: compose(
      dispatch,
      editAgencySaga
    ),
    proccessingAgency: compose(
      dispatch,
      processingAgency
    ),
    processedAgency: compose(
      dispatch,
      processedAgency
    ),
    changePassword: compose(
      dispatch,
      changePasswordSaga
    )
  })
)(FullScreenDialog);
export default withStyles(styles)(ConnectDetails);
