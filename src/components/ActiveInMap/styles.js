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

  paperDialog: {
    top: '-15%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  map: {
    flex: 1,
    position: 'relative'
  },
  btnZoomIn: {
    bottom: 50,
    right: 10,
    zIndex: 1
  },
  btnZoomOut: {
    bottom: 10,
    right: 10,
    color: '#666666'
  },
  btnMap: {
    position: 'absolute',
    borderRadius: 5,
    padding: 5,
    zIndex: 1,
    backgroundColor: '#ffffff',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    '& img': {
      padding: 2,
      width: 24
    },

    '&:hover': {
      backgroundColor: '#ffffff'
    }
  },
  paperSelected: {
    padding: '5px',
    zIndex: '1',
    position: 'absolute',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
    left: '10px',
    bottom: '10px'
  },
  formInfo: {
    padding: '0 40px'
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    marginTop: '0',
    width: '100%'
  },
  textInfo: {
    padding: '5px',
    margin: 0,
    display: 'flex',
    '&>span:first-child': {
      minWidth: '200px'
    },
    '&>span:last-child': {
      color: ' #08477C',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 500
    }
  },
  itemHoverTooltip: {
    display: 'flex',
    justifyContent: 'space-between',
    // border-bottom: 1px solid rgba(221, 221, 221, 0.3),
    marginBottom: '5px',
    fontSize: '14px',
    '& span:first-child': {
      minWidth: '120px'
    },
    '& span:last-child': {
      color: '#08477c',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }
});

const useStyles = makeStyles(styles);
export default useStyles;
