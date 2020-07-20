/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import Link from 'redux-first-router-link';
import { compose } from 'redux';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import { renderTextField } from '../../redux-form';
import { signupApi } from '../../api/userApi';
import { loginSaga } from '../../state/modules/auth/index';

import styles from './styles.module.scss';
import vncssLogo from '../../asset/vncss-logo.png';
import c09Logo from '../../asset/c09-logo.png';

const selector = formValueSelector('loginForm');
const required = value =>
  value ? undefined : 'Trường này không được để trống';
class Login extends Component {
  get disableStatus() {
    const { user } = this.props;
    return isEmpty(user.username) || isEmpty(user.password);
  }
  handleLogin = event => {
    event.preventDefault();
    const { user } = this.props;
    if (!this.disableStatus) {
      this.props.loginSaga(user);
    }
    return;
  };
  handleSignup = () => {
    const { user } = this.props;
    signupApi(user);
  };

  render() {
    return (
      <div className={cx(styles['container'])}>
        <div className={cx(styles['bodylogin'])}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <div className={cx(styles['form-container'])}>
                <div className={cx(styles['form'])}>
                  <div className={cx(styles['form-header'])}>
                    <img
                      src={
                        window.location.host === 'c09.vncss.net'
                          ? c09Logo
                          : vncssLogo
                      }
                      className={cx(styles['logo-login'])}
                      alt="SafeSpace"
                    />
                    <Typography variant="h4" gutterBottom>
                      Đăng nhập
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                      Đăng nhập để sử dụng các tính năng quản lý
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      của hệ thống VNCSS.
                    </Typography>
                  </div>
                  <form onSubmit={this.handleLogin}>
                    <div className={cx(styles['field'])}>
                      <Field
                        name="username"
                        label="Tên đăng nhập"
                        type="text"
                        component={renderTextField}
                        validate={[required]}
                      />
                    </div>
                    <div className={cx(styles['field'])}>
                      <Field
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        component={renderTextField}
                        validate={[required]}
                      />
                    </div>
                    <div
                      className={cx(styles['forget-password'], styles['field'])}
                    >
                      <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </div>
                    <div className={cx(styles['btnBottom'])}>
                      <Button
                        color="primary"
                        variant="contained"
                        className={cx(styles['btnLogin'])}
                        type="submit"
                        disabled={this.disableStatus}
                      >
                        Login
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
              <div className={cx(styles['footer-login'])}>
                {window.location.host === 'c09.vncss.net' ? (
                  <span>
                    Sản phẩm được phân phối bởi công ty Sesaco Việt Nam.
                    Hotline: 0702 113 113.
                  </span>
                ) : (
                  <span>
                    Copyright © 2019 Vntech24h JSC. All Rights Reserved.
                  </span>
                )}
                {/* <span>
                  Sản phẩm được phân phối bởi công ty Sesaco Việt Nam. Hotline:
                  0702 113 113.
                </span> */}
                {/* <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a> */}
              </div>
            </Grid>
            <Grid item xs={6}>
              <Box className={cx(styles['rightBox'])}>
                <Box className={cx(styles['decription'])}>
                  <Typography variant="h2" gutterBottom>
                    VNCSS - Hệ thống an ninh tập trung
                  </Typography>
                  <Typography variant="h2" gutterBottom>
                    Việt Nam
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Login = connect(
  state => ({
    user: selector(state, 'username', 'password')
  }),
  dispath => ({
    loginSaga: compose(
      dispath,
      loginSaga
    )
  })
)(Login);

export default reduxForm({
  form: 'loginForm'
})(Login);
