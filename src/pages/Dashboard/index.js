import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Dashboard from '../../components/Dashboard';
import DashboardAnalyze from '../../components/DashboardAnalyze';
import BreadCrumbs from '../../components/BreadCrumbs';
import { fetchReportSaga } from '../../state/modules/report';
const breadcrumbsList = [
  {
    id: 1,
    name: 'Trang chủ',
    href: '/',
    route: 'route/ROUTE_HOME'
  }
];
class Home extends Component {
  componentDidMount() {
    const { fetchReport, loginStatus, fetchingStatus } = this.props;
    if (loginStatus && !fetchingStatus) {
      fetchReport();
    }
  }

  componentDidUpdate() {
    const {
      fetchReport,
      loginStatus,
      fetchedReportStatus,
      fetchingStatus
    } = this.props;
    if (loginStatus && !fetchedReportStatus && !fetchingStatus) {
      fetchReport();
    }
  }

  render() {
    const { redirect, ...remainProps } = this.props;
    return (
      <React.Fragment>
        {/* <BreadCrumbs redirect={redirect} breadcrumbsList={breadcrumbsList} /> */}
        {/* <DashboardAnalyze /> */}
        <Dashboard {...remainProps} />
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    report: state.report.report,
    fetchedReportStatus: state.report.fetched,
    fetchingStatus: state.report.fetching,
    currtentUser: state.auth.user
  }),
  dispatch => ({
    fetchReport: compose(
      dispatch,
      fetchReportSaga
    )
  })
)(Home);
