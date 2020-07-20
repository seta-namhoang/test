import React from 'react';
import { get, noop } from 'lodash';
import cx from 'classnames';
import GoogleMapReact from 'google-map-react';
import mapStyles from '../Geo/MapStyles.json';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import useStyles from './styles';
import ZoomOutIcon from '../../asset/icons/zoom-out.svg';
import ZoomInIcon from '../../asset/icons/zoom-in.svg';
import MyLocation from '../Geo/MyLocation';
import MakerSelected from './MakerSelected';

export const centerDefault = {
  lat: 21.027627,
  lng: 105.833166
};
const SelectPosition = ({ selectedPosition, handleSelectedPosition }) => {
  const classes = useStyles();

  const googleMapRef = React.createRef();
  const [center, setCenter] = React.useState(centerDefault);
  const [loadedGeoService, setLoadedGeoService] = React.useState(false);
  const [openPopupPosition, setOpenPopupPosition] = React.useState(false);
  const [anchorElPopupPosition, setAnchorElPopupPosition] = React.useState(
    false
  );
  const [loadedMapApi, setLoadedMapApi] = React.useState(false);

  const mapOption = maps => {
    return {
      styles: mapStyles,
      disableDefaultUI: true,
      backgroundColor: 'none',
      draggableCursor: 'default'
      // zoomControlOptions: {
      //   position: maps.ControlPosition.RIGHT_CENTER,
      //   style: maps.ZoomControlStyle.SMALL
      // },
      // mapTypeControlOptions: {
      //   position: maps.ControlPosition.TOP_RIGHT
      // },
      // mapTypeControl: true
      // fullscreenControl: true
      // zoomControl: true
    };
  };

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoadedGeoService(true);
      });
    } else {
      console.log('khong tim thay vi tri hien tai');
    }
  }, []);

  const onMapClick = e => {
    setAnchorElPopupPosition(e.event.target);
    setOpenPopupPosition(true);
    handleSelectedPosition({
      lat: e.lat.toFixed(6),
      lng: e.lng.toFixed(6)
    });
  };

  const handleClosePopupPosition = maps => {
    setOpenPopupPosition(false);
  };

  const onGoogleApiLoaded = maps => {
    setLoadedMapApi(true);
  };

  const onZoomIn = () => {
    googleMapRef.current.map_.setZoom(googleMapRef.current.map_.getZoom() + 1);
  };

  const onZoomOut = () => {
    googleMapRef.current.map_.setZoom(googleMapRef.current.map_.getZoom() - 1);
  };

  return (
    <Box className={classes.map}>
      <IconButton
        className={cx(classes.btnZoomIn, classes.btnMap)}
        aria-label="zoom in"
        onClick={onZoomIn}
      >
        <img src={ZoomInIcon} alt="" />
      </IconButton>
      <IconButton
        className={cx(classes.btnZoomOut, classes.btnMap)}
        aria-label="zoom out"
        onClick={onZoomOut}
      >
        <img src={ZoomOutIcon} alt="" />
      </IconButton>

      {selectedPosition && (
        <Box className={cx(classes.paperSelected)}>
          <Typography color="inherit" className={classes.itemHoverTooltip}>
            <span>Vĩ độ (lat):</span>
            <span>{get(selectedPosition, 'lat', '--')}</span>
          </Typography>
          <Typography color="inherit" className={classes.itemHoverTooltip}>
            <span>Kinh độ (lng):</span>
            <span>{get(selectedPosition, 'lng', '--')}</span>
          </Typography>
        </Box>
      )}

      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyAjYtN-RdATm6AnXhnOqLnx1L4CjzqLi4A'
        }}
        defaultZoom={13}
        options={mapOption}
        center={center}
        ref={googleMapRef}
        onGoogleApiLoaded={onGoogleApiLoaded}
        onClick={onMapClick}
      >
        {loadedGeoService && (
          <MyLocation
            lat={center.lat}
            lng={center.lng}
            text="My Marker"
            color="#DC3545"
            name="my marker 1"
            message="Vị trí của bạn"
            shortName="LC"
            id={13}
            onMarkerClick={noop}
          />
        )}
        {selectedPosition && (
          <MakerSelected
            lat={selectedPosition.lat}
            lng={selectedPosition.lng}
            position={selectedPosition}
            open={openPopupPosition}
            handleClose={handleClosePopupPosition}
            anchorEl={anchorElPopupPosition}
          />
        )}
      </GoogleMapReact>
    </Box>
  );
};

export default SelectPosition;
