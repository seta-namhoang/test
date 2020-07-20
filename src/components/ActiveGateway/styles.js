import { makeStyles } from '@material-ui/core/styles';
export const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    marginTop: '0',
    width: '100%'
  },
  container: {
    padding: '0',
    marginRight: '15px'
  },
  paperDialog: {
    top: '-15%'
  },
  statusFiel: {
    marginLeft: 0
  }
});

const useStyles = makeStyles(styles);
export default useStyles;
