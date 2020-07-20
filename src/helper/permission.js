import _ from 'lodash';
const isPermissionAccess = (allPermission, permissionRequired) => {
  // const rulesName = _.get(allPermission, [0, 'name']);
  const permissions = _.get(allPermission, [0, 'permission'], '').split(', ');
  return _.difference(permissionRequired, permissions).length === 0;
};
export { isPermissionAccess };
