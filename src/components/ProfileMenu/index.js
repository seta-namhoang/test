import React from 'react';
import { get } from 'lodash';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { string, func, shape, arrayOf, element } from 'prop-types';

import InnerProfileMenu from './InnerProfileMenu';
import avatarEx from '../../asset/avatar-ex.png';
import styles from './styles.module.scss';
import cx from 'classnames';

export default class ProfileMenu extends React.Component {
  static propTypes = {
    onLogout: func.isRequired,
    onEditProfile: func,
    user: shape({
      userName: string,
      kvp: shape({
        firstName: string,
        lastName: string,
        image: string
      })
    }),
    tooltipTitle: string,
    additionMenuItems: arrayOf(element)
  };

  static defaultProps = {
    user: {},
    tooltipTitle: 'Profile'
  };

  state = {
    open: false,
    anchorEl: null
  };

  openMenu = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({
      open: false
    });
  };

  handleLogout = () => {
    this.props.onLogout();
  };

  onEditProfile = () => {
    this.closeMenu();
    this.props.onEditProfile();
  };

  render() {
    const userProfileImage =
      this.props.user.signedImageUrl ||
      get(this.props.user, 'kvp.image') ||
      avatarEx;

    return (
      <div>
        <Tooltip title={this.props.tooltipTitle || ''} disableFocusListener>
          <IconButton
            onClick={this.openMenu}
            data-vncss-element="profile-menu-button"
          >
            <Avatar
              className={cx(styles['avatarHeader'])}
              src={userProfileImage}
              style={{ height: 30, width: 30 }}
            />
          </IconButton>
        </Tooltip>
        <Menu
          open={this.state.open}
          onClose={this.closeMenu}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorEl={this.state.anchorEl}
          // https://github.com/callemall/material-ui/issues/7961#issuecomment-326215406
          getContentAnchorEl={null}
          className={styles.popover}
        >
          <InnerProfileMenu
            currentRoute={this.props.currentRoute}
            user={this.props.user}
            onLogout={this.handleLogout}
            onEditProfile={this.onEditProfile}
            additionMenuItems={this.props.additionMenuItems}
          />
        </Menu>
      </div>
    );
  }
}
