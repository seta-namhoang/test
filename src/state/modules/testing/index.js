import { createReducer } from '../../reducers/helper';

export const TESTING = 'something';
export const TESTING_SAGA = 'somthing saga';

const defaultState = {
  mookdata: {
    something: 'something'
  }
};
const testReducer = createReducer(defaultState, {
  [TESTING]: (state, action) => ({
    state,
    loading: true
  })
});

export const loginSaga = payload => ({
  type: TESTING,
  payload
});

export default testReducer;
