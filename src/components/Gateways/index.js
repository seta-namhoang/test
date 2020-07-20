import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import _ from 'lodash';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Send from '@material-ui/icons/Send';
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Calender from '@material-ui/icons/CalendarToday';
import Revoke from '@material-ui/icons/Reply';
import Active from '@material-ui/icons/SpeakerPhone';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import moment from 'moment';

import GatewayDialog from '../GatewayDialog';
import FileUpload from '../../containers/FileUpload';
import AlertDialog from '../AlertDialog';
import LoadingScreen from '../RouteLoadingScreen';
import SendProduct from '../SendProductDialog';
import ExtendTime from '../ExtendTimeDialog';
import ActiveInMap from '../ActiveInMap';
import CustomToolbarSelect from '../CustomToolbar';
import { statusArr } from '../../helper/constant';
import PermissionWrapper from '../../hocs/Permission';
import { datatable_lang } from '../../asset/lang/vn';
import TitleTable from '../TitleTable';
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

class Agencies extends Component {
  state = {
    open: false,
    edit: false,
    alertOpen: false,
    alertType: '',
    fileUploadOpen: false,
    sendProductOpen: false,
    gateways: [],
    gateway: {},
    seletedIds: [],
    filterType: '',
    filter: [],
    searchText: '',
    showAll: false,
    openExtend: false,
    openActive: false
  };

  static getDerivedStateFromProps(props, state) {
    const { gateways: nextGateways } = props;
    const { gateways: currentGateways } = state;
    if (JSON.stringify(nextGateways) !== JSON.stringify(currentGateways)) {
      return {
        gateways: nextGateways,
        seletedIds: [],
        seletedTableIndexs: []
      };
    }
    return null;
  }

  get getType() {
    const { edit } = this.state;
    return edit ? 'Edit' : 'New';
  }

  get messageDelete() {
    const {
      processingIds = [],
      alertType = 'delete',
      statusPhone = false
    } = this.state;
    if (alertType === 'enablePhone') {
      return `Bạn có chắc muốn ${
        statusPhone ? 'bật' : 'tắt'
      } nhận tin từ tổng đài?`;
    }
    return `Bạn có chắc chắn ${alertType === 'delete' ? 'xoá' : 'thu hồi'} ${
      processingIds.length > 1 ? processingIds.length : ''
    } gateway này?`;
  }

  onAddGateway = () => {
    const { processingGateway } = this.props;
    this.setState({
      edit: false,
      gateway: {}
    });
    processingGateway();
  };

  handleCloseModifyGatewayDialog = async () => {
    const { processedGateway } = this.props;
    await processedGateway();
    await this.setState({
      gateway: {}
    });
  };

  handleDelete = ids => {
    this.setState({
      alertOpen: true,
      alertType: 'delete',
      processingIds: ids
    });
  };

  handleRevoke = ids => {
    this.setState({
      alertOpen: true,
      alertType: 'revoke',
      processingIds: ids
    });
  };

  handleApprove = () => {
    const { deleteGateway, revokeGateway, handleEnableCallAgent } = this.props;
    const { processingIds, alertType, statusPhone } = this.state;
    const idsUri = processingIds.join(',');
    if (alertType === 'delete') {
      deleteGateway(idsUri);
    }
    if (alertType === 'revoke') {
      revokeGateway(idsUri);
    }
    if (alertType === 'enablePhone') {
      handleEnableCallAgent(idsUri, statusPhone);
    }
    this.setState({
      alertOpen: false,
      processingIds: []
    });
  };

  handleCancel = () => {
    this.setState({
      alertOpen: false,
      gateway: {}
    });
  };

  onRowClick = (row, index) => {
    const { gateways } = this.props;
    const { seletedTableIndexs = [] } = this.state;
    const { dataIndex } = index;
    const seletedTableIndexsNew = _.includes(seletedTableIndexs, dataIndex)
      ? seletedTableIndexs.filter(item => item !== dataIndex)
      : [...seletedTableIndexs, dataIndex];
    const gatewaySelectedIdsNew = seletedTableIndexsNew.map(item => {
      const gateway = gateways[item];
      return gateway.id;
    });
    this.setState(state => ({
      ...state,
      seletedIds: [...gatewaySelectedIdsNew],
      seletedTableIndexs: [...seletedTableIndexsNew]
    }));
    return false;
  };

  onRowsDelete = row => {
    const { seletedIds } = this.state;
    this.handleDelete(seletedIds);
    return false;
  };

  onRevoke = () => {
    const { seletedIds } = this.state;
    this.handleRevoke(seletedIds);
    return false;
  };

  onRowSelected = (row, allRowsSelected) => {
    const { gateways } = this.props;
    const ids = allRowsSelected
      .map(item => {
        return gateways[item.dataIndex];
      })
      .map(gateway => {
        return gateway.id;
      });
    const seletedTableIndexs = allRowsSelected.map(item => item.dataIndex);
    this.setState(state => ({
      ...state,
      seletedIds: ids,
      seletedTableIndexs
    }));
    return false;
  };

  sendToAgency = () => {
    const { sellingGateway } = this.props;
    sellingGateway();
  };

  handleCloseSendProduct = () => {
    const { selledGateway } = this.props;
    selledGateway();
  };

  resetDataAfterSell = () => {
    this.setState({
      seletedTableIndexs: [],
      seletedIds: []
    });
  };

  showEditDialog = () => {
    const { gateways, processingGateway } = this.props;
    const { seletedTableIndexs } = this.state;
    const gateway = gateways[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      gateway,
      edit: true
    }));
    processingGateway();
  };

  onUpload = () => {
    this.setState(state => ({
      ...state,
      fileUploadOpen: true
    }));
  };
  handleCloseUpload = () => {
    this.setState(state => ({
      ...state,
      fileUploadOpen: false
    }));
  };

  handleChangeViewMode = () => {
    const { showAll } = this.state;
    const { changeViewMode } = this.props;
    this.setState(state => ({
      ...state,
      showAll: !showAll
    }));
    changeViewMode(!showAll);
  };
  showExtendTime = () => {
    const { gateways } = this.props;
    const { seletedTableIndexs } = this.state;
    const gateway = gateways[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      gateway,
      openExtend: true
    }));
  };

  activeGateway = () => {
    const { gateways } = this.props;
    const { seletedTableIndexs } = this.state;
    const gateway = gateways[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      gateway,
      openActive: true
    }));
  };

  handleCloseActive = () => {
    this.setState(state => ({
      ...state,
      gateway: {},
      openActive: false
    }));
  };

  handleSubmitActive = data => {
    const { gateway } = this.state;
    const { activeOfficeGateway } = this.props;
    activeOfficeGateway(gateway.agency_id, data);
  };

  handleSubmitExtend = time => {
    const { gateway } = this.state;
    const { extendTime } = this.props;
    extendTime(gateway.id, time);
    this.setState(state => ({
      ...state,
      openExtend: false
    }));
  };

  handleCloseExtend = () => {
    this.setState(state => ({
      ...state,
      openExtend: false,
      gateway: {}
    }));
  };

  onFilterChange = (type, value) => {
    this.setState(state => ({
      ...state,
      filterType: type,
      filter: value
    }));
    return false;
  };

  onSearchChange = value => {
    this.setState(state => ({
      ...state,
      searchText: value
    }));
    return false;
  };

  handleChange = (value, data) => event => {
    event.stopPropagation();
    const { gateways } = this.props;
    const rowIndex = data.rowIndex;
    const index = _.get(data, ['tableData', rowIndex, 'index']);
    const gatewayIndex = index || rowIndex;
    const gateway = _.get(gateways, [gatewayIndex], {});
    const statusPhone = value === 0;
    const gatewayId = gateway.id;
    this.setState({
      alertOpen: true,
      alertType: 'enablePhone',
      statusPhone,
      processingIds: [gatewayId]
    });
  };

  onColumnSortChange = (column, direction) => {
    this.setState(state => ({
      ...state,
      sortStatus: {
        column,
        direction
      }
    }));
    return true;
  };

  getSortDirection = type => {
    const { sortStatus = {} } = this.state;
    if (sortStatus.column !== type) {
      return {};
    }
    return sortStatus.direction === 'ascending'
      ? {
          sortDirection: 'asc'
        }
      : {
          sortDirection: 'desc'
        };
  };
  render() {
    const {
      gateways = [],
      classes,
      processingGateway,
      fetchingStatus,
      gatewayTypes = [],
      roles,
      user
    } = this.props;
    const { showAll, filter, searchText } = this.state;
    const columns = [
      {
        name: 'product_type_id',
        label: 'Loại',
        options: {
          filter: true,
          sort: true,
          filterType: 'multiselect',
          filterList: filter[0],
          ...this.getSortDirection('product_type_id'),
          customBodyRender: (value, tableMeta, updateValue) => {
            const gatewayType = gatewayTypes.filter(item => item.id === value);
            return gatewayType.length > 0 ? gatewayType[0].code : '--';
          }
        }
      },
      {
        name: 'name',
        label: 'Mô tả',
        options: {
          filter: false,
          sort: true,
          filterList: filter[1],
          ...this.getSortDirection('name'),
          customBodyRender: (value, tableMeta, updateValue) => {
            return value || '-';
          }
        }
      },
      {
        name: 'imei',
        label: 'Serial',
        options: {
          filter: false,
          sort: true,
          ...this.getSortDirection('imei')
        }
      },
      {
        name: 'hardware_version',
        label: 'Phiên bản',
        options: {
          filter: false,
          sort: true,
          ...this.getSortDirection('hardware_version')
        }
      },
      {
        name: 'mfg',
        label: 'Ngày xuất xưởng',
        options: {
          filter: false,
          sort: true,
          ...this.getSortDirection('mfg'),
          customBodyRender: (value, tableMeta, updateValue) => {
            return value && moment(value).format('DD/MM/YYYY');
          }
        }
      },
      {
        name: 'status',
        label: 'Trạng thái',
        options: {
          filter: true,
          filterList: filter[5],
          sort: true,
          ...this.getSortDirection('status'),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <span
                style={{
                  backgroundColor: `${statusArr[value].color}`,
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}
              >
                {statusArr[value].label}
              </span>
            );
          }
        }
      },
      {
        name: 'sim',
        label: 'Số thẻ sim',
        options: {
          filter: false,
          sort: true,
          ...this.getSortDirection('sim'),
          customBodyRender: (value, tableMeta, updateValue) => {
            return value ? value : '--';
          }
        }
      }
    ];

    const additionCollumn = showAll
      ? [
          {
            name: 'startDate',
            label: 'Ngày kích hoạt',
            options: {
              filter: false,
              sort: true,
              ...this.getSortDirection('startDate'),
              customBodyRender: (value, tableMeta, updateValue) => {
                return value
                  ? moment(new Date(value)).format('DD-MM-YYYY')
                  : '--';
              }
            }
          },
          {
            name: 'enable_call_agent',
            label: 'Tổng đài',
            options: {
              filter: false,
              sort: true,
              ...this.getSortDirection('enable_call_agent'),
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === -1) {
                  return (
                    <Switch
                      disabled
                      checked={value === 1}
                      onClick={this.handleChange(value, tableMeta, updateValue)}
                      value={value}
                    />
                  );
                }
                return (
                  <Switch
                    checked={value === 1}
                    onClick={this.handleChange(value, tableMeta, updateValue)}
                    value={value}
                  />
                );
              }
            }
          },
          {
            name: 'diffEnd',
            label: 'Thuê bao',
            options: {
              filter: false,
              sort: true,
              ...this.getSortDirection('diffEnd'),
              customBodyRender: (value, tableMeta, updateValue) => {
                return value ? value : '--';
              }
            }
          },
          {
            name: 'agencyName',
            label: 'Đại lý',
            options: {
              filter: true,
              filterType: 'multiselect',
              filterList: filter[10],
              sort: true,
              ...this.getSortDirection('agencyName'),
              customBodyRender: (value, tableMeta, updateValue) => {
                return value ? value : '--';
              }
            }
          }
        ]
      : [];

    const toolbarAtions = [
      {
        icon: Calender,
        name: 'extend',
        tooltipTitle: 'Gia hạn thêm thời gian cho gateways',
        action: this.showExtendTime,
        permissionRequired: ['product_extend']
      },
      {
        icon: Active,
        name: 'active',
        tooltipTitle: 'Khởi động Gateways',
        action: this.activeGateway,
        permissionRequired: ['product_action']
      },
      {
        icon: Revoke,
        name: 'revoke',
        tooltipTitle: 'Thu hồi gateway',
        action: this.onRevoke,
        permissionRequired: ['product_revoke']
      },
      {
        icon: EditIcon,
        name: 'edit',
        tooltipTitle: 'Chỉnh sửa thông tin gateway',
        action: this.showEditDialog,
        permissionRequired: ['product_update']
      },
      {
        icon: Send,
        name: 'sendGateway',
        tooltipTitle: 'Chuyển xuống đại lý trưc thuộc',
        action: this.sendToAgency,
        permissionRequired: ['product_action']
      },
      {
        icon: Delete,
        name: 'deleteGatway',
        tooltipTitle: 'Xoá gateway đã chọn',
        action: this.onRowsDelete,
        permissionRequired: ['product_delete']
      }
    ];

    const options = {
      filterType: 'checkbox',
      filter: true,
      print: false,
      download: false,
      viewColumns: false,
      // onRowClick: this.onRowClick,
      onRowsSelect: this.onRowSelected,
      rowsSelected: this.state.seletedTableIndexs,
      onFilterChange: this.onFilterChange,
      onSearchChange: this.onSearchChange,
      searchText: searchText,
      textLabels: datatable_lang,
      onColumnSortChange: this.onColumnSortChange,
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
        <CustomToolbarSelect
          toolbarAtions={toolbarAtions}
          selectedRows={selectedRows}
          displayData={displayData}
        />
      )
    };

    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <TitleTable>Kho gateway</TitleTable>
          <Box>
            <PermissionWrapper permissionRequired={['view_all']}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.showAll}
                    onChange={this.handleChangeViewMode}
                    value={this.state.showAll}
                    inputProps={{
                      'aria-label': 'Hiển thị tất cả Gateway'
                    }}
                  />
                }
                label="Hiển thị tất cả Gateway"
              />
            </PermissionWrapper>
            <PermissionWrapper permissionRequired={['product_create']}>
              <Button
                onClick={this.onAddGateway}
                color="primary"
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Thêm mới Gateway
              </Button>
            </PermissionWrapper>
          </Box>
        </div>
        {fetchingStatus ? (
          <LoadingScreen />
        ) : (
          <div>
            {this.props.loadingStatus && <div>23453456789</div>}
            <MuiThemeProvider theme={customMuiTheme}>
              <MUIDataTable
                data={gateways}
                columns={[...columns, ...additionCollumn]}
                options={options}
              />
            </MuiThemeProvider>
            <GatewayDialog
              open={this.props.proccessingStatus}
              gateway={this.state.gateway}
              edit={this.state.edit}
              handleClose={this.handleCloseModifyGatewayDialog}
              createGateway={this.props.addGateway}
              editGateway={this.props.editGateway}
              type={this.getType}
              processingGateway={processingGateway}
              gatewayTypes={gatewayTypes}
              role={_.get(roles, [0])}
            />
            <AlertDialog
              open={this.state.alertOpen}
              onApprove={this.handleApprove}
              onCancel={this.handleCancel}
              title="Thông báo"
              message={this.messageDelete}
            />
            <PermissionWrapper permissionRequired={['product_action']}>
              <SendProduct
                open={this.props.sellingStatus}
                type="Gateway"
                productIds={this.state.seletedIds}
                agencies={this.props.agencies}
                handleClose={this.handleCloseSendProduct}
                sellProduct={this.props.sellGateway}
                resetData={this.resetDataAfterSell}
              />
            </PermissionWrapper>
            <PermissionWrapper permissionRequired={[]}>
              <ExtendTime
                open={this.state.openExtend}
                handleClose={this.handleCloseExtend}
                handleSubmit={this.handleSubmitExtend}
                gateway={this.state.gateway}
              />
            </PermissionWrapper>
            <FileUpload
              onClose={this.handleCloseUpload}
              open={this.state.fileUploadOpen}
              reFetchData={this.props.fetchGateways}
              fileTypeSupport="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              type="gateway"
              url="/gateways/import"
              enableShowResult
            />
            {/* <ActiveGateway
              open={this.state.openActive}
              handleClose={this.handleCloseActive}
              handleSubmit={this.handleSubmitActive}
            /> */}
            <ActiveInMap
              open={this.state.openActive}
              user={user}
              gateway={this.state.gateway}
              handleClose={this.handleCloseActive}
              handleSubmit={this.handleSubmitActive}
            />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Agencies);
