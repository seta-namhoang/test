import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import get from 'lodash/get';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import PermissionWrapper from '../../hocs/Permission';

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px'
  },
  inverseIcon: {
    transform: 'rotate(90deg)'
  }
};

const getProductStatus = (data, index) => {
  const { dataIndex } = index[0];
  const currentRow = data.filter(item => item.dataIndex === dataIndex);
  return get(currentRow, [0, 'data', 5, 'props', 'children'], '');
};

const getProductType = (data, index) => {
  const { dataIndex } = index[0];
  const currentRow = data.filter(item => item.dataIndex === dataIndex);
  return get(currentRow, [0, 'data', 0], '');
};

class CustomToolbarSelect extends React.Component {
  render() {
    const {
      classes,
      toolbarAtions = [],
      selectedRows,
      displayData = []
    } = this.props;
    const { data } = selectedRows;
    return (
      <div className={classes.iconContainer}>
        {toolbarAtions.map((action, index) => {
          const IconAction = action.icon;
          if (
            (data.length > 1 ||
              getProductStatus(displayData, data) === 'Kích hoạt') &&
            action.name === 'edit'
          ) {
            return null;
          }
          if (data.length > 1 && action.name === 'changePassword') {
            return null;
          }
          if (
            (data.length > 1 ||
              getProductStatus(displayData, data) !== 'Kích hoạt') &&
            action.name === 'extend'
          ) {
            return null;
          }
          if (
            action.name === 'active' &&
            (data.length > 1 ||
              !['SGW-A01', 'SGW-PM1', 'SGW-GM2'].includes(
                getProductType(displayData, data)
              ) ||
              getProductStatus(displayData, data) === 'Kích hoạt')
          ) {
            return null;
          }
          return (
            <PermissionWrapper
              key={index}
              permissionRequired={action.permissionRequired}
            >
              <Tooltip title={action.tooltipTitle}>
                <IconButton
                  className={classes.iconButton}
                  onClick={action.action}
                >
                  <IconAction className={classes.icon} />
                </IconButton>
              </Tooltip>
            </PermissionWrapper>
          );
        })}
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, {
  name: 'CustomToolbarSelect'
})(CustomToolbarSelect);
