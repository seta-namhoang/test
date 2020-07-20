import { createMuiTheme } from '@material-ui/core/styles';

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableBodyRow: {
        root: {
          '&:nth-child(odd)': {
            backgroundColor: '#E7E8F0'
          }
        }
      },
      MUIDataTableHeadCell: {
        data: {
          fontWeight: 600,
          color: '#334D6E',
          opacity: '0.5'
        },
        sortAction: {
          fontWeight: 600,
          color: '#334D6E',
          opacity: '0.5'
        }
      },
      MUIDataTable: {
        paper: {
          boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)'
        }
      },
      MUIDataTableHeadRow: {
        root: {
          borderTop: '1px solid #ddd'
        }
      },
      MuiSvgIcon: {
        root: {
          // width: '0.85em',
          // height: '0.85em',
          color: '#9c9c9c'
        }
      },
      MUIDataTableFilterList: {
        root: {
          marginBottom: 10
        }
      },
      MUIDataTableFilter: {
        root: {
          minWidth: '300px'
        },
        gridListTile: {
          marginTop: 0
        }
      }
    }
  });
export default getMuiTheme;
