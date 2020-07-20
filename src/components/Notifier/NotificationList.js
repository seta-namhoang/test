import React from 'react';
import _ from 'lodash';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Warning from '@material-ui/icons/WarningRounded';

import image from '../../resources/image';

import { string, arrayOf, oneOf, shape, func, node } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.module.scss';

const TYPE_CUSTOM = 'custom';
const TYPE_PREPARING = 'preparing';
const TYPE_PROCESSING = 'processing';
const TYPE_FAILED = 'failed';
const TYPE_COMPLETE = 'complete';
const TYPE_NORMAL = 'normal';
const TYPE_WARNING = 'warning';
const TYPE_HANDLE = 'handle';

const INTRO_NONE = 'none';
const INTRO_FADE_IN = 'fade_in';

const OUTRO_NONE = 'none';
const OUTRO_FADE_OUT = 'fade_out';
const OUTRO_SLIDE_OUT = 'slide_out';

const getComponentType = (typeId = '') => {
  return typeId.split('-').length > 1 ? typeId.split('-')[1] : '-';
};

export const notificationListPropTypes = arrayOf(
  shape({
    id: string.isRequired,
    type: oneOf([
      TYPE_CUSTOM,
      TYPE_PREPARING,
      TYPE_PROCESSING,
      TYPE_FAILED,
      TYPE_COMPLETE,
      TYPE_NORMAL,
      TYPE_WARNING,
      TYPE_HANDLE
    ]).isRequired,
    customNode: node,
    notificationTitle: string,
    notificationBody: string,
    statusDescription: string,
    onActionClick: func,
    onRemoveClick: func,
    introAnimation: oneOf([INTRO_NONE, INTRO_FADE_IN]),
    outroAnimation: oneOf([OUTRO_NONE, OUTRO_FADE_OUT, OUTRO_SLIDE_OUT])
  })
);

export default class NotificationList extends React.Component {
  static propTypes = {
    notifications: notificationListPropTypes,
    onClickNotification: func
  };

  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const currentEntries = nextProps.notifications || [];

    if (_.isEmpty(prevState)) {
      return {
        currentEntries,
        removedEntryIds: [],
        allEntries: currentEntries
      };
    } else if (_.isEqual(prevState.currentEntries, currentEntries)) {
      return prevState;
    } else {
      const prevEntries = prevState.currentEntries;

      //Find New Entry
      const newEntryIds = currentEntries.reduce((ids, entry) => {
        const entryId = entry.id;
        const matchedEntry = _.find(prevEntries, { id: entryId });
        !matchedEntry && ids.push(entryId);
        return ids;
      }, []);

      //Find Removed Entry
      const removedEntryIds = prevEntries.reduce((ids, entry) => {
        const entryId = entry.id;
        const matchedEntry = _.find(currentEntries, { id: entryId });
        !matchedEntry && ids.push(entryId);
        return ids;
      }, []);

      //Merge new entries & prev entries
      let allEntries = currentEntries.reduce((accumulator, entry) => {
        let newAccumulator = accumulator.concat([]);
        const matchedPrevIndex = _.findIndex(prevEntries, { id: entry.id });
        if (matchedPrevIndex !== -1) {
          //Append outdated entries for outro animation
          if (matchedPrevIndex > 0) {
            const outDatedEntries = prevEntries.splice(0, matchedPrevIndex);
            newAccumulator = accumulator.concat(outDatedEntries);
          }

          prevEntries.splice(0, 1); //Remove duplicated entry
        }

        newAccumulator.push(entry);

        return newAccumulator;
      }, []);

      allEntries = allEntries.concat(prevEntries); //Append all left over outdated entries for outro animation

      return {
        allEntries,
        currentEntries,
        newEntryIds,
        removedEntryIds
      };
    }
  }

  handleEntryActionClicked = entry => event => {
    entry.onActionClick && entry.onActionClick(entry);
  };

  handleEntryRemoveClick = entry => event => {
    entry.onRemoveClick && entry.onRemoveClick(entry);
  };

  drawGenericItem = (originalData, formatedData, onClickNotification) => {
    const entryId = formatedData.id;
    const isNewEntry = _.includes(this.state.newEntryIds, entryId);
    const isRemoved =
      !isNewEntry && _.includes(this.state.removedEntryIds, entryId);

    return (
      <div
        key={formatedData.id}
        onClick={onClickNotification(originalData)}
        className={classNames(styles.entry, {
          [styles.fadeIn]:
            isNewEntry && formatedData.introAnimation === INTRO_FADE_IN,
          [styles.fadeOut]:
            isRemoved && formatedData.outroAnimation === OUTRO_FADE_OUT,
          [styles.slideOut]:
            isRemoved && formatedData.outroAnimation === OUTRO_SLIDE_OUT,
          [styles.noOutro]:
            isRemoved &&
            (!formatedData.outroAnimation ||
              formatedData.outroAnimation === OUTRO_NONE),
          [styles.seen]: originalData.seen
        })}
      >
        <div className={classNames(styles.visualStatus)}>
          {formatedData.statusIcon}
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>
            {formatedData.notificationBody}
          </div>
          <div className={classNames(styles.subtitle)}>
            {formatedData.statusDescription}
          </div>
        </div>
      </div>
    );
  };

  drawNormalIcon = (entryData, onClickNotification) => {
    const failedEntryData = {
      // eslint-disable-next-line jsx-a11y/alt-text
      statusIcon: <img src={image.icon_error} />,
      actionIcon: (
        <InfoIcon
          className={classNames(styles.icon)}
          style={{ fontSize: '20px' }}
        />
      ),
      statusDescription: 'failed',
      btnActionTrackName: 'failed-notification-retry-botton',
      btnRemoveTrackName: 'failed-notification-remove-button',
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_FADE_OUT,
      ...entryData
    };

    return this.drawGenericItem(
      entryData,
      failedEntryData,
      onClickNotification
    );
  };

  drawWarningIcon = (entryData, onClickNotification) => {
    const productType = entryData.productType;
    const code = getComponentType(productType);
    const failedEntryData = {
      // eslint-disable-next-line jsx-a11y/alt-text
      statusIcon: (
        <img
          alt=""
          style={{ width: 56 }}
          src={image[code !== '-' ? code : 'bao_chay']}
        />
      ),
      actionIcon: (
        <Warning
          // className={classNames(styles.icon)}
          style={{ fontSize: '20px' }}
        />
      ),
      statusDescription: 'failed',
      btnActionTrackName: 'failed-notification-retry-botton',
      btnRemoveTrackName: 'failed-notification-remove-button',
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_FADE_OUT,
      ...entryData
    };

    return this.drawGenericItem(
      entryData,
      failedEntryData,
      onClickNotification
    );
  };

  drawSpinner = () => {
    return <div className={classNames(styles.spinner)} />;
  };

  onClickNotificationFn = notification => () => {
    this.props.onClickNotification(notification);
  };

  render() {
    return (
      <div className={classNames(styles.notificationList)}>
        {this.state.allEntries.map(entry => {
          switch (entry.type) {
            case TYPE_NORMAL:
              return this.drawNormalIcon(entry, this.onClickNotificationFn);

            case TYPE_WARNING:
              return this.drawWarningIcon(entry, this.onClickNotificationFn);

            case TYPE_COMPLETE:
              return this.drawNormalIcon(entry, this.onClickNotificationFn);

            case TYPE_HANDLE:
              return this.drawNormalIcon(entry, this.onClickNotificationFn);

            default:
              return null;
          }
        })}
      </div>
    );
  }
}
