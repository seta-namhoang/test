import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Camera from '@material-ui/icons/CameraAlt';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '100%'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    height: '40vh',
    backgroundColor: 'gray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <Camera
              style={{
                width: 100,
                height: 100
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <Camera
              style={{
                width: 100,
                height: 100
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <Camera
              style={{
                width: 100,
                height: 100
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            <Camera
              style={{
                width: 100,
                height: 100
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
