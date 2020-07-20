import React from 'react';
import cx from 'classnames';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import useStyles from '../styles';
import { Divider } from '@material-ui/core';

export default function Card({
  title = 'Title',
  titleActions = 'Action',
  data,
  renderField = [],
  handleAction
}) {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <div className={classes.title}>{title}</div>
        <div onClick={handleAction} className={classes.action}>
          {titleActions}
        </div>
      </div>
      <div className={classes.content}>
        <Grid container spacing={3}>
          {renderField.map((field, index) => (
            <Grid item xs={6} key={field.id}>
              <div className={classes.fieldName}>{field.fieldName}:</div>
              <div className={classes.textInput}>
                {data[field.field] || '-'}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
      <Divider />
    </div>
  );
}
