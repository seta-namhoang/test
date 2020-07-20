import React from 'react';
import _ from 'lodash';
import Box from '@material-ui/core/Box';

import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import styles from './styles.module.scss';
import NodeCard from '../NodeCard';
import NodeDialog from './NodeDialog';
import ActiveNode from './ActiveNode';
import { guid } from '../../helper/util';

function Details({
  user,
  gateway = {},
  nodeTypes,
  gatewayTypes,
  handleActivePVNNode,
  handleDeactivePVNNode,
  handlePingNode
}) {
  const sensorData = _.get(gateway, 'nodes', []);
  const [openNodeDetails, setOpenNodeDetails] = React.useState(false);
  const [openActiveNode, setOpenActiveNode] = React.useState(false);
  const [currentNode, setCurrentNode] = React.useState({});
  const getComponentType = typeId => {
    const nodeType = nodeTypes.filter(item => item.id === typeId)[0];
    const code = _.get(nodeType, 'code', '');
    return code.split('-').length > 1 ? code.split('-')[1] : '-';
  };

  const gatewayType = _.get(
    gatewayTypes.find(type => {
      return type.id === gateway.product_type_id;
    }),
    'code',
    ''
  );

  const handleClickCard = node => {
    setCurrentNode(node);
    setOpenNodeDetails(true);
  };

  const handleClose = () => {
    setOpenNodeDetails(false);
    setCurrentNode({});
  };

  const handleCloseActiveNode = () => {
    setOpenActiveNode(false);
  };

  const onAddNode = () => {
    setOpenActiveNode(true);
  };

  const handleActiveNode = data => {
    handleActivePVNNode(gateway.agency_id, gateway.id, {
      ...data,
      user_id: user.id
    });
  };

  const handleDeactiveClick = data => {
    handleDeactivePVNNode(gateway.agency_id, gateway.id, {
      ...data,
      user_id: user.id
    });
  };

  const handlePingNodeClick = nodeId => {
    handlePingNode({
      agencyId: gateway.agency_id,
      gatewayId: gateway.id,
      nodeId
    });
  };

  return (
    <Box>
      {gatewayType === 'SGW-PM1' && (
        <div className={cx(styles['header-detail'])}>
          <Button
            onClick={onAddNode}
            color="primary"
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Thêm cảm biến
          </Button>
        </div>
      )}

      {sensorData.length === 0 ? (
        <div className={cx(styles['overview-container'])}>
          Không có thông tin Node
        </div>
      ) : (
        <div className={cx(styles['overview-details'])}>
          <Grid
            container
            spacing={1}
            className={cx(styles['list-items-wapper'])}
          >
            {sensorData.map(item => {
              const typeId = _.get(item, 'product_type_id', 1);
              const ComponentType = getComponentType(typeId);
              const Card = NodeCard[ComponentType]
                ? NodeCard[ComponentType]
                : NodeCard.DefaultCard;
              return (
                <Grid
                  key={guid()}
                  item
                  xs={4}
                  lg={3}
                  className={cx(styles['item-wapper'])}
                >
                  <Card
                    onClickCard={handleClickCard}
                    nodeTypes={nodeTypes}
                    key={item.id}
                    data={item}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
      <NodeDialog
        open={openNodeDetails}
        handleClose={handleClose}
        nodeData={currentNode}
        handleDeactiveClick={handleDeactiveClick}
        allowDeactive={gatewayType === 'SGW-PM1'}
        handlePingNodeClick={handlePingNodeClick}
      />
      <ActiveNode
        open={openActiveNode}
        handleClose={handleCloseActiveNode}
        handleActive={handleActiveNode}
      />
    </Box>
  );
}

export default Details;
