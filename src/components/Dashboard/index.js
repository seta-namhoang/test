import React from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chart from '../Chart';
import Deposits from '../Deposits';
import DashboardAnalyze from '../DashboardAnalyze';
import TitleTable from '../TitleTable';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    flexGrow: 1,
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    marginBottom: 40,
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
    borderRadius: '4px'
  },
  head: {
    marginLeft: 25
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#3A454D',
    marginTop: 0
  },
  titleMap: {
    fontSize: 15,
    fontWeight: 500,
    color: '#3A454D',
    marginBottom: 15
  }
}));

export default function Dashboard({ report, currtentUser }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box className={classes.head}>
        <TitleTable>Thống kê</TitleTable>
        <Typography component="p" className={classes.subtitle}>
          Xin chào, {_.get(currtentUser, 'name', 'User')} !
        </Typography>
      </Box>
      <main className={classes.content}>
        <Box>
          <DashboardAnalyze report={report} />
        </Box>
        <Container maxWidth="xl" className={classes.container}>
          <Paper className={classes.paper}>
            <Typography component="p" className={classes.titleMap}>
              Tỷ lệ lắp đặt Gateways
            </Typography>
            {report && <Chart data={_.get(report, 'gateway')} />}
          </Paper>
          <Paper className={classes.paper}>
            <Typography component="p" className={classes.titleMap}>
              Tỷ lệ lắp đặt Nodes
            </Typography>
            {report && <Chart data={_.get(report, 'node')} />}
          </Paper>
        </Container>
      </main>
    </div>
  );
}
