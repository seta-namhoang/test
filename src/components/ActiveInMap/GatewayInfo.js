import React from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import useStyles, { styles } from './styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const A01GatewayInfo = ({
  form,
  error,
  handleChange,
  handleChangePhone,
  onAddphone,
  onRemovePhone
}) => {
  const classes = useStyles();

  return (
    <div className={classes.formInfo}>
      <Box p="25px 10px">
        <Typography variant="subtitle2">
          Điền đẩy đủ các thông tin sau để kích hoạt gateway.
        </Typography>
      </Box>
      <Box maxWidth="650px">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Tên gateway*"
                variant="outlined"
                className={classes.textField}
                value={form.name}
                onChange={handleChange('name')}
                margin="normal"
                error={error.name !== ''}
                helperText={error.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="business"
                label="Loại hình kinh doanh"
                variant="outlined"
                className={classes.textField}
                value={form.business}
                onChange={handleChange('business')}
                margin="normal"
                error={error.business !== ''}
                helperText={error.business}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="address"
                label="Địa chỉ*"
                variant="outlined"
                className={classes.textField}
                value={form.address}
                onChange={handleChange('address')}
                margin="normal"
                error={error.address !== ''}
                helperText={error.address}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {form.agent_phone.map((item, index) => (
              <Grid item xs={12}>
                <Box display="flex">
                  <TextField
                    id="sim"
                    label={`Số điện thoại ${index + 1}${
                      index === 0 ? '*' : ''
                    }`}
                    variant="outlined"
                    className={classes.textField}
                    value={item}
                    onChange={event => handleChangePhone(event, index)}
                    margin="normal"
                    error={index === 0 && error.agent_phone !== ''}
                    helperText={index === 0 && error.agent_phone}
                  />
                  <Box display="flex">
                    {index === form.agent_phone.length - 1 && (
                      <Box>
                        <IconButton onClick={onAddphone}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    )}
                    {index !== form.agent_phone.length - 1 && (
                      <Box>
                        <IconButton onClick={() => onRemovePhone(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default A01GatewayInfo;
