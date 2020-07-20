import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  iconButton: {
    padding: 0,
    marginLeft: 'auto'
  },
  dialogContent: {
    padding: 15
  },
  title: {
    display: 'flex'
  },
  alertImage: {
    display: 'flex',
    justifyContent: 'center'
  },
  contentText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#03294A',
    textAlign: 'center',
    padding: '0 10px'
  },
  contentTime: {
    color: '#BDBDBD',
    textAlign: 'center',
    fontSize: 12
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    margin: 5
  }
}));

export default useStyles;
