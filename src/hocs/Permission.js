import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { isPermissionAccess } from '../helper/permission';

class PermissionComponent extends Component {
  render() {
    const { allPermission = [], permissionRequired = [] } = this.props;
    const access = isPermissionAccess(allPermission, permissionRequired);
    if (!access) {
      return null;
    }
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default connect(
  state => ({
    allPermission: state.auth.roles
  }),
  null
)(PermissionComponent);
