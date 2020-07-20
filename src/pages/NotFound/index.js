/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'redux-first-router-link';
import cx from 'classnames';

import images from '../../resources/image';
import './styles.modules.scss';
import { ROUTE_HOME } from '../../state/modules/routing';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className={cx('container')}>
        <img src={images.error_loading} className={cx('bigImage')} />
        <Typography variant="headline" className={cx('headline')}>
          Không tìm thấy trang
        </Typography>
        <Typography variant="subheading" color="textSecondary">
          {'Trang bạn truy cập hiện đã được di chuyển, xoá hoặc không tồn tại.'}
        </Typography>
        <Link to={{ type: ROUTE_HOME }}>
          <Button
            className={cx('actionButton')}
            variant="contained"
            color="primary"
          >
            Trang chủ
          </Button>
        </Link>
      </div>
    );
  }
}
