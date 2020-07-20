import { createSelector } from 'reselect';

const authLoadingSelector = state => state.auth.loading;

export const loadingSelector = createSelector(
  [authLoadingSelector],
  status => {
    return status;
  }
);
