import React from 'react';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import styles from './styles.module.scss';

const MarkerFake = props => {
  const {
    color,
    onMarkerClick,
    gateway = {},
    message = '',
    shortName = ''
  } = props;
  const [hovering, setHovering] = React.useState(false);
  const markerClick = () => {
    onMarkerClick(gateway);
  };
  const hanleMouseEnter = () => {
    setHovering(true);
  };
  const hanleMouseLeave = () => {
    setHovering(false);
  };
  return (
    <>
      <div
        className={cx([styles['pin'], styles['bounce']])}
        style={{ backgroundColor: color, cursor: 'pointer' }}
        onClick={markerClick}
        onMouseEnter={hanleMouseEnter}
        onMouseLeave={hanleMouseLeave}
      >
        <div className={cx(styles['short-name-icon'])}>{shortName}</div>
      </div>
      {hovering && (
        <div className={cx(styles['tooltip-my-location'])}>
          <React.Fragment>
            <Typography color="inherit">{message}</Typography>
          </React.Fragment>
        </div>
      )}
      <div className={cx([styles['pulse']])} />
    </>
  );
};

export default MarkerFake;
