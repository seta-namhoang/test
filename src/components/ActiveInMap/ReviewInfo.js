import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import Box from '@material-ui/core/Box';
import useStyles, { styles } from './styles';
import Typography from '@material-ui/core/Typography';
import { guid } from '../../helper/util';

function ReviewInfo({ data }) {
  const classes = useStyles();

  return (
    <Box p="10px 30px">
      <Box pb={2}>
        <Typography variant="subtitle2">
          Kiểm tra lại thông tin trước khi kích hoạt:
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Imei: </span>
          <span>{data.gateway_serial || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Tên: </span>
          <span>{data.name || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Loại hình kinh doanh: </span>
          <span>{data.business || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Địa chỉ: </span>
          <span>{data.business || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Vĩ độ: </span>
          <span>{data.lat || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Kinh độ: </span>
          <span>{data.lng || '--'}</span>
        </Typography>
        <Typography variant="subtitle1" className={classes.textInfo}>
          <span>Số điện thoại:</span>
          <span>
            {data.agent_phone.map((phone, index) => (
              <span key={guid()}>
                {`${phone}${index !== data.agent_phone.length - 1 ? ',' : ''}`}{' '}
              </span>
            ))}
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
export default ReviewInfo;
