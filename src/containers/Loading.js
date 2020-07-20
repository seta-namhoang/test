import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import { loadingSelector } from '../state/selector/loadingSelector';

class LoadingScreen extends Component {
  // eslint-disable-line
  static propTypes = {};
  render() {
    const { showing } = this.props;
    return <Loading showing={showing} />;
  }
}

export default connect(
  state => ({
    showing: loadingSelector(state)
  }),
  null
)(LoadingScreen);
