import React, { Component } from 'react';
import cx from 'classnames';
import styles from './styles.module.scss';
import logo from '../../asset/logo_only_s.svg';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
export default function Footer() {
  return (
    <div className={cx(styles['footer'])}>
      {/* <div className={cx(styles['logo-footer'])}>
        <img className={cx(styles['img-logo'])} src={logo} alt="SafeSpace" />
        <span className={cx(styles['safe'])}>AFE</span>
        <span className={cx(styles['space'])}>SPACE</span>{' '}
        <span className={cx(styles['title-footer'])}>
          {' '}
          TRUNG TÂM GIÁM SÁT AN NINH
          {' | '}
        </span>
        <div className={cx(styles['hotline'])}>
          <PhoneIcon className={cx(styles['icon-footer'])} />{' '}
          <span className={cx(styles['phone'])}>0934 88 83 86</span>{' '}
          <EmailIcon className={cx(styles['icon-footer'])} />{' '}
          <span className={cx(styles['email'])}>safespace.vn@gmail.com</span>{' '}
        </div>
      </div> */}

      {window.location.host === 'c09.vncss.net' ? (
        <p>
          Sản phẩm được phân phối bởi công ty Sesaco Việt Nam. Hotline: 0702 113
          113
        </p>
      ) : (
        <p>Copyright © 2019 Vntech24h JSC. All Rights Reserved</p>
      )}
    </div>
  );
}
