import React from 'react';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import styles from './styles.module.scss';
import MyLocationIcon from '@material-ui/icons/MyLocation';

const Marker = props => {
  const {
    color,
    onMarkerClick,
    gateway = {},
    message = '',
    shortName = ''
  } = props;
  const [hovering, setHovering] = React.useState(false);
  const hanleMouseEnter = () => {
    setHovering(true);
  };
  const hanleMouseLeave = () => {
    setHovering(false);
  };
  return (
    <div>
      {hovering && (
        <div className={cx(styles['tooltip-my-location'])}>
          <React.Fragment>
            <Typography color="inherit">{message}</Typography>
          </React.Fragment>
        </div>
      )}
      <MyLocationIcon
        className={cx([styles['current-location']])}
        onMouseEnter={hanleMouseEnter}
        onMouseLeave={hanleMouseLeave}
      />
    </div>
  );
};

export default Marker;
