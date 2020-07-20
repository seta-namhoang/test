import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Gateways from '../../components/Gateways';
import {
  fetchGatewaysSaga,
  fetchAllGatewaysSaga,
  addGatewaySaga,
  editGatewaySaga,
  deleteGatewaySaga,
  processedGateway,
  processingGateway,
  sellingGateway,
  sellGatewaySaga,
  selledGateway,
  extendTimeGatewaySaga,
  revokeGatewaySaga,
  enableCallAgent,
  activeOfficeGatewayAction
} from '../../state/modules/gateways';
import { getRoles } from '../../state/modules/auth/index';
import BreadCrumbs from '../../components/BreadCrumbs';
import { gatewayTypesSelector } from '../../state/modules/products/selector';
import {
  getGateways,
  updatingStatus
} from '../../state/modules/gateways/selector';

const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  },
  {
    id: 2,
    name: 'Quản lý Gateways',
    href: '/gateways',
    route: 'route/ROUTE_GATEWAYS'
  }
];

function GatewaysPage({
  redirect,
  fetchGateways,
  loginStatus,
  fetchAllGateways,
  fetchingStatus,
  fetchedGatewayStatus,
  extendTimeGateway,
  ...remainProps
}) {
  const [showAll, setShowAll] = React.useState(false);
  React.useEffect(() => {
    document.title = 'VNCSS | Quản lý Gateway';
  }, []);

  React.useEffect(() => {
    if (loginStatus) {
      if (!showAll) {
        fetchGateways();
      } else {
        fetchAllGateways();
      }
    }
  }, [showAll, loginStatus]);

  const changeViewMode = mode => {
    setShowAll(mode);
  };

  const extendTime = (gatewayId, time) => {
    extendTimeGateway(gatewayId, time);
  };

  return (
    <>
      {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
      <Gateways
        extendTime={extendTime}
        changeViewMode={changeViewMode}
        fetchGateways={fetchGateways}
        loginStatus={loginStatus}
        fetchAllGateways={fetchAllGateways}
        fetchingStatus={fetchingStatus}
        {...remainProps}
      />
    </>
  );
}
export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    gateways: getGateways(state),
    fetchedGatewayStatus: state.gateways.fetched,
    total: state.gateways.total,
    proccessingStatus: state.gateways.processing,
    fetchingStatus: state.gateways.fetching,
    agencies: state.agencies.agencies,
    sellingStatus: state.gateways.selling,
    gatewayTypes: gatewayTypesSelector(state),
    updatingStatus: updatingStatus(state),
    roles: getRoles(state),
    user: state.auth.user
  }),
  dispatch => ({
    fetchGateways: compose(
      dispatch,
      fetchGatewaysSaga
    ),
    addGateway: compose(
      dispatch,
      addGatewaySaga
    ),
    editGateway: compose(
      dispatch,
      editGatewaySaga
    ),
    deleteGateway: compose(
      dispatch,
      deleteGatewaySaga
    ),
    processingGateway: compose(
      dispatch,
      processingGateway
    ),
    processedGateway: compose(
      dispatch,
      processedGateway
    ),
    sellingGateway: compose(
      dispatch,
      sellingGateway
    ),
    selledGateway: compose(
      dispatch,
      selledGateway
    ),
    sellGateway: compose(
      dispatch,
      sellGatewaySaga
    ),
    fetchAllGateways: compose(
      dispatch,
      fetchAllGatewaysSaga
    ),
    extendTimeGateway: compose(
      dispatch,
      extendTimeGatewaySaga
    ),
    revokeGateway: compose(
      dispatch,
      revokeGatewaySaga
    ),
    handleEnableCallAgent: compose(
      dispatch,
      enableCallAgent
    ),
    activeOfficeGateway: compose(
      dispatch,
      activeOfficeGatewayAction
    )
  })
)(GatewaysPage);
