import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import User from '../../components/Users';
import {
  fetchUserSaga,
  addUserSaga,
  editUserSaga,
  deleteUserSage,
  processingUser,
  processedUser
} from '../../state/modules/users';
import { processingStatus } from '../../state/modules/users/selector';
import BreadCrumbs from '../../components/BreadCrumbs';

const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  },
  {
    id: 2,
    name: 'Quản lý người dùng',
    href: '/users',
    route: 'route/ROUTE_USERS'
  }
];
class UsersPage extends Component {
  componentDidMount() {
    const { fetchUser, loginStatus, fetchingUserStatus } = this.props;
    document.title = 'Quản lý tài khoản';
    if (loginStatus && !fetchingUserStatus) {
      fetchUser();
    }
  }
  componentDidUpdate() {
    const {
      fetchUser,
      loginStatus,
      fetchedUserStatus,
      fetchingUserStatus
    } = this.props;
    if (loginStatus && !fetchedUserStatus && !fetchingUserStatus) {
      fetchUser();
    }
  }

  handleFetchUser = (limit, offset, orderData) => {
    const { fetchUser, loginStatus } = this.props;
    if (loginStatus) {
      fetchUser(limit, offset, orderData);
    }
  };

  render() {
    const { redirect, ...remainProps } = this.props;
    return (
      <React.Fragment>
        {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
        <User {...remainProps} handleFetchUser={this.handleFetchUser} />
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    proccessing: processingStatus(false)(state),
    users: state.users.users,
    fetchedUserStatus: state.users.fetched,
    total: state.users.total,
    fetchingUserStatus: state.users.fetching
  }),
  dispatch => ({
    fetchUser: compose(
      dispatch,
      fetchUserSaga
    ),
    addUser: compose(
      dispatch,
      addUserSaga
    ),
    editUser: compose(
      dispatch,
      editUserSaga
    ),
    deleteUser: compose(
      dispatch,
      deleteUserSage
    ),
    proccessingUser: compose(
      dispatch,
      processingUser
    ),
    processedUser: compose(
      dispatch,
      processedUser
    )
  })
)(UsersPage);
