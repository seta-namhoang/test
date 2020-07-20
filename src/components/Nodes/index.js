import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import _ from 'lodash';
import moment from 'moment';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Send from '@material-ui/icons/Send';
import Delete from '@material-ui/icons/Delete';
import Revoke from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import NodeDialog from '../NodeDialog';
import AlertDialog from '../AlertDialog';
import LoadingScreen from '../RouteLoadingScreen';
import CustomToolbarSelect from '../CustomToolbar';
import SendProduct from '../SendProductDialog';
import { statusArr } from '../../helper/constant';
import PermissionWrapper from '../../hocs/Permission';
import FileUpload from '../../containers/FileUpload';
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

class Nodes extends Component {
  state = {
    open: false,
    edit: false,
    alertOpen: false,
    alertType: '',
    node: {},
    nodes: [],
    seletedIds: [],
    showAll: false,
    fileUploadOpen: false,
    filterType: '',
    filter: [],
    searchText: ''
  };

  get getType() {
    const { edit } = this.state;
    return edit ? 'Edit' : 'New';
  }

  get messageDelete() {
    const { processingIds = [], alertType = 'delete' } = this.state;
    return `Bạn có chắc chắn ${alertType === 'delete' ? 'xoá' : 'thu hồi'} ${
      processingIds.length > 1 ? processingIds.length : ''
    } thiết bị này?`;
  }

  static getDerivedStateFromProps(props, state) {
    const { nodes: nextNodes } = props;
    const { nodes: currentNodes } = state;
    if (JSON.stringify(nextNodes) !== JSON.stringify(currentNodes)) {
      return {
        nodes: nextNodes,
        seletedIds: [],
        seletedTableIndexs: []
      };
    }
    return null;
  }

  onAddNode = () => {
    const { processingNode } = this.props;
    this.setState({
      edit: false,
      node: {}
    });
    processingNode();
  };

  handleCloseModifyNodeDialog = async () => {
    const { processedNode } = this.props;
    await processedNode();
    await this.setState({
      node: {}
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
    const { deleteNode, revokeNode } = this.props;
    const { processingIds, alertType } = this.state;
    const idsUri = processingIds.join(',');
    if (alertType === 'delete') {
      deleteNode(idsUri);
    }
    if (alertType === 'revoke') {
      revokeNode(idsUri);
    }
    this.setState({
      alertOpen: false,
      processingIds: []
    });
  };

  handleCancel = () => {
    this.setState({
      alertOpen: false,
      node: {}
    });
  };

  onRowClick = (row, index) => {
    const { nodes } = this.props;
    const { seletedTableIndexs = [] } = this.state;
    const { dataIndex } = index;
    const seletedTableIndexsNew = _.includes(seletedTableIndexs, dataIndex)
      ? seletedTableIndexs.filter(item => item !== dataIndex)
      : [...seletedTableIndexs, dataIndex];
    const nodeSelectedIdsNew = seletedTableIndexsNew.map(item => {
      const node = nodes[item];
      return node.id;
    });
    this.setState(state => ({
      ...state,
      seletedIds: [...nodeSelectedIdsNew],
      seletedTableIndexs: [...seletedTableIndexsNew]
    }));
  };

  onRowsDelete = row => {
    const { seletedIds } = this.state;
    this.handleDelete(seletedIds);
  };

  onRevoke = () => {
    const { seletedIds } = this.state;
    this.handleRevoke(seletedIds);
    return false;
  };

  onRowSelected = (row, allRowsSelected) => {
    const { nodes } = this.props;
    const ids = allRowsSelected
      .map(item => {
        return nodes[item.dataIndex];
      })
      .map(node => {
        return node.id;
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
    const { sellingNode } = this.props;
    sellingNode();
  };

  handleCloseSendProduct = () => {
    const { selledNode } = this.props;
    selledNode();
  };

  resetDataAfterSell = () => {
    this.setState({
      seletedTableIndexs: [],
      seletedIds: []
    });
  };

  showEditDialog = () => {
    const { nodes, processingNode } = this.props;
    const { seletedTableIndexs } = this.state;
    const node = nodes[seletedTableIndexs[0]];
    this.setState(state => ({
      ...state,
      node,
      edit: true
    }));
    processingNode();
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

  render() {
    const {
      nodes = [],
      classes,
      processingNode,
      fetchingStatus,
      nodeTypes = [],
      roles
    } = this.props;
    const { filter, showAll } = this.state;
    const columns = [
      {
        name: 'product_type_id',
        label: 'Loại',
        options: {
          filter: true,
          sort: true,
          filterType: 'multiselect',
          filterList: filter[0],
          customBodyRender: (value, tableMeta, updateValue) => {
            const nodeType = nodeTypes.filter(item => item.id === value);
            return nodeType.length > 0 ? nodeType[0].code : '--';
          }
        }
      },
      {
        name: 'name',
        label: 'Mô tả',
        options: {
          filter: false,
          sort: true,
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
          sort: true
        }
      },
      {
        name: 'version',
        label: 'Phiên bản',
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: 'mfg',
        label: 'Ngày xuất xưởng',
        options: {
          filter: false,
          sort: true,
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
          sort: false,
          filterList: filter[5],
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
      }
    ];

    const additionCollumn = showAll
      ? [
          {
            name: 'agencyName',
            label: 'Đại lý',
            options: {
              filter: true,
              filterType: 'multiselect',
              filterList: filter[6],
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                return value ? value : '--';
              }
            }
          }
        ]
      : [];

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
      searchText: this.state.searchText,
      onSearchChange: this.onSearchChange,
      textLabels: datatable_lang,
      customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
        <CustomToolbarSelect
          toolbarAtions={toolbarAtions}
          selectedRows={selectedRows}
          displayData={displayData}
        />
      )
    };

    const toolbarAtions = [
      {
        icon: EditIcon,
        name: 'edit',
        tooltipTitle: 'Chỉnh sửa thông tin node',
        action: this.showEditDialog,
        permissionRequired: ['product_update']
      },
      {
        icon: Revoke,
        name: 'revoke',
        tooltipTitle: 'Thu hồi node',
        action: this.onRevoke,
        permissionRequired: ['product_revoke']
      },
      {
        icon: Send,
        name: 'sendNode',
        tooltipTitle: 'Chuyển xuống đại lý trưc thuộc',
        action: this.sendToAgency,
        permissionRequired: ['product_action']
      },
      {
        icon: Delete,
        name: 'deleteNode',
        tooltipTitle: 'Xoá node đã chọn',
        action: this.onRowsDelete,
        permissionRequired: ['product_delete']
      }
    ];
    return (
      <div className={classes.root}>
        <div className={classes.head}>
          <TitleTable>Kho node</TitleTable>
          <Box>
            <PermissionWrapper permissionRequired={['view_all']}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.showAll}
                    onChange={this.handleChangeViewMode}
                    value={this.state.showAll}
                    inputProps={{
                      'aria-label': 'hiển thị tất cả Node'
                    }}
                  />
                }
                label="Hiển thị tất cả Node"
              />
            </PermissionWrapper>
            <PermissionWrapper permissionRequired={['product_create']}>
              <Button
                onClick={this.onAddNode}
                color="primary"
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Thêm mới Node
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
                data={nodes}
                columns={[...columns, ...additionCollumn]}
                options={options}
              />
            </MuiThemeProvider>
            <NodeDialog
              open={this.props.proccessingStatus}
              node={this.state.node}
              edit={this.state.edit}
              handleClose={this.handleCloseModifyNodeDialog}
              createNode={this.props.addNode}
              editNode={this.props.editNode}
              type={this.getType}
              processingNode={processingNode}
              nodeTypes={nodeTypes}
              role={_.get(roles, [0])}
            />
            <AlertDialog
              open={this.state.alertOpen}
              onApprove={this.handleApprove}
              onCancel={this.handleCancel}
              title="Thông báo"
              message={this.messageDelete}
            />
            <SendProduct
              open={this.props.sellingStatus}
              type="Node"
              productIds={this.state.seletedIds}
              agencies={this.props.agencies}
              handleClose={this.handleCloseSendProduct}
              sellProduct={this.props.sellNode}
              resetData={this.resetDataAfterSell}
            />
            <FileUpload
              onClose={this.handleCloseUpload}
              open={this.state.fileUploadOpen}
              reFetchData={this.props.fetchNodes}
              type="node"
              url="/nodes/import"
              fileTypeSupport="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              enableShowResult
            />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Nodes);
