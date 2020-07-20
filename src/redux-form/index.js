import React from 'react';
import { TextField } from '@material-ui/core';
import cx from 'classnames';
import styles from './styles.module.scss';

// export const renderTextField = ({ input, label, type }) => {
//   return (
//     <div>
//       <TextField
//         style={{
//           width: '100%'
//         }}
//         label={label}
//         type={type}
//         {...input}
//       />
//     </div>
//   );
// };

export const renderTextField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => {
  return (
    <div>
      <div>
        <TextField
          style={{
            width: '100%'
          }}
          label={label}
          type={type}
          {...input}
          error={!!(touched && error)}
          warning={touched && warning ? 'waring' : ''}
        />
        {touched &&
          ((error && <p className={cx(styles['error'])}>{error}</p>) ||
            (warning && <p className={cx(styles['warning'])}>{warning}</p>))}
      </div>
    </div>
  );
};
