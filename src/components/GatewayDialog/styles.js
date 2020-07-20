import { makeStyles } from '@material-ui/core/styles';

export const styles = theme => ({
  root: {
    margin: 0,
    padding: '24px 24px 10px'
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
    marginRight: '15px',
    minWidth: 620
  },
  paperDialog: {
    top: '-15%'
  },
  statusFiel: {
    marginLeft: 0
  },
  content: {
    padding: '15px 24px !important'
  },
  tabs: {
    marginBottom: 15
  },
  label: {
    backgroundColor: '#fff'
  },
  titleDialog: {
    color: '#456083'
  }
});
const useStyles = makeStyles(styles);
export default useStyles;
