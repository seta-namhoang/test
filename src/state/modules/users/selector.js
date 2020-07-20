import { createSelector } from 'reselect';

const processingUser = state => state.users.processing;
const fromUserWidget = state => state.users.fromUserWidget;

export const processingStatus = fromUserWidgetParams =>
  createSelector(
    [processingUser, fromUserWidget],
    (processingUser, fromUserWidget) => {
      return fromUserWidgetParams === fromUserWidget && processingUser;
    }
  );

const appUsers = state => state.user.appUsers;
export const appUserSelector = createSelector(
  [appUsers],
  appUsers => appUsers
);
