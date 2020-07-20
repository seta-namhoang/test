import React, { Fragment } from 'react';
import { get } from 'lodash';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { string, func, shape, arrayOf, element } from 'prop-types';
import styles from './styles.module.scss';
import avatarEx from '../../asset/avatar-ex.png';

export default class InnerProfileMenu extends React.Component {
  static propTypes = {
    onLogout: func.isRequired,
    onEditProfile: func.isRequired,
    user: shape({
      userName: string,
      kvp: shape({
        firstName: string,
        lastName: string,
        image: string
      }),
      signedImageUrl: string
    }),
    additionMenuItems: arrayOf(element),
    currentRoute: string
  };

  render() {
    const userExists = !!Object.keys(this.props.user).length;
    if (!userExists) {
      return <div className={styles.userNullState}>No user found</div>;
    }

    console.log(this.props);

    const userProfileImage =
      this.props.user.signedImageUrl ||
      get(this.props.user, 'kvp.image') ||
      avatarEx;
    return (
      <Fragment>
        <ListSubheader className={styles['header']} key="header">
          <div className={styles['user-avatar']}>
            <Avatar src={userProfileImage} />
          </div>
          <div className={styles['user-profile']}>
            <div className={styles['full-name']}>
              {get(this.props.user, 'kvp.firstName')}&nbsp;
              {get(this.props.user, 'kvp.lastName')}
            </div>
            <div className={styles['username']}>
              {get(this.props.user, 'userName')}
            </div>
            <div className={styles['editButton']}>
              {this.props.currentRoute !== 'route/ROUTE_PROFILE' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.props.onEditProfile}
                  className={styles['editProfileButton']}
                >
                  Thông tin tài khoản
                </Button>
              )}
            </div>
          </div>
        </ListSubheader>

        {this.props.additionMenuItems}
        <Divider />
        <MenuItem
          onClick={this.props.onLogout}
          key="logout"
          className="logoutButton"
        >
          <ListItemIcon>
            <PowerIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Fragment>
    );
  }
}
