import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  dialog: {
    overflow: 'hiden'
  },
  tabs: {
    borderBottom: '1px solid #ddd'
  },
  contenTabWapper: {
    padding: 20
    // backgroundColor: '#f5f5f5'
    // height: 'calc(100vh - 112px)'
  }
}));
export default useStyles;
