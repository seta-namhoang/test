/* eslint-disable no-script-url */

import React from 'react';
import Link from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Title from '../Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Lần nhập gần đây</Title>
      <Typography component="p" variant="h4">
        1.600(bộ)
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        15 tháng 9 năm 2019
      </Typography>
      <div>
        <Link color="primary" href="javascript:;">
          Xem chi tiết
        </Link>
      </div>
    </React.Fragment>
  );
}
