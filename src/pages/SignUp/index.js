import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Link from 'redux-first-router-link';
import { Button } from '@material-ui/core';
import './styles.module.scss';

import { loginApi, signupApi } from '../../api/userApi';
import { connect } from 'react-redux';
import { renderTextField } from '../../redux-form';
import { routeLogin } from '../../state/modules/routing/actions';

const selector = formValueSelector('signupForm');

class Signup extends Component {
  handleSubmit = event => {};

  handleLogin = () => {
    const { user } = this.props;
    loginApi(user);
  };

  handleSignup = () => {
    const { user } = this.props;
    signupApi(user);
  };

  render() {
    return (
      <div className="container">
        <div className="bodylogin">
          <div className="form-container">
            <div className="form">
              <span className="login-form-title">SIGN UP</span>
              <div className="field">
                <Field
                  name="username"
                  label="Username"
                  type="text"
                  component={renderTextField}
                />
              </div>
              <div className="field">
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  component={renderTextField}
                />
              </div>
              <div className="field">
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  component={renderTextField}
                />
              </div>
              <div className="btnBottom">
                <Button
                  color="secondary"
                  variant="contained"
                  className="btnLogin"
                  onClick={this.handleSignup}
                >
                  Sign Up Now
                </Button>
              </div>
              <div>
                You are a member? <Link to={routeLogin()}>Login Page</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Signup = connect(state => ({
  user: selector(state, 'username', 'password', 'email')
}))(Signup);

export default reduxForm({
  form: 'signupForm'
})(Signup);
