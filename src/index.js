import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App/App';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { withDefaultTheme } from './hocs/withDefaultTheme';
import './styles/global.scss';
const AppWithDefaultTheme = withDefaultTheme(App);
ReactDOM.render(
  <Provider store={store}>
    <AppWithDefaultTheme />
  </Provider>,
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// registerServiceWorker();
