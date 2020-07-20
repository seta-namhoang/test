import React from 'react';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';

import styles from './styles.module.scss';

export default function SSCard({
  title = 'Title',
  data,
  renderField = [],
  handleAction
}) {
  return (
    <Card className={cx(styles['textField'])}>
      <CardHeader
        action={
          <IconButton onClick={handleAction} aria-label="settings">
            <EditIcon />
          </IconButton>
        }
        title={title}
      />
      <CardContent>
        {renderField.map((field, index) => (
          <Grid key={`${field.field}-${index}`} spacing={3} container>
            <Grid item xs={4}>
              <Typography variant="body2" color="textSecondary" component="p">
                {field.fieldName}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{data[field.field] || '-'}</Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
}
