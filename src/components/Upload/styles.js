import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: 200
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content'
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120
  },
  formControlLabel: {
    marginTop: theme.spacing(1)
  },
  fileUploaderSubtext: {
    textAlign: 'center',
    textTransform: 'none',
    marginBottom: '0 !important',
    fontSize: 30,
    '&.subtextBlue': {
      marginLeft: 5,
      color: 'rgb(33, 150, 243)'
    }
  },
  iconUpload: {
    color: 'rgb(33, 150, 243)',
    fontSize: '40px !important'
  },
  highlight: {
    border: '1px solid #E6E9ED',
    boxSizing: 'border-box',
    borderRadius: 4,
    marginBottom: 10
  },
  processContainer: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  processingText: {
    marginLeft: 20
  },
  resultContainer: {
    textAlign: 'left',
    display: 'block'
  },
  fileIcon: {
    color: '#1C87C4'
  },
  uploadText: {
    fontStyle: 'normal',
    fontSize: 24,
    /* identical to box height, or 100% */
    letterSpacing: '0.01em',
    color: '#1C87C4',
    textTransform: 'initial'
  }
}));
export default useStyles;
