import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Nodes from '../../components/Nodes';
import {
  fetchNodeSaga,
  addNodeSaga,
  editNodeSaga,
  deleteNodeSaga,
  processedNode,
  processingNode,
  sellingNode,
  sellNodeSaga,
  selledNode,
  fetchAllNodesSaga,
  revokeNodeSaga
} from '../../state/modules/nodes';
import BreadCrumbs from '../../components/BreadCrumbs';
import { nodeTypesSelector } from '../../state/modules/products/selector';
import { getNodes } from '../../state/modules/nodes/selector';
import { getRoles } from '../../state/modules/auth/index';

const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  },
  {
    id: 2,
    name: 'Quản lý thiết bị',
    href: '/nodes',
    route: 'route/ROUTE_NODES'
  }
];
function NodesPage({
  redirect,
  loginStatus,
  fetchingStatus,
  fetchedNodestatus,
  fetchNodes,
  fetchAllNodes,
  ...remainProps
}) {
  const [showAll, setShowAll] = React.useState(false);
  React.useEffect(() => {
    document.title = 'VNCSS | Quản lý Nodes';
  }, []);
  React.useEffect(() => {
    if (loginStatus) {
      if (!showAll) {
        fetchNodes();
      } else {
        fetchAllNodes();
      }
    }
  }, [showAll, loginStatus]);
  const changeViewMode = mode => {
    setShowAll(mode);
  };
  return (
    <>
      {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
      <Nodes
        redirect={redirect}
        loginStatus={loginStatus}
        fetchingStatus={fetchingStatus}
        fetchedNodestatus={fetchedNodestatus}
        fetchNodes={fetchNodes}
        fetchAllNodes={fetchAllNodes}
        changeViewMode={changeViewMode}
        {...remainProps}
      />
    </>
  );
}

export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    nodes: getNodes(state),
    fetchedNodestatus: state.nodes.fetched,
    total: state.nodes.total,
    proccessingStatus: state.nodes.processing,
    fetchingStatus: state.nodes.fetching,
    agencies: state.agencies.agencies,
    sellingStatus: state.nodes.selling,
    nodeTypes: nodeTypesSelector(state),
    roles: getRoles(state)
  }),
  dispatch => ({
    fetchNodes: compose(
      dispatch,
      fetchNodeSaga
    ),
    addNode: compose(
      dispatch,
      addNodeSaga
    ),
    editNode: compose(
      dispatch,
      editNodeSaga
    ),
    deleteNode: compose(
      dispatch,
      deleteNodeSaga
    ),
    processingNode: compose(
      dispatch,
      processingNode
    ),
    processedNode: compose(
      dispatch,
      processedNode
    ),
    sellingNode: compose(
      dispatch,
      sellingNode
    ),
    selledNode: compose(
      dispatch,
      selledNode
    ),
    sellNode: compose(
      dispatch,
      sellNodeSaga
    ),
    fetchAllNodes: compose(
      dispatch,
      fetchAllNodesSaga
    ),
    revokeNode: compose(
      dispatch,
      revokeNodeSaga
    )
  })
)(NodesPage);
