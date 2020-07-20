import React from 'react';
import GoogleMapReact from 'google-map-react';
import cx from 'classnames';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Gateway from '../../asset/icons/product-icon.svg';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';

import SearchLocation from '../SearchLocation';
import Marker from './Marker';
import MyLocation from './MyLocation';
import styles from './styles.module.scss';
import mapStyles from './MapStyles.json';
import CurrentLocalIcon from '../../asset/icons/current-local.svg';
import FilterIcon from '../../asset/icons/filter-map.svg';
import FullscreenIcon from '../../asset/icons/ic-fullscreen.svg';
import ZoomOutIcon from '../../asset/icons/zoom-out.svg';
import ZoomInIcon from '../../asset/icons/zoom-in.svg';
import Satellite from '../../asset/satellite.png';
import Roadmap from '../../asset/roadmap.png';

export const centerDefault = {
  lat: 21.027627,
  lng: 105.833166
};

export default function GeoMap({
  data,
  roles,
  onClickMarker,
  onShowFilter,
  productTypes,
  defaultGateway,
  gwListLength
}) {
  const googleMapRef = React.createRef();
  const [center, setCenter] = React.useState(centerDefault);
  const [loadedGeoService, setLoadedGeoService] = React.useState(false);
  const [loadedMapApi, setLoadedMapApi] = React.useState(false);
  const [imageBtnMapType, setImageBtnMapType] = React.useState(Satellite);

  const mapOption = maps => {
    return {
      styles: mapStyles,
      disableDefaultUI: true,
      backgroundColor: 'none'
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
    }
  }, []);

  React.useEffect(() => {
    if (loadedMapApi && loadedGeoService) {
      if (!_.isNil(defaultGateway) && !_.isEmpty(defaultGateway)) {
        const state = _.get(defaultGateway, 'gateway_config', {});
        if (!_.isNil(state.lat) && !_.isNil(state.lng)) {
          const geoLoc = {
            lat: parseFloat(state.lat),
            lng: parseFloat(state.lng)
          };
          googleMapRef.current.map_.setCenter(geoLoc);
          googleMapRef.current.map_.panTo(geoLoc);
          googleMapRef.current.map_.setZoom(16);
        }
      } else {
        // googleMapRef.current.map_.setCenter(center);
        // googleMapRef.current.map_.panTo(center);
      }
    }
  }, [loadedGeoService, loadedMapApi, defaultGateway]);

  const onGetLocationClick = () => {
    if (!loadedGeoService) {
      return;
    }
    googleMapRef.current.map_.setCenter(center);
    googleMapRef.current.map_.panTo(center);
  };

  const onGoogleApiLoaded = maps => {
    setLoadedMapApi(true);
  };
  const loadingStyles = !loadedGeoService ? styles['animate-flicker'] : null;
  // const dis = data.filter(item => {
  //   return _.get(item, 'gateway_config.power') === 0;
  // });
  const onSearch = data => {
    if (!loadedGeoService) {
      return;
    }
    const gateway_config = _.get(data, 'gateway_config') || {};
    const geoLoc = {
      lat: parseFloat(gateway_config.lat),
      lng: parseFloat(gateway_config.lng)
    };
    googleMapRef.current.map_.setCenter(geoLoc);
    googleMapRef.current.map_.panTo(geoLoc);
    googleMapRef.current.map_.setZoom(19);
  };

  const resetLocation = () => {
    onGetLocationClick();
    googleMapRef.current.map_.setZoom(13);
  };

  const getColor = id => {
    switch (id) {
      case 1:
        return '#00A550';
      case 2:
        return '#DC3545';
      case 3:
        return 'orange';
      case 4:
        return '#989898';
      default:
        return '#00A550';
    }
  };
  const onFullScreenClick = () => {
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    }
  };

  const onZoomIn = () => {
    googleMapRef.current.map_.setZoom(googleMapRef.current.map_.getZoom() + 1);
  };

  const onZoomOut = () => {
    googleMapRef.current.map_.setZoom(googleMapRef.current.map_.getZoom() - 1);
  };

  const onChangeMapType = () => {
    if (googleMapRef.current.map_.getMapTypeId() === 'roadmap') {
      setImageBtnMapType(Roadmap);
      googleMapRef.current.map_.setMapTypeId('satellite');
    } else {
      setImageBtnMapType(Satellite);
      googleMapRef.current.map_.setMapTypeId('roadmap');
    }
  };

  const role = _.get(roles, [0]);

  return (
    <>
      <div className={cx(styles['container'])}>
        <div className={cx(styles['search-box-gateway'])}>
          <SearchLocation
            data={data}
            onSearch={onSearch}
            resetLocation={resetLocation}
          />
        </div>
        <Card className={cx(styles['details'])} elevation={0}>
          <div
            style={{
              display: 'flex',
              height: 48,
              minWidth: 670
            }}
            component="nav"
            aria-label="main mailbox folders"
          >
            <ListItem className={cx(styles['item-details'])}>
              <ListItemIcon className={cx(styles['list-item-icon'])}>
                <Icon
                  style={{ width: '0.85em', height: '0.85em' }}
                  className={cx(styles['icon-item-header'])}
                >
                  <img
                    style={{
                      width: '100%',
                      position: 'relative',
                      top: '-4px'
                    }}
                    src={Gateway}
                    alt=""
                  />
                </Icon>
              </ListItemIcon>
              <ListItemText>
                <span className={cx(styles['text-in-details'])}>
                  Tổng:{' '}
                  {role.name === 'admin'
                    ? gwListLength.total + 1000
                    : gwListLength.total}{' '}
                  thiết bị
                </span>
              </ListItemText>
            </ListItem>
            <ListItem className={cx(styles['item-details'])}>
              <ListItemIcon className={cx(styles['list-item-icon'])}>
                <div
                  className={cx(styles['pin-in-details'])}
                  style={{ backgroundColor: '#00A550', cursor: 'pointer' }}
                />
              </ListItemIcon>
              <ListItemText>
                <span className={cx(styles['text-in-details'])}>
                  Hoạt động (
                  {role.name === 'admin'
                    ? gwListLength.active + 1000
                    : gwListLength.active}
                  )
                </span>
              </ListItemText>
            </ListItem>
            <ListItem className={cx(styles['item-details'])}>
              <ListItemIcon className={cx(styles['list-item-icon'])}>
                <div
                  className={cx(styles['pin-in-details'])}
                  style={{ backgroundColor: 'red', cursor: 'pointer' }}
                />
              </ListItemIcon>
              <ListItemText>
                <span className={cx(styles['text-in-details'])}>
                  Cảnh báo ({gwListLength.alert})
                </span>
              </ListItemText>
            </ListItem>
            <ListItem className={cx(styles['item-details'])}>
              <ListItemIcon className={cx(styles['list-item-icon'])}>
                <div
                  className={cx(styles['pin-in-details'])}
                  style={{ backgroundColor: 'orange', cursor: 'pointer' }}
                />
              </ListItemIcon>
              <ListItemText>
                <span className={cx(styles['text-in-details'])}>
                  Lỗi cảm biến ({gwListLength.sensorError})
                </span>
              </ListItemText>
            </ListItem>
            <ListItem className={cx(styles['item-details'])}>
              <ListItemIcon className={cx(styles['list-item-icon'])}>
                <div
                  className={cx(styles['pin-in-details'])}
                  style={{ backgroundColor: '#989898', cursor: 'pointer' }}
                />
              </ListItemIcon>
              <ListItemText>
                <span className={cx(styles['text-in-details'])}>
                  Mất kết nối ({gwListLength.disconnect})
                </span>
              </ListItemText>
            </ListItem>
          </div>
        </Card>
        <IconButton
          className={cx([styles['btn-fullscreen'], styles['btn-map']])}
          aria-label="local"
          onClick={onFullScreenClick}
        >
          <img src={FullscreenIcon} alt="" />
        </IconButton>
        <IconButton
          className={cx([
            styles['btn-get-location'],
            styles['btn-map'],
            loadingStyles
          ])}
          aria-label="local"
          onClick={onGetLocationClick}
        >
          <img src={CurrentLocalIcon} alt="" />
        </IconButton>
        <IconButton
          className={cx(styles['btn-filter'], styles['btn-map'])}
          aria-label="filter"
          onClick={event => onShowFilter(event)}
        >
          <img src={FilterIcon} alt="" />
        </IconButton>
        <IconButton
          className={cx([styles['btn-zoom-in'], styles['btn-map']])}
          aria-label="zoom in"
          onClick={onZoomIn}
        >
          <img src={ZoomInIcon} alt="" />
        </IconButton>
        <Paper className={cx(styles['btn-map-type'])} onClick={onChangeMapType}>
          <img src={imageBtnMapType} alt="" />
        </Paper>

        <IconButton
          className={cx(styles['btn-zoom-out'], styles['btn-map'])}
          aria-label="zoom out"
          onClick={onZoomOut}
        >
          <img src={ZoomOutIcon} alt="" />
        </IconButton>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyAjYtN-RdATm6AnXhnOqLnx1L4CjzqLi4A'
          }}
          defaultZoom={13}
          options={mapOption}
          center={center}
          ref={googleMapRef}
          onGoogleApiLoaded={onGoogleApiLoaded}
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
              onMarkerClick={_.noop}
            />
          )}
          {data.map(item => {
            let color = getColor(item.gatewayStatusId);
            // const gatewayType = productTypes.filter(type => {
            //   return type.id === item.product_type_id;
            // });
            // const gatewayTypeCode = _.upperFirst(
            //   _.get(gatewayType, [0, 'code'], 'GW')
            // );
            // const signal = gatewayTypeCode.match(/\b(\w)/g).join('');
            return (
              <Marker
                key={item.id}
                item={item}
                lat={_.get(item, 'gateway_config.lat')}
                lng={_.get(item, 'gateway_config.lng')}
                text={item.name}
                color={color}
                name={item.name}
                id={item.id}
                gateway={item}
                productTypes={productTypes}
                onMarkerClick={onClickMarker}
                showTooltip
              />
            );
          })}
        </GoogleMapReact>
      </div>
    </>
  );
}
