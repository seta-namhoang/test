import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import GatewaysControl from '../../components/ControlDialog';
import Geo from '../../components/Geo';
import GeoFilter from '../../components/GeoFilter';
// import BreadCrumbs from '../../components/BreadCrumbs';
import {
  gatewayTypesSelector,
  nodeTypesSelector
} from '../../state/modules/products/selector';
import { getAgencies } from '../../state/modules/agencies/selector';
import { fetchAgenciesSaga } from '../../state/modules/agencies';
import {
  fetchGatewayTypesSaga,
  fetchNodesTypesSaga
} from '../../state/modules/products';
import {
  fetchGatewaysControlSaga,
  turnOffAlert,
  enableCallPremiumAgent,
  updatePremiumAgentPhone,
  getGatewayLogs,
  pingNode
} from '../../state/modules/control';
import {
  controllingGateways,
  processingControlStatus,
  getTargetGatewayId,
  getGwListLength
} from '../../state/modules/control/selector';
import { updateInfoActiveOfficeGateway } from '../../state/modules/gateways';
import {
  editNodeSaga,
  activePVNNode,
  deactivePVNNode
} from '../../state/modules/nodes';
import { enableCallAgent } from '../../state/modules/gateways';
import { getRoles } from '../../state/modules/auth/index';

// const breadcrumbsList = [
//   {
//     id: 1,
//     name: 'Trang chủ',
//     href: '/',
//     route: 'route/ROUTE_HOME'
//   },
//   {
//     id: 2,
//     name: 'Giám sát',
//     href: '/control',
//     route: 'route/ROUTE_CONTROL'
//   }
// ];

const initStateFilterParam = {
  product_type_id: -1,
  agency_id: -1,
  agency_childen_ids: []
};

function Control({
  user,
  agencies,
  gatewayTypes,
  nodeTypes,
  editNodeControl,
  fetchAgency,
  fetchGatewayType,
  fetchNodeType,
  fetchGatewaysControl,
  turnOffAlert,
  saveUpdateInfoActiveOfficeGateway,
  handleEnableCallAgent,
  getGatewayLogs,
  gatewayControl = [],
  redirect,
  agenciesFetchedStatus,
  processingControlStatus,
  // routePayload,
  targetGatewayId,
  gwListLength,
  accessToken,
  roles,
  handleActivePVNNode,
  handleDeactivePVNNode,
  handlePingNode,
  ...remainProps
}) {
  const [open, setOpen] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [anchorElPopperFilter, setAnchorElPopperFilter] = React.useState(null);
  const [currentGatewayId, setCurrentGatewayId] = React.useState({});
  const [filterParams, setFilterParams] = React.useState(initStateFilterParam);

  React.useEffect(() => {
    if (!agencies.length && !agenciesFetchedStatus) {
      fetchAgency();
    }
  }, [agencies, agenciesFetchedStatus]);

  React.useEffect(() => {
    if (
      !_.isNil(targetGatewayId) &&
      !_.isUndefined(targetGatewayId) &&
      gatewayControl.length > 0
    ) {
      const gateway = gatewayControl.filter(
        item => item.imei === targetGatewayId
      )[0];
      if (!_.isNil(_.get(gateway, 'id'))) {
        setCurrentGatewayId(gateway.id);
      }
    }
  }, [targetGatewayId, gatewayControl]);

  React.useEffect(() => {
    if (!gatewayTypes.length) {
      fetchGatewayType();
    }
  }, [gatewayTypes]);

  React.useEffect(() => {
    if (!nodeTypes.length) {
      fetchNodeType();
    }
  }, [nodeTypes]);

  React.useEffect(() => {
    let timer;
    if (gatewayTypes.length > 0 && nodeTypes.length > 0) {
      fetchGatewaysControl(filterParams);
      function progress() {
        fetchGatewaysControl(filterParams);
      }
      timer = setInterval(progress, 30000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [agencies, gatewayTypes, nodeTypes, filterParams]);
  const onClickMarker = gateway => {
    setCurrentGatewayId(gateway.id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function onShowFilter(event) {
    setAnchorElPopperFilter(event.currentTarget);
    setOpenFilter(true);
  }
  function handleCloseFilter() {
    setOpenFilter(false);
    setFilterParams(initStateFilterParam);
  }
  const handleFilter = data => {
    setOpenFilter(false);
    setFilterParams(data);
  };
  // const updateParams = ({ key, value }) => {
  //   setFilterParams({ ...filterParams, [key]: value });
  //   setOpenFilter(false);
  // };
  const editNode = (node, gateway) => {
    editNodeControl(node, true, gateway.id);
  };
  const currentGateway = gatewayControl.filter(
    item => item.id === currentGatewayId
  )[0];

  return (
    <React.Fragment>
      {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
      <Geo
        {...remainProps}
        data={gatewayControl}
        onClickMarker={onClickMarker}
        onShowFilter={onShowFilter}
        productTypes={gatewayTypes}
        defaultGateway={!_.isNil(targetGatewayId) ? currentGateway : {}}
        gwListLength={gwListLength}
        roles={roles}
        user={user}
      />
      <GatewaysControl
        id={currentGatewayId}
        gateway={currentGateway}
        open={open}
        handleClose={handleClose}
        agencies={agencies}
        nodeTypes={nodeTypes}
        gatewayTypes={gatewayTypes}
        editNode={editNode}
        processingControlStatus={processingControlStatus}
        turnOffAlert={turnOffAlert}
        getGatewayLogs={getGatewayLogs}
        enableCallPremiumAgent={enableCallPremiumAgent}
        updatePremiumAgentPhone={updatePremiumAgentPhone}
        roles={roles}
        user={user}
        saveUpdateInfoActiveOfficeGateway={saveUpdateInfoActiveOfficeGateway}
        handleEnableCallAgent={handleEnableCallAgent}
        handleActivePVNNode={handleActivePVNNode}
        handleDeactivePVNNode={handleDeactivePVNNode}
        handlePingNode={handlePingNode}
      />
      <GeoFilter
        open={openFilter}
        anchorElPopperFilter={anchorElPopperFilter}
        agencies={agencies}
        gatewayTypes={gatewayTypes}
        handleClose={handleCloseFilter}
        handleFilter={handleFilter}
        accessToken={accessToken}
      />
    </React.Fragment>
  );
}

export default connect(
  state => ({
    gatewayTypes: gatewayTypesSelector(state),
    nodeTypes: nodeTypesSelector(state),
    agencies: getAgencies(state),
    agenciesFetchedStatus: state.agencies.fetched,
    gatewayControl: controllingGateways(state),
    processingControlStatus: processingControlStatus(state),
    targetGatewayId: getTargetGatewayId(state),
    gwListLength: getGwListLength(state),
    accessToken: state.auth.access_token,
    roles: getRoles(state),
    user: state.auth.user
  }),
  dispatch => ({
    editNodeControl: compose(
      dispatch,
      editNodeSaga
    ),
    fetchAgency: compose(
      dispatch,
      fetchAgenciesSaga
    ),
    fetchGatewayType: compose(
      dispatch,
      fetchGatewayTypesSaga
    ),
    fetchNodeType: compose(
      dispatch,
      fetchNodesTypesSaga
    ),
    fetchGatewaysControl: compose(
      dispatch,
      fetchGatewaysControlSaga
    ),
    turnOffAlert: compose(
      dispatch,
      turnOffAlert
    ),
    enableCallPremiumAgent: compose(
      dispatch,
      enableCallPremiumAgent
    ),
    getGatewayLogs: compose(
      dispatch,
      getGatewayLogs
    ),
    saveUpdateInfoActiveOfficeGateway: compose(
      dispatch,
      updateInfoActiveOfficeGateway
    ),
    handleEnableCallAgent: compose(
      dispatch,
      enableCallAgent
    ),
    handleActivePVNNode: compose(
      dispatch,
      activePVNNode
    ),
    handleDeactivePVNNode: compose(
      dispatch,
      deactivePVNNode
    ),
    handlePingNode: compose(
      dispatch,
      pingNode
    )
  })
)(Control);
