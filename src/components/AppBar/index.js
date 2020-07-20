import React from 'react';
import clsx from 'clsx';
import { noob } from 'lodash';
import PropsTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';

import ProfileMenu from '../ProfileMenu';
import Notifier from '../Notifier';
import VNLang from '../../asset/icons/vietnam.svg';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    paddingLeft: 18,
    [theme.breakpoints.down('lg')]: {
      minHeight: 56
    },
    boxShadow:
      '2px 0 10px 0 rgba(0, 0, 0, 0.16), 0 2px 5px 0 rgba(0, 0, 0, 0.12) !important'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    color: 'white',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    paddingRight: '0 !important'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 20,
    color: '#8F0A0C'
  },
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
    color: '#8F0A0C',
    fontSize: 18,
    fontWeight: 600
  },
  logoHeader: {
    marginRight: 5
  },
  safe: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontSize: 18,
    color: '#FF0000'
  },
  space: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontSize: 18,
    color: '#08477C'
  },
  avatarHeader: {
    // border: '1px solid #fff'
  },
  langIcon: {}
}));

export default function AppBarComponent({
  open,
  handleDrawerOpen,
  handleDrawerClose,
  user,
  profileMenu = true,
  enableNotify = false,
  notifications,
  readedNotification,
  unreadedNotification,
  onLogout = noob,
  onEditProfile = noob,
  onOpen = noob,
  onClose = noob,
  onClickNotification = noob,
  readAll = noob,
  currentRoute
}) {
  const classes = useStyles();
  const notificationsProps = {
    onOpen,
    onClose,
    notifications,
    readedNotification,
    unreadedNotification,
    onClickNotification,
    readAll
  };
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <div
            component="h1"
            variant="h6"
            color="inherit"
            className={classes.title}
          >
            <span>Hệ thống an ninh tập trung việt nam VNCSS</span>
          </div>
          {enableNotify && <Notifier {...notificationsProps} />}
          <div>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open drawer"
              className={classes.langIcon}
            >
              <Avatar
                className={classes.avatarHeader}
                src={VNLang}
                style={{ height: 30, width: 30 }}
              />
            </IconButton>
          </div>
          {profileMenu && (
            <div>
              <ProfileMenu
                onLogout={onLogout}
                onEditProfile={onEditProfile}
                currentRoute={currentRoute}
                user={{
                  userName: user.email,
                  kvp: {
                    firstName: user.name,
                    lastName: user.lastName || '',
                    image: user.avatar || ''
                  }
                }}
              />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
AppBarComponent.propTypes = {
  open: PropsTypes.bool,
  handleDrawerOpen: PropsTypes.func
};
