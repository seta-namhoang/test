import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 2
  },
  divider: {
    height: 28,
    margin: 4
  },
  iconSearch: {
    color: '#A53B3D'
  },
  '@media (min-width: 1200px)': {
    inputBox: {
      width: 300
    }
  }
}));
export default useStyles;
