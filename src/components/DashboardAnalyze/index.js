import React from 'react';
import cx from 'classnames';

import DashboardCard from './DashboardCard';
import style from './styles.module.scss';
import _ from 'lodash';

import selledIcon from '../../asset/icons/selled.svg';
import activedIcon from '../../asset/icons/actived.svg';
import stockIcon from '../../asset/icons/stock.svg';
import storeIcon from '../../asset/icons/store.svg';

const AnalyzeHeader = ({ report }) => {
  return (
    <div className={cx(style['container'])}>
      <div className={cx(style['row'])}>
        <DashboardCard
          stylescard={cx(style['card-item'], style['col-sm'])}
          data={[
            {
              label: 'Gateways',
              value: _.get(report, 'gateway.in_stock', '--')
            },
            { label: 'Nodes', value: _.get(report, 'node.in_stock', '--') }
          ]}
          option={1}
          icon={stockIcon}
        />
        <DashboardCard
          stylescard={cx(style['card-item'], style['col-sm'])}
          data={[
            {
              label: 'Gateways',
              value: _.get(report, 'gateway.selled.total', '--')
            },
            { label: 'Nodes', value: _.get(report, 'node.selled.total', '--') }
          ]}
          option={2}
          icon={selledIcon}
        />
        <DashboardCard
          stylescard={cx(style['card-item'], style['col-sm'])}
          data={[
            {
              label: 'Gateways',
              value: _.get(report, 'gateway.actived.total', '--')
            },
            { label: 'Nodes', value: _.get(report, 'node.actived.total', '--') }
          ]}
          option={3}
          icon={activedIcon}
        />
        <DashboardCard
          stylescard={cx(style['card-item'], style['col-sm'])}
          data={[
            { label: 'Đại lý', value: _.get(report, 'agencies.amount', '--') },
            { label: 'Users', value: _.get(report, 'agencies.users', '--') }
          ]}
          option={4}
          icon={storeIcon}
        />
      </div>
    </div>
  );
};

AnalyzeHeader.propTypes = {};
export default AnalyzeHeader;
