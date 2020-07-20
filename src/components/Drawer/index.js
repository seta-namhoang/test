import React, { useState } from 'react';
import clsx from 'clsx';
import cx from 'classnames';
import _ from 'lodash';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import agencyIcon from '../../asset/icons/agency-icon.svg';
import controlIcon from '../../asset/icons/control-icon.svg';
import dashboardIcon from '../../asset/icons/dashboard-icon.svg';
import productIcon from '../../asset/icons/product-icon.svg';
import userIcon from '../../asset/icons/user-icon.svg';
import userMobiIcon from '../../asset/icons/user-mobi-icon.svg';
import nodeIcon from '../../asset/icons/node-icon.svg';
import gatewayIcon from '../../asset/icons/gateway-icon.svg';
import vncssLogos from '../../asset/logo-vncss-s.svg';
import vncssLogo from '../../asset/vncss-logo.png';
import c09Logo from '../../asset/c09-logo.png';

import Collapse from '@material-ui/core/Collapse';

import { getPermissionArr } from '../../rootRouter';

import styles from './styles.module.scss';

import {
  ROUTE_HOME,
  ROUTE_USERS,
  ROUTE_AGENCIES,
  ROUTE_GATEWAYS,
  ROUTE_NODES,
  ROUTE_CONTROL,
  ROUTE_APP_USER
} from '../../state/modules/routing/index';

import { routesMap } from '../../state/modules/routing/index';
import {
  ROUTE_HOME_ID,
  ROUTE_USERS_ID,
  ROUTE_AGENCIES_ID,
  ROUTE_GATEWAYS_ID,
  ROUTE_NODES_ID,
  ROUTE_CONTROL_ID,
  ROUTE_APP_USER_ID,
  ROUTE_PRODUCT_ID
} from '../../state/modules/routing/constant';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 10px',
    ...theme.mixins.toolbar,
    backgroundColor: '#ffffff',
    color: 'white',
    boxShadow: 'none',
    '&::after': {
      boxSizing: 'content-box'
    },
    minHeight: '100px !important'

    // [theme.breakpoints.down('lg')]: {
    //   minHeight: 56
    // }
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  drawerPaper: {
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    borderRight: 'none !important',
    zIndex: 1202,
    boxShadow: '6px 0px 18px rgba(0, 0, 0, 0.06)'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7)
    }
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  listSidebar: {
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    height: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 10
  },
  darkblue: {
    color: '#8F0A0C',
    minWidth: 40
  },
  listTextPrimary: {
    color: '#8F0A0C'
  },
  sidbarPrimary: {
    color: '#8F0A0C'
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  logoHeader: {
    display: 'table',
    maxWidth: 80
  },
  safe: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 600
  },
  space: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontSize: 18,
    color: '#08477C',
    fontWeight: 600
  },
  logo: {
    width: '100%'
  }
}));

const imageIcon = image => {
  return (
    <Icon style={{ width: '0.85em', height: '0.85em' }}>
      <img
        style={{ width: '100%', position: 'relative', top: '-4px' }}
        src={image}
        alt=""
      />
    </Icon>
  );
};

const listFeature = [
  {
    id: ROUTE_HOME_ID,
    title: 'Thống kê',
    icon: imageIcon(dashboardIcon),
    permission: [],
    route: ROUTE_HOME
  },
  {
    id: ROUTE_AGENCIES_ID,
    title: 'Đại lý',
    icon: imageIcon(agencyIcon),
    permission: ['agency'],
    route: ROUTE_AGENCIES
  },
  {
    id: ROUTE_USERS_ID,
    title: 'Nhân viên',
    icon: imageIcon(userIcon),
    permission: ['user'],
    route: ROUTE_USERS
  },
  {
    id: ROUTE_PRODUCT_ID,
    title: 'Sản phẩm',
    icon: imageIcon(productIcon),
    permission: ['product'],
    subItems: [
      {
        id: ROUTE_GATEWAYS_ID,
        title: 'Kho Gateways',
        icon: imageIcon(gatewayIcon),
        permission: ['product'],
        route: ROUTE_GATEWAYS
      },
      {
        id: ROUTE_NODES_ID,
        title: 'Kho Nodes',
        icon: imageIcon(nodeIcon),
        permission: ['node_manage'],
        route: ROUTE_NODES
      }
    ],
    route: ROUTE_USERS
  },
  // {
  //   id: ROUTE_GATEWAYS_ID,
  //   title: 'Kho Gateways',
  //   icon: Gateway,
  //   permission: ['product'],
  //   route: ROUTE_GATEWAYS
  // },
  // {
  //   id: ROUTE_NODES_ID,
  //   title: 'Kho Nodes',
  //   icon: Device,
  //   permission: ['product'],
  //   route: ROUTE_NODES
  // },
  {
    id: ROUTE_CONTROL_ID,
    title: 'Giám sát',
    icon: imageIcon(controlIcon),
    permission: [],
    route: ROUTE_CONTROL
  },
  {
    id: ROUTE_APP_USER_ID,
    title: 'Người dùng',
    icon: imageIcon(userMobiIcon),
    permission: ['user_app'],
    route: ROUTE_APP_USER
  }
];

export default function CustomDrawer({
  open,
  handleDrawerClose,
  redirect,
  roles,
  currentRoute
}) {
  const classes = useStyles();
  const permission = getPermissionArr(_.get(roles, [0, 'permission']));
  const currentRouteId = routesMap[currentRoute].id;
  const [expanded, setExpanded] = useState([]);
  const [hovering, setHovering] = useState(false);
  const onClickDrawerItem = item => () => {
    if (item.subItems && item.subItems.length) {
      !_.includes(expanded, item.id)
        ? setExpanded([...expanded, item.id])
        : setExpanded(expanded.filter(itemId => itemId !== item.id));
    } else {
      const route = item.route;
      redirect(route);
    }
  };
  const expandedIcon = item => {
    if (!item.subItems) {
      return null;
    }
    return _.includes(expanded, item.id) ? (
      <ExpandLess className={classes.darkblue} />
    ) : (
      <ExpandMore className={classes.darkblue} />
    );
  };
  React.useEffect(() => {
    listFeature.forEach(feature => {
      const subItemIds = _.get(feature, 'subItems', []).map(
        subitem => subitem.id
      );
      if (_.includes(subItemIds, currentRouteId)) {
        setExpanded(_.uniq([...expanded, feature.id]));
      }
    });
  }, [open, hovering]);
  const handleMouseEnterChild = () => {
    setHovering(true);
  };
  const handleMouseLeaveChild = () => {
    setHovering(false);
  };
  const highlighting = item => {
    const subItemIds = _.get(item, 'subItems', []).map(subitem => subitem.id);
    if (!open && !hovering && _.includes(subItemIds, currentRouteId)) {
      return true;
    }
    return item.id === currentRouteId;
  };
  return (
    <div className={classes.root}>
      <Drawer
        onMouseEnter={handleMouseEnterChild}
        onMouseLeave={handleMouseLeaveChild}
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !(open || hovering) && classes.drawerPaperClose
          )
        }}
        open={open || hovering}
      >
        <div className={classes.toolbarIcon}>
          {/* <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Danh mục
          </Typography> */}
          <div className={classes.logoHeader}>
            {open || hovering ? (
              <img
                src={
                  window.location.host === 'c09.vncss.net' ? c09Logo : vncssLogo
                }
                alt="VNCSS"
                className={classes.logo}
              />
            ) : (
              <img
                src={
                  window.location.host === 'c09.vncss.net'
                    ? c09Logo
                    : vncssLogos
                }
                alt="VNCSS"
                className={classes.logo}
              />
            )}

            {/* <span className={classes.safe}>AFE</span>
            <span className={classes.space}>SPACE</span> */}
          </div>
        </div>
        <div className={classes.listSidebar}>
          <List component="div" disablePadding>
            {listFeature.map(item => {
              const Icon = item.icon;
              const access =
                _.difference(item.permission, permission).length === 0;
              if (!access) {
                return null;
              }
              return (
                <List key={item.id} component="div" disablePadding>
                  <ListItem
                    className={
                      highlighting(item) ? cx(styles['highlight']) : null
                    }
                    button
                    onClick={onClickDrawerItem(item)}
                  >
                    <ListItemIcon className={classes.darkblue}>
                      {Icon}
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.sidbarPrimary }}
                      primary={item.title}
                    />
                    {expandedIcon(item)}
                  </ListItem>
                  <Collapse
                    in={_.includes(expanded, item.id) && (open || hovering)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems &&
                        item.subItems.map(subItem => {
                          const SubIcon = subItem.icon;
                          const accessSubMenu =
                            _.difference(subItem.permission, permission)
                              .length === 0;
                          if (!accessSubMenu) {
                            return null;
                          }
                          return (
                            <ListItem
                              key={subItem.id}
                              style={{
                                paddingLeft: 30
                              }}
                              className={
                                subItem.id === currentRouteId
                                  ? cx(styles['highlight'])
                                  : null
                              }
                              button
                              onClick={onClickDrawerItem(subItem)}
                            >
                              <ListItemIcon className={classes.darkblue}>
                                {SubIcon}
                              </ListItemIcon>
                              <ListItemText
                                classes={{ primary: classes.sidbarPrimary }}
                                primary={subItem.title}
                              />
                              {expandedIcon(subItem)}
                            </ListItem>
                          );
                        })}
                    </List>
                  </Collapse>
                </List>
              );
            })}
          </List>
        </div>
      </Drawer>
    </div>
  );
}
