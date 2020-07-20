import { createSelector } from 'reselect';

const processingAgency = state => state.agencies.processing;
const fromUserWidget = state => state.agencies.fromUserWidget;
const agencies = state => state.agencies.agencies;

export const processingStatus = fromUserWidgetParams =>
  createSelector(
    [processingAgency, fromUserWidget],
    (processingAgency, fromUserWidget) => {
      return fromUserWidgetParams === fromUserWidget && processingAgency;
    }
  );
export const getAgencies = createSelector(
  [agencies],
  agencies => agencies
);
