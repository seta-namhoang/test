import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  card: {
    paddingBottom: 20,
    width: '100%'
  },
  passContainer: {
    width: '55%',
    minWidth: 700
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    color: '#3A454D'
  },
  action: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
    color: '#A53B3D',
    paddingLeft: 120,
    cursor: 'pointer',
    userSelect: 'none'
  },
  content: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
    minWidth: 700
  },
  textField: {
    color: '#03294A'
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  container: {
    display: 'block',
    padding: '40px 60px'
  },
  cardContainer: {
    display: 'flex',
    width: '55%',
    minWidth: 700
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 20
  },
  avatarText: {
    padding: 20,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '0.05em',
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
    color: '#A53B3D',
    cursor: 'pointer',
    userSelect: 'none'
  },
  large: {
    height: 160,
    width: 160
  },
  textInput: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    padding: '10.5px 16px',
    width: '100%',
    textAlign: 'left',
    borderRadius: '5px',
    color: '#03294A'
  },
  fieldName: {
    paddingBottom: 10
  },
  textPoiter: {
    cursor: 'pointer'
  }
}));
export default useStyles;
