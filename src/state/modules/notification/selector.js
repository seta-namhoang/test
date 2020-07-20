import { createSelector } from 'reselect';
import _ from 'lodash';

export const allNotification = state => state.notification.notification;
export const notificationQueue = state => state.notification.notificationQueue;
export const getNotification = createSelector(
  [allNotification],
  notification => {
    const { byId } = notification;
    const list = Object.values(byId) || [];
    return _.orderBy(list, ['timestamp', 'type'], ['desc', 'desc']);
  }
);
