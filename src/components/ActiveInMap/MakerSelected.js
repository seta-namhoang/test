import React from 'react';
import cx from 'classnames';
import styles from '../Geo/styles.module.scss';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  },
  makerSelected: {
    '&:after': {
      background: '#FFFFFF !important',
      width: '10px !important',
      height: '10px !important',
      margin: '11px 0 0 11px !important'
    }
  }
}));

const Marker = ({ position, anchorEl, open, handleClose }) => {
  const classes = useStyles();
  return (
    <>
      <div
        className={cx([styles['pin'], styles['bounce'], classes.makerSelected])}
        style={{ backgroundColor: '#4485F4', cursor: 'pointer' }}
      />
      <div className={cx(styles['pulse'])} />
    </>
  );
};

export default Marker;
