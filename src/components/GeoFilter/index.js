import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import _ from 'lodash';
import styles from './styles.module.scss';
import { fetchChildenAgenciesApi } from '../../api/agencyApi';

export default function SendProductDialog({
  open,
  anchorElPopperFilter,
  type,
  agencies = [],
  gatewayTypes = [],
  productIds,
  handleClose,
  handleFilter,
  accessToken
}) {
  const [agencyId, setAgencyId] = React.useState(-1);
  const [agencyChildenIds, setAgencyChildenIds] = React.useState(-1);
  const [gatewayTypeId, setGatewayTypeId] = React.useState(-1);
  const [error, setError] = React.useState({
    agencyId: '',
    gatewayTypeId: ''
  });

  const handleChange = async event => {
    const value = event.target.value;
    const res = await fetchChildenAgenciesApi(accessToken, value);
    setAgencyChildenIds(_.get(res, 'data', []));
    setError(error => ({
      ...error,
      agencyId: ''
    }));
    setAgencyId(value);
  };
  const handleChangeGatewayTypeId = e => {
    setError(error => ({
      ...error,
      gatewayTypeId: ''
    }));
    setGatewayTypeId(e.target.value);
  };
  const handleSubmit = () => {
    if (!agencyId) {
      setError(error => ({
        ...error,
        agencyId: 'chưa chọn đại lý'
      }));
      return;
    }
    if (!gatewayTypeId) {
      setError(error => ({
        ...error,
        gatewayTypeId: 'Chưa chọn loại Gateway'
      }));
      return;
    }
    handleFilter({
      agency_id: agencyId,
      product_type_id: gatewayTypeId,
      agency_childen_ids: agencyChildenIds
    });
  };

  const handleClearFilter = () => {
    setAgencyId(-1);
    setAgencyChildenIds(-1);
    handleClose();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorElPopperFilter}
      placement="top-start"
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <DialogTitle
              id="form-dialog-title"
              className={cx(styles['filter-title'])}
            >
              Bộ lọc
            </DialogTitle>
            <Box mx={2} className={cx(styles['container'])}>
              <FormControl
                variant="outlined"
                className={cx(styles['full-width-text'])}
                error={error.agencyId !== ''}
              >
                <InputLabel
                  htmlFor="agency"
                  className={cx(styles['label-popper-item'])}
                >
                  Đại lý:
                </InputLabel>
                <Select value={agencyId} onChange={handleChange}>
                  <MenuItem value={-1}>Tất cả</MenuItem>
                  {agencies.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error.agencyId}</FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                className={cx(styles['full-width-text'])}
                error={error.gatewayTypeId !== ''}
              >
                <InputLabel
                  htmlFor="agency"
                  className={cx(styles['label-popper-item'])}
                >
                  Loại gateway:
                </InputLabel>
                <Select
                  fullWidth
                  value={gatewayTypeId}
                  onChange={handleChangeGatewayTypeId}
                >
                  <MenuItem value={-1}>Tất cả</MenuItem>
                  {gatewayTypes.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error.gatewayTypeId}</FormHelperText>
              </FormControl>
            </Box>
            <DialogActions>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-around"
                mb={2}
                mx={2}
              >
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  color="primary"
                  className={cx(styles['btn-filter-popper'])}
                >
                  Lọc
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilter}
                  className={cx(styles['btn-filter-popper'])}
                  color="primary"
                >
                  Xóa bộ lọc
                </Button>
              </Box>
            </DialogActions>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}
