import React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import NotificationIcon from '@material-ui/icons/NotificationsNone';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { string, func } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.module.scss';

import NotificationList, {
  notificationListPropTypes
} from './NotificationList';
export const notifierPropTypes = {
  tooltipTitle: string,
  headerText: string,
  onOpen: func,
  onClose: func,
  headerBackgroundColor: string,
  bodyBackgroundColor: string,
  notifications: notificationListPropTypes
};

export default class Notifier extends React.Component {
  static propTypes = notifierPropTypes;

  static defaultProps = {
    tooltipTitle: 'Thông báo',
    headerText: 'Thông báo'
  };

  state = {
    anchorEl: null
  };

  showNotifications = event => {
    this.setState({
      anchorEl: event.currentTarget
    });

    this.props.onOpen && this.props.onOpen();
  };

  hideNotification = event => {
    this.setState({ anchorEl: null });
    this.props.onClose && this.props.onClose();
  };

  onClickNotificationWrapper = notification => {
    if (notification.type === 'warning') {
      this.hideNotification();
    }
    this.props.onClickNotification(notification);
  };

  render() {
    const { anchorEl } = this.state;

    const {
      tooltipTitle,
      headerText,
      headerBackgroundColor,
      bodyBackgroundColor,
      notifications,
      unreadedNotification,
      readAll
    } = this.props;
    const displayEntries = notifications.concat([]);
    const numNotifications = unreadedNotification;

    //TODO: remove "numNotifications > 0 ?" condition when material-ui is updated to a later version
    return (
      <div className={classNames(styles.notification)}>
        <Tooltip title={tooltipTitle || ''}>
          <span className={styles.toolTipWrapper}>
            <IconButton
              onClick={this.showNotifications}
              // disabled={numNotifications === 0}
              data-vncss-element="notification-button"
              edge="end"
            >
              {numNotifications > 0 && !anchorEl ? (
                <Badge
                  color="primary"
                  badgeContent={numNotifications}
                  classes={{ badge: styles.badge }}
                >
                  <NotificationIcon
                    color="primary"
                    className={classNames(styles.iconNoti)}
                  />
                </Badge>
              ) : (
                <NotificationIcon
                  color="primary"
                  className={classNames(styles.iconNoti)}
                />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Popover
          disableRestoreFocus
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          onClose={this.hideNotification}
          className={classNames(styles.popover)}
        >
          <div className={classNames(styles.notificationWindow)}>
            <div
              className={classNames(styles.header)}
              style={{ backgroundColor: headerBackgroundColor }}
            >
              <div className={classNames(styles.headerLeft)}>
                <div className={classNames(styles.label)}>{headerText}</div>
                <div className={classNames(styles.chip)}>
                  {numNotifications}
                </div>
              </div>
              <div className={classNames(styles.headerRight)}>
                <div onClick={readAll} className={classNames(styles.read)}>
                  Đánh dấu tất cả là đã đọc
                </div>
              </div>
              {/* <IconButton
                className={classNames(styles.controls)}
                onClick={this.hideNotification}
              >
                <KeyboardArrowUpIcon color="secondary" />
              </IconButton> */}
            </div>
            {/* <div className={classNames(styles.newText)}>MỚI</div> */}

            <div
              className={classNames(styles.body)}
              style={{ backgroundColor: bodyBackgroundColor }}
            >
              <NotificationList
                notifications={displayEntries}
                onClickNotification={this.onClickNotificationWrapper}
              />
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
