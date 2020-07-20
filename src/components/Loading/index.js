import React, { Component } from 'react';
import { bool } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import cx from 'classnames';

import styles from './styles.module.scss';

class LoadingScreen extends Component {
  static propTypes = {
    showing: bool.isRequired
  };
  render() {
    const { showing } = this.props;
    if (!showing) {
      return null;
    }
    return (
      <div className={cx(styles['loading-container'])}>
        <CircularProgress size={60} thickness={3} />
      </div>
    );
  }
}

export default LoadingScreen;
