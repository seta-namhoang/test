import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isPermissionAccess } from '../helper/permission';
import { shape } from 'prop-types';

class PermissionComponent extends Component {
  render() {
    const {
      as: Component,
      child: ChildComponent,
      childProps,
      allPermission = [],
      permissionRequired = [],
      ...remainProps
    } = this.props;
    const access = isPermissionAccess(allPermission, permissionRequired);
    if (!access) {
      return null;
    }
    if (ChildComponent) {
      return (
        <Component {...remainProps}>
          <ChildComponent {...childProps} />
        </Component>
      );
    }
    return <Component {...remainProps} />;
  }
}

PermissionComponent.defaultProps = {
  as: shape(Object).isRequired
};

export default connect(
  state => ({
    allPermission: state.auth.roles
  }),
  null
)(PermissionComponent);
