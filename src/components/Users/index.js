import React, { Component } from 'react';
import _ from 'lodash';
import MUIDataTable from 'mui-datatables';
import {
  MuiThemeProvider,
  withStyles,
  createMuiTheme
} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import PermissionWrapper from '../../hocs/Permission';
import UserDialog from '../UserDialog';
import AlertDialog from '../AlertDialog';
import LoadingScreen from '../RouteLoadingScreen';
import CustomToolbarSelect from '../CustomToolbar';
import TitleTable from '../TitleTable';
import moment from 'moment';
import { datatable_lang } from '../../asset/lang/vn';
import customMuiTheme from '../../styles/themes/customMuiTheme';

const styles = theme => ({
  root: {
    width: '100%',
    padding: '0 24px',
    marginBottom: '100px'
  },
  table: {
    minWidth: 700
  },
  fab: {
    position: 'fixed',
    bottom: 40,
    right: 20
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableBodyRow: {
        root: {
          '&:nth-child(odd)': {
            backgroundColor: 'rgba(0,0,0,.05)'
          }
        }
      },
      MUIDataTableHeadCell: {
        data: {
          fontWeight: 600,
          color: '#333333'
        },
        sortAction: {
          fontWeight: 600,
          color: '#333333'
        }
      }
    }
  });

class Users extends Component {
  state = {
    open: false,
    edit: false,
    alertOpen: false,
    user: {},
    users: [],
    searchText: ''
  };

  get getType() {
    const { edit } = this.state;
    return edit ? 'Edit' : 'New';
  }

  get messageDelete() {
    const { deleteIds = [] } = this.state;
    return `Bạn có chắc chắn xoá ${
      deleteIds.length > 1 ? deleteIds.length : ''
    } người dùng này?`;
  }

  static getDerivedStateFromProps(props, state) {
    const { users: nextUsers } = props;
    const { users: currentUsers } = state;
    if (JSON.stringify(nextUsers) !== JSON.stringify(currentUsers)) {
      return {
        users: nextUsers,
        seletedIds: [],
        seletedTableIndexs: []
      };
    }
    return null;
  }

  onAddUser = () => {
    const { proccessingUser } = this.props;
    this.setState({
      edit: false,
      user: {}
    });
    proccessingUser();
  };

  handleCloseDialog = async () => {
    const { processedUser } = this.props;
    await processedUser();
    await this.setState({
      user: {}
    });
  };

  handleDelete = ids => {
    this.setState({
      alertOpen: true,
      deleteIds: ids
    });
  };

  handleApprove = () => {
    const { deleteUser } = this.props;
    const { deleteIds } = this.state;
    const idsUri = deleteIds.join(',');
    deleteUser(idsUri);
    this.setState({
      alertOpen: false,
      deleteIds: []
    });
  };

  handleCancel = () => {
    this.setState({
      alertOpen: false,
      user: {}
    });
  };

  onRowsDelete = () => {
    const { seletedIds } = this.state;
    this.handleDelete(seletedIds);
    return false;
  };

  onRowClick = (row, index) => {
    const { users } = this.props;
    const { seletedTableIndexs = [] } = this.state;
    const { dataIndex } = index;
    const seletedTableIndexsNew = _.includes(seletedTableIndexs, dataIndex)
      ? seletedTableIndexs.filter(item => item !== dataIndex)
      : [...seletedTableIndexs, dataIndex];
    const userSelectedIdsNew = seletedTableIndexsNew.map(item => {
      const user = users[item];
      return user.id;
    });
    this.setState(state => ({
      ...state,
      seletedIds: [...userSelectedIdsNew],
      seletedTableIndexs: [...seletedTableIndexsNew]
    }));
    return false;
  };

  onRowSelected = (row, allRowsSelected) => {
    const { users } = this.props;
    const ids = allRowsSelected
      .map(item => {
        return users[item.dataIndex];
      })
      .map(user => {
        return user.id;
      });
    const seletedTableIndexs = allRowsSelected.map(item => item.dataIndex);
    this.setState(state => ({
      ...state,
      seletedIds: ids,
      seletedTableIndexs
    }));
    return false;
  };

  showEditDialog = () => {
    const { users, proccessingUser } = this.props;
    const { seletedTableIndexs } = this.state;
    const user = users[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      user,
      edit: true
    }));
    proccessingUser();
  };

  onSearchChange = value => {
    this.setState(state => ({
      ...state,
      searchText: value
    }));
    return false;
  };

  render() {
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
      viewColumns: false,
      download: false,
      rowsSelected: this.state.seletedTableIndexs || [],
      onRowsSelect: this.onRowSelected,
      // onRowClick: this.onRowClick,
      searchText: this.state.searchText,
      onSearchChange: this.onSearchChange,
      textLabels: datatable_lang,
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
        <CustomToolbarSelect
          toolbarAtions={toolbarAtions}
          selectedRows={selectedRows}
        />
      )
    };
    const toolbarAtions = [
      {
        icon: EditIcon,
        name: 'edit',
        tooltipTitle: 'Chỉnh sửa thông tin người dùng',
        action: this.showEditDialog,
        permissionRequired: ['user_update']
      },
      {
        icon: Delete,
        name: 'deleteUser',
        tooltipTitle: 'Xoá người dùng đã chọn',
        action: this.onRowsDelete,
        permissionRequired: ['user_delete']
      }
    ];
    const {
      users = [],
      classes,
      proccessingUser,
      fetchingUserStatus
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <TitleTable>Danh sách người dùng</TitleTable>
          <Box>
            <PermissionWrapper permissionRequired={['user_create']}>
              <Button
                onClick={this.onAddUser}
                color="primary"
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Thêm mới người dùng
              </Button>
            </PermissionWrapper>
          </Box>
        </div>
        {fetchingUserStatus ? (
          <LoadingScreen />
        ) : (
          <div>
            <MuiThemeProvider theme={customMuiTheme}>
              <MUIDataTable data={users} columns={columns} options={options} />
            </MuiThemeProvider>
            <UserDialog
              open={this.props.proccessing}
              user={this.state.user}
              edit={this.state.edit}
              handleClose={this.handleCloseDialog}
              createUser={this.props.addUser}
              editUser={this.props.editUser}
              type={this.getType}
              proccessingUser={proccessingUser}
            />
            <AlertDialog
              open={this.state.alertOpen}
              onApprove={this.handleApprove}
              onCancel={this.handleCancel}
              title="Thông báo"
              message={this.messageDelete}
            />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Users);
