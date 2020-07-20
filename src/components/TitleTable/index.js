import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    color: '#03294A',
    fontSize: '18px',
    fontWeight: 600,
    textTransform: 'uppercase',
    margin: '20px 0'
  }
}));

export default function TitleTable(props) {
  const classes = useStyles();

  return (
    <Typography
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom
      className={classes.root}
    >
      {props.children}
    </Typography>
  );
}

TitleTable.propTypes = {
  children: PropTypes.node
};
