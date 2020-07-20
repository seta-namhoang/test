const requiredValidate = value =>
  value ? '' : 'Trường này không được bỏ trống';

const emailValidate = value => {
  if (!value || !value.length) {
    return 'Trường này không được bỏ trống';
  }
  return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Sai định dạng email'
    : '';
};

const lengthValidate = length => value => {
  return value && value.length > length
    ? ''
    : `Trường này cần từ ${length} ký tự trở lên`;
};

const lengthValidate4 = lengthValidate(4);

const passwordValidate = value =>
  !value || value.length < 8 ? 'Mật khẩu phải từ 8 ký tự trở lên' : '';
const rePasswordValidate = (password, rePassword) =>
  password !== rePassword ? 'Xác nhận mật khẩu không đúng' : '';
export {
  requiredValidate,
  emailValidate,
  passwordValidate,
  rePasswordValidate,
  lengthValidate4
};
