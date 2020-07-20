import { createSelector } from 'reselect';

export const seeAll = state => state.nodes.seeAll;
const nodes = state => state.nodes.nodes;
const allNodes = state => state.nodes.allNodes;

export const getNodes = createSelector(
  [seeAll, nodes, allNodes],
  (seeAll, nodes, allNodes) => {
    return seeAll ? allNodes : nodes;
  }
);
export const totals = createSelector(
  [seeAll, nodes, allNodes],
  (seeAll, nodes = [], allNodes = []) => {
    return seeAll ? allNodes.length : nodes.length;
  }
);
