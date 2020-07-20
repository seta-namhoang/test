import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import cx from 'classnames';
import MUIDataTable from 'mui-datatables';

import LoadingScreen from '../../components/RouteLoadingScreen';
import { fetchAppUserSaga } from '../../state/modules/users';
import BreadCrumbs from '../../components/BreadCrumbs';
import { datatable_lang } from '../../asset/lang/vn';
import styles from './styles.module.scss';
import {
  MuiThemeProvider,
  withStyles,
  createMuiTheme
} from '@material-ui/core/styles';
import TitleTable from '../../components/TitleTable';
import customMuiTheme from '../../styles/themes/customMuiTheme';

const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  },
  {
    id: 2,
    name: 'Quản lý người dùng ứng dụng',
    href: '/app-user',
    route: 'route/ROUTE_APP_USERS'
  }
];

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableBodyRow: {
        root: {
          '&:nth-child(odd)': {
            backgroundColor: 'rgba(0,0,0,.05)'
          }
        }
      }
    }
  });
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
    const { redirect, users, fetchingUserStatus } = this.props;
    const columns = [
      {
        id: 'name',
        name: 'name',
        disablePadding: true,
        label: 'Họ tên',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        id: 'username',
        name: 'username',
        disablePadding: true,
        label: 'Tên đăng nhập',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        id: 'email',
        name: 'email',
        disablePadding: false,
        label: 'Email',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        id: 'phone',
        name: 'phone',
        disablePadding: false,
        label: 'Số điện thoại',
        options: {
          filter: false,
          sort: false
        }
      },
      {
        id: 'created',
        name: 'created',
        disablePadding: false,
        label: 'Ngày tạo',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return value ? moment(value).format('DD-MM-YYYY') : '-';
          }
        }
      },
      {
        id: 'updated',
        name: 'updated',
        disablePadding: false,
        label: 'Ngày cập nhật',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return value ? moment(value).format('DD-MM-YYYY') : '-';
          }
        }
      }
    ];

    const options = {
      filterType: 'dropdown',
      filter: false,
      print: false,
      download: false,
      viewColumns: false,
      selectableRows: 'none',
      textLabels: datatable_lang
    };
    return (
      <React.Fragment>
        {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
        <div className={cx(styles['root'])}>
          <TitleTable>Danh sách người dùng ứng dụng</TitleTable>
          {fetchingUserStatus ? (
            <LoadingScreen />
          ) : (
            <MuiThemeProvider theme={customMuiTheme}>
              <MUIDataTable data={users} columns={columns} options={options} />
            </MuiThemeProvider>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    users: state.users.appUsers,
    fetchedUserStatus: state.users.fetchedAppUser,
    total: state.users.totalAppUser,
    fetchingUserStatus: state.users.fetchingAppUser
  }),
  dispatch => ({
    fetchUser: compose(
      dispatch,
      fetchAppUserSaga
    )
  })
)(UsersPage);
