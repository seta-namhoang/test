import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import propTypes from 'prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import styles from './styles.module.scss';
import cx from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  link: {
    display: 'flex'
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  }
}));

export default function SimpleBreadcrumbs({ breadcrumbsList, redirect }) {
  const classes = useStyles();
  const handleClick = item => event => {
    event.preventDefault();
    redirect(item.route);
  };
  return (
    <div className={classes.root}>
      <Paper elevation={4} className={cx(styles['paper'])}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbsList.map((item, index) => (
            <Link
              key={index}
              color="inherit"
              href={item.href}
              onClick={handleClick(item)}
              className={classes.link}
            >
              {index === 0 ? <HomeIcon className={classes.icon} /> : ''}
              {item.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Paper>
    </div>
  );
}

SimpleBreadcrumbs.propTypes = {
  breadcrumbsList: propTypes.arrayOf(Object)
};
