import React from 'react';
import get from 'lodash/get';
import { createMuiTheme } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { timestampToDate } from '../../helper/util';

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableHeadRow: {
        root: {
          borderTop: 'none'
        }
      }
    }
  });

const GatewayLogs = ({ gateway, getGatewayLogs }) => {
  React.useEffect(() => {
    if (gateway.id) {
      getGatewayLogs(gateway.id, gateway.imei, gateway.agency_id);
    }
  }, [gateway]);
  const logs = get(gateway, 'logs', []);
  return (
    <Box>
      {logs.map(log => (
        <Box display="flex">
          <Box alignItems="center">
            <Typography variant="subtitle1">
              {timestampToDate(log.timestamp) || '--'}
            </Typography>
          </Box>
          <Box ml={2} alignItems="center">
            <Typography variant="subtitle1">
              {get(log, 'username', '')}
              {get(log, 'username', '') && ' đã '}
            </Typography>
          </Box>
          <Box alignItems="center" mx={1}>
            <Typography
              variant="subtitle1"
              style={{
                textTransform: `${get(log, 'username', '') ? 'lowercase' : ''}`
              }}
            >
              {log.action}.
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GatewayLogs;
