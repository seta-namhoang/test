import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Agencies from '../../components/Agencies';
import {
  fetchAgenciesSaga,
  addAgencySaga,
  editAgencySaga,
  deleteAgencySaga,
  processedAgency,
  processingAgency,
  resetPassword
} from '../../state/modules/agencies';
import { processingStatus } from '../../state/modules/agencies/selector';
import BreadCrumbs from '../../components/BreadCrumbs';

const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  },
  {
    id: 2,
    name: 'Quản lý đại lý',
    href: '/agencies',
    route: 'route/ROUTE_AGENCIES'
  }
];

class AgenciesPage extends Component {
  componentDidMount() {
    const { fetchAgency, loginStatus, fetchingStatus } = this.props;
    document.title = 'VNCSS | Quản lý cửa hàng';
    if (loginStatus && !fetchingStatus) {
      fetchAgency();
    }
  }
  componentDidUpdate() {
    const {
      fetchAgency,
      loginStatus,
      fetchedAgencyStatus,
      fetchingStatus
    } = this.props;
    if (loginStatus && !fetchedAgencyStatus && !fetchingStatus) {
      fetchAgency();
    }
  }

  handleFetchUser = (limit, offset, orderData) => {
    const { fetchAgency, loginStatus } = this.props;
    if (loginStatus) {
      fetchAgency(limit, offset, orderData);
    }
  };

  render() {
    const { redirect, ...remainProps } = this.props;
    return (
      <React.Fragment>
        {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
        <Agencies {...remainProps} />
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    agencies: state.agencies.agencies,
    fetchedAgencyStatus: state.agencies.fetched,
    total: state.agencies.total,
    proccessingStatus: processingStatus(false)(state),
    fetchingStatus: state.agencies.fetching
  }),
  dispatch => ({
    fetchAgency: compose(
      dispatch,
      fetchAgenciesSaga
    ),
    addAgency: compose(
      dispatch,
      addAgencySaga
    ),
    editAgency: compose(
      dispatch,
      editAgencySaga
    ),
    deleteAgency: compose(
      dispatch,
      deleteAgencySaga
    ),
    proccessingAgency: compose(
      dispatch,
      processingAgency
    ),
    processedAgency: compose(
      dispatch,
      processedAgency
    ),
    resetAgencyPassword: compose(
      dispatch,
      resetPassword
    )
  })
)(AgenciesPage);
