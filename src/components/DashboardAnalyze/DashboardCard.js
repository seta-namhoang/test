import React from 'react';
import { string, number, objectOf } from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

// import withToolTip from '../../hocs/withTooltip';
import cx from 'classnames';
import styles from './styles.module.scss';

const cardCustomStyle = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: 10
        }
      }
    }
  }
});

const options = {
  1: {
    title: 'Trong kho',
    tooltipTitle: 'Số lượng hàng các loại còn trong kho',
    class: 'stock'
  },
  2: {
    title: 'Đã bán',
    tooltipTitle: 'Số lượng hàng đã bán trong tháng',
    class: 'selled'
  },
  3: {
    title: 'Đã kích hoạt',
    tooltipTitle: 'Số lượng hàng đã kích hoạt',
    class: 'actived'
  },
  4: {
    title: 'Đại lý & Users',
    tooltipTitle: 'Số lượng đại lý trực thuộc và người dùng',
    class: 'store'
  }
};

const DashboardCard = ({ stylescard, data, option, classes, icon }) => {
  return (
    <MuiThemeProvider theme={cardCustomStyle}>
      <Card className={stylescard}>
        <Box className={cx(styles['card-title'])}>
          <Box
            className={cx(
              styles['card-title-icon'],
              styles[options[option].class]
            )}
          >
            <Icon style={{ width: '0.85em', height: '0.85em', margin: 'auto' }}>
              <img
                src={icon}
                alt=""
                style={{ width: '100%', position: 'relative', bottom: 4 }}
              />
            </Icon>
          </Box>
          <Box>
            <Typography className={cx(styles['title'])}>
              {options[option].title}
            </Typography>
          </Box>
        </Box>
        <CardContent className={cx(styles['content'])}>
          {data.map(item => (
            <Box key={item.label} className={cx(styles['content-box'])}>
              <Typography component="p" className={cx(styles['card-value'])}>
                {item.value}
              </Typography>
              <Typography component="p" className={cx(styles['card-label'])}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

DashboardCard.propTypes = {
  stylescard: string,
  option: number,
  classes: objectOf(string)
};
export default DashboardCard;
