import { createSelector } from 'reselect';

const processingReport = state => state.agencies.processing;
const report = state => state.report.report;

export const getReport = createSelector(
  [report],
  report => report
);
