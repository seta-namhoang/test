import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { compose } from 'redux';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import UserDialog from '../../components/UserDialog';
import AgencyDialog from '../../components/AgencyDialog';
import ResetPassworDialog from '../../components/ResetPassword';
import SSCard from './Card';
import Upload from '../../containers/FileUpload';

import { hideDetails } from '../../state/modules/auth';
import {
  editUserSaga,
  processingUser,
  processedUser,
  changePasswordSaga
} from '../../state/modules/users';
import { processingStatus as processingUserStatus } from '../../state/modules/users/selector';
import {
  editAgencySaga,
  processedAgency,
  processingAgency
} from '../../state/modules/agencies';
import { processingStatus as processingAgencyStatus } from '../../state/modules/agencies/selector';
import useStyles from './styles';

function Profile({
  hideDetails,
  proccessingUser,
  proccessingAgency,
  processedUser,
  processedAgency,
  changePassword,
  showDetails,
  user,
  agency,
  processingUserStatus,
  editUser,
  processingAgencyStatus,
  editAgency
}) {
  const [openReset, setOpenReset] = React.useState(false);
  const [details, setFormDetails] = React.useState({
    open: false,
    fullName: '',
    email: '',
    password: '',
    rePassword: ''
  });
  const classes = useStyles();

  const [upload, setUpload] = React.useState(false);

  const handleClose = () => {
    setFormDetails({
      open: false,
      fullName: '',
      email: '',
      password: '',
      rePassword: ''
    });
    hideDetails();
  };

  const onEditCurrentUser = () => {
    proccessingUser(true);
  };

  const handleCloseUserEdit = () => {
    processedUser(true);
  };

  const onEditAgency = () => {
    proccessingAgency(true);
  };

  const handleCloseAgencyEdit = () => {
    processedAgency(true);
  };

  const onEditPassword = () => {
    setOpenReset(true);
  };

  const handleCloseReset = () => {
    setOpenReset(false);
  };

  const onSubmitReset = data => {
    changePassword({
      user: {
        current_password: data.oldPassword,
        new_password: data.password
      }
    });
    handleCloseReset();
  };
  const handleCloseUpload = () => {
    setUpload(false);
  };
  const handleUploadComplete = data => {
    console.log(data);
    handleCloseUpload();
  };
  const openUpload = data => {
    // setUpload(true);
  };
  const agencyRenderField = [
    {
      id: 11,
      fieldName: 'Tên cửa hàng',
      field: 'name'
    },
    {
      id: 12,
      fieldName: 'Địa chỉ',
      field: 'address'
    },
    {
      id: 13,
      fieldName: 'Level',
      field: 'level'
    }
  ];
  const userRenderField = [
    {
      id: 21,
      fieldName: 'Tên đăng nhập',
      field: 'username'
    },
    {
      id: 22,
      fieldName: 'Tên người sử dụng',
      field: 'name'
    },
    {
      id: 23,
      fieldName: 'Email',
      field: 'email'
    },
    {
      id: 24,
      fieldName: 'Số điện thoại',
      field: 'phone'
    }
  ];
  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.avatarContainer}>
          <Avatar
            alt="Remy Sharp"
            // src="/static/images/avatar/1.jpg"
            className={classes.large}
          >
            AV
          </Avatar>
          <div onClick={openUpload} className={classes.avatarText}>
            Thay đổi ảnh đại diện
          </div>
        </div>
        <div className={classes.cardContainer}>
          <SSCard
            renderField={userRenderField}
            data={user}
            title="Thông tin người dùng"
            titleActions="Chỉnh sửa thông tin người dùng"
            handleAction={onEditCurrentUser}
          />
        </div>
        {!_.isEmpty(agency) && (
          <div className={classes.cardContainer}>
            <SSCard
              renderField={agencyRenderField}
              data={agency}
              title="Thông tin cửa hàng"
              titleActions="Chỉnh sửa thông tin cửa hàng"
              handleAction={onEditAgency}
            />
          </div>
        )}
        <div className={classes.passContainer}>
          {/* <SSCard
            renderField={passwordRenderField}
            data={user}
            title="Mật khẩu"
            titleActions="Đổi mật khẩu"
            handleAction={onEditPassword} 
          /> */}
          <div className={classes.header}>
            <div className={classes.title}>Mật khẩu</div>
          </div>
          <div className={classes.content}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div
                  onClick={onEditPassword}
                  className={clsx(classes.textInput, classes.textPoiter)}
                  variant="outlined"
                >
                  Thay đổi mật khẩu tài khoản
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <UserDialog
        open={processingUserStatus}
        user={user}
        edit
        fromUserWidget
        handleClose={handleCloseUserEdit}
        createUser={_.noop}
        editUser={editUser}
        type="Edit"
      />
      <AgencyDialog
        open={processingAgencyStatus}
        agency={agency}
        fromUserWidget
        edit
        handleClose={handleCloseAgencyEdit}
        createAgency={_.noop}
        editAgency={editAgency}
        type="Edit"
      />
      <ResetPassworDialog
        open={openReset}
        handleClose={handleCloseReset}
        onSubmit={onSubmitReset}
      />
      <Upload
        onClose={handleCloseUpload}
        open={upload}
        reFetchData={() => {}}
        type="avatar"
        url="/files/upload"
        fileTypeSupport="image/*"
        enableShowResult={false}
        handleUploadComplete={handleUploadComplete}
      />
    </React.Fragment>
  );
}

export default connect(
  state => ({
    user: state.auth.user,
    agency: state.auth.agency,
    processingUserStatus: processingUserStatus(true)(state),
    processingAgencyStatus: processingAgencyStatus(true)(state)
  }),
  dispatch => ({
    hideDetails: compose(
      dispatch,
      hideDetails
    ),
    editUser: compose(
      dispatch,
      editUserSaga
    ),
    proccessingUser: compose(
      dispatch,
      processingUser
    ),
    processedUser: compose(
      dispatch,
      processedUser
    ),
    editAgency: compose(
      dispatch,
      editAgencySaga
    ),
    proccessingAgency: compose(
      dispatch,
      processingAgency
    ),
    processedAgency: compose(
      dispatch,
      processedAgency
    ),
    changePassword: compose(
      dispatch,
      changePasswordSaga
    )
  })
)(Profile);
