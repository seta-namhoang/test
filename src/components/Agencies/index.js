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
import VerifyUser from '@material-ui/icons/VerifiedUser';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import AgencyDialog from '../AgencyDialog';
import AlertDialog from '../AlertDialog';
import LoadingScreen from '../RouteLoadingScreen';

import CustomToolbarSelect from '../CustomToolbar';
import PasswordDialog from '../PasswordDialog';
import TitleTable from '../TitleTable';
import PermissionWrapper from '../../hocs/Permission';
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

class Agencies extends Component {
  state = {
    open: false,
    edit: false,
    alertOpen: false,
    passwordOpen: false,
    agency: {},
    agencies: [],
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
    } đại lý này?`;
  }

  static getDerivedStateFromProps(props, state) {
    const { agencies: nextAgencies } = props;
    const { agencies: currentAgencies } = state;
    if (JSON.stringify(nextAgencies) !== JSON.stringify(currentAgencies)) {
      return {
        agencies: nextAgencies,
        seletedIds: [],
        seletedTableIndexs: []
      };
    }
    return null;
  }

  onAddAgency = () => {
    const { proccessingAgency } = this.props;
    this.setState({
      edit: false,
      agency: {}
    });
    proccessingAgency();
  };

  handleCloseDialog = async () => {
    const { processedAgency } = this.props;
    await processedAgency();
    await this.setState({
      agency: {}
    });
  };

  handleDelete = ids => {
    this.setState({
      alertOpen: true,
      deleteIds: ids
    });
  };

  handleApprove = () => {
    const { deleteAgency } = this.props;
    const { deleteIds } = this.state;
    const idsUri = deleteIds.join(',');
    deleteAgency(idsUri);
    this.setState({
      alertOpen: false,
      deleteIds: []
    });
  };

  handleCancel = () => {
    this.setState({
      alertOpen: false,
      agency: {}
    });
  };

  onRowsDelete = () => {
    const { seletedIds } = this.state;
    this.handleDelete(seletedIds);
    return false;
  };

  onRowClick = (row, index) => {
    const { agencies } = this.props;
    const { seletedTableIndexs = [] } = this.state;
    const { dataIndex } = index;
    const seletedTableIndexsNew = _.includes(seletedTableIndexs, dataIndex)
      ? seletedTableIndexs.filter(item => item !== dataIndex)
      : [...seletedTableIndexs, dataIndex];
    const agencySelectedIdsNew = seletedTableIndexsNew.map(item => {
      const agency = agencies[item];
      return agency.id;
    });
    this.setState(state => ({
      ...state,
      seletedIds: [...agencySelectedIdsNew],
      seletedTableIndexs: [...seletedTableIndexsNew]
    }));
    return false;
  };

  onRowSelected = (row, allRowsSelected) => {
    const { agencies } = this.props;
    const ids = allRowsSelected
      .map(item => {
        return agencies[item.dataIndex];
      })
      .map(agency => {
        return agency.id;
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
    const { agencies, proccessingAgency } = this.props;
    const { seletedTableIndexs } = this.state;
    const agency = agencies[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      agency,
      edit: true
    }));
    proccessingAgency();
  };

  onSearchChange = value => {
    this.setState(state => ({
      ...state,
      searchText: value
    }));
    return false;
  };

  showPasswordDialog = () => {
    const { agencies } = this.props;
    const { seletedTableIndexs } = this.state;
    const agency = agencies[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      passwordOpen: true,
      agency
    }));
  };

  handlePasswordClose = () => {
    this.setState(state => ({
      passwordOpen: false,
      agency: {}
    }));
  };

  handlePasswordSubmit = (agencyId, password) => {
    const { resetAgencyPassword } = this.props;
    resetAgencyPassword(agencyId, password);
    this.setState(state => ({
      seletedTableIndexs: []
    }));
    this.handlePasswordClose();
  };

  render() {
    const columns = [
      {
        name: 'code',
        label: 'Code',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'name',
        label: 'Tên',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'address',
        label: 'Địa chỉ',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'status',
        label: 'Trạng thái',
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) =>
            value === 'active' ? 'Hoạt động' : 'Không hoạt động'
        }
      },
      {
        name: 'userNameMng',
        label: 'Tài khoản',
        options: {
          filter: true,
          sort: false
        }
      },
      {
        name: 'nameMng',
        label: 'Tên',
        options: {
          filter: true,
          sort: false
        }
      },
      {
        name: 'phoneMng',
        label: 'Số điện thoại',
        options: {
          filter: true,
          sort: false
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
        icon: VerifyUser,
        name: 'changePassword',
        tooltipTitle: 'Thay đổi mật khẩu quản lý',
        action: this.showPasswordDialog,
        permissionRequired: []
      },
      {
        icon: EditIcon,
        name: 'edit',
        tooltipTitle: 'Chỉnh sửa thông tin đại lý',
        action: this.showEditDialog,
        permissionRequired: ['agency_update']
      },
      {
        icon: Delete,
        name: 'deleteAgency',
        tooltipTitle: 'Xoá đại lý đã chọn',
        action: this.onRowsDelete,
        permissionRequired: ['agency_delete']
      }
    ];
    const {
      agencies = [],
      classes,
      proccessingAgency,
      fetchingStatus
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <TitleTable>Danh sách đại lý</TitleTable>
          <Box>
            <PermissionWrapper permissionRequired={['agency_create']}>
              <Button
                onClick={this.onAddAgency}
                color="primary"
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Thêm mới đại lý
              </Button>
            </PermissionWrapper>
          </Box>
        </div>

        {fetchingStatus ? (
          <LoadingScreen />
        ) : (
          <div>
            <MuiThemeProvider theme={customMuiTheme}>
              <MUIDataTable
                data={agencies}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>

            <AgencyDialog
              open={this.props.proccessingStatus}
              agency={this.state.agency}
              edit={this.state.edit}
              handleClose={this.handleCloseDialog}
              createAgency={this.props.addAgency}
              editAgency={this.props.editAgency}
              type={this.getType}
              proccessingAgency={proccessingAgency}
            />
            <AlertDialog
              open={this.state.alertOpen}
              onApprove={this.handleApprove}
              onCancel={this.handleCancel}
              title="Thông báo"
              message={this.messageDelete}
            />
            <PasswordDialog
              open={this.state.passwordOpen}
              handleClose={this.handlePasswordClose}
              handleSubmit={this.handlePasswordSubmit}
              agencyId={this.state.agency.id}
            />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Agencies);
