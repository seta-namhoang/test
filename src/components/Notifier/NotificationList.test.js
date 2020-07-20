import React from 'react';
import { mount } from 'enzyme';
import NotificationList from './NotificationList';

const handleEntryRemove = jest.fn();
const handleEntryAction = jest.fn();

const mockNotifications = [
  {
    id: '1234',
    type: 'preparing',
    notificationTitle: 'Top Description Goes Here',
    notificationBody: 'Bottom Description Goes Here',
    statusDescription: 'testing testing',
    onRemoveClick: handleEntryRemove
  },
  {
    id: '2234',
    type: 'processing',
    notificationTitle: 'Top Processing Description Goes Here',
    notificationBody: 'Bottom Processing Description Goes Here',
    statusDescription: 'processing',
    onRemoveClick: handleEntryRemove
  },
  {
    id: '3234',
    type: 'failed',
    notificationTitle: 'Failed Description 1 Goes Here',
    notificationBody: 'Failed Description 2 Goes Here',
    test: 'something esle',
    bla: 123,
    onActionClick: handleEntryAction,
    onRemoveClick: handleEntryRemove
  },
  {
    id: '4234',
    type: 'complete',
    notificationTitle: 'Big Description Goes Here',
    notificationBody: 'Small Description Goes Here',
    onRemoveClick: handleEntryRemove
  },
  {
    id: '5234',
    type: 'preparing',
    notificationTitle: 'preparing Description 1',
    notificationBody: 'preparing Description 2'
  },
  {
    id: '6234',
    type: 'processing',
    notificationTitle: 'Processing Description 1',
    notificationBody: 'Processing Description 2'
  },
  {
    id: '7234',
    type: 'failed',
    notificationTitle: 'failed Description 1',
    notificationBody: 'failed Description 2'
  },
  {
    id: '8234',
    type: 'complete',
    notificationTitle: 'complete Description 1',
    notificationBody: 'complete Description 2'
  }
];

describe('Notifications Component', () => {
  const notificationList = mount(
    <NotificationList notifications={mockNotifications} />
  );

  it('should have all entries', () => {
    expect(notificationList.find('div.entry')).toHaveLength(
      mockNotifications.length
    );
  });

  it('should have buttons for callbacks', () => {
    expect(notificationList.find('IconButton')).toHaveLength(5);
  });

  it('Preparing entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '1234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith({
      id: '1234',
      type: 'preparing',
      notificationTitle: 'Top Description Goes Here',
      notificationBody: 'Bottom Description Goes Here',
      statusDescription: 'testing testing',
      onRemoveClick: handleEntryRemove
    });
  });

  it('Processing entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '2234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith({
      id: '2234',
      type: 'processing',
      notificationTitle: 'Top Processing Description Goes Here',
      notificationBody: 'Bottom Processing Description Goes Here',
      statusDescription: 'processing',
      onRemoveClick: handleEntryRemove
    });
  });

  it('Failed entry buttons should trigger callbacks', () => {
    const failedEntry = notificationList.findWhere(
      entry => entry.key() === '3234'
    );
    expect(failedEntry).toHaveLength(1);
    const failedButtons = failedEntry.find('IconButton');
    expect(failedButtons).toHaveLength(2);
    const actionButton = failedButtons.first();
    actionButton.simulate('click');
    expect(handleEntryAction).toHaveBeenCalledWith({
      id: '3234',
      type: 'failed',
      notificationTitle: 'Failed Description 1 Goes Here',
      notificationBody: 'Failed Description 2 Goes Here',
      test: 'something esle',
      bla: 123,
      onActionClick: handleEntryAction,
      onRemoveClick: handleEntryRemove
    });

    const removeButton = failedButtons.last();
    removeButton.simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith({
      id: '3234',
      type: 'failed',
      notificationTitle: 'Failed Description 1 Goes Here',
      notificationBody: 'Failed Description 2 Goes Here',
      test: 'something esle',
      bla: 123,
      onActionClick: handleEntryAction,
      onRemoveClick: handleEntryRemove
    });
  });

  it('complete entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '4234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith({
      id: '4234',
      type: 'complete',
      notificationTitle: 'Big Description Goes Here',
      notificationBody: 'Small Description Goes Here',
      onRemoveClick: handleEntryRemove
    });
  });

  it('Preparing entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '5234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(0);
  });

  it('Processing entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '6234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(0);
  });

  it('Failed entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '7234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(0);
  });

  it('complete entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '8234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find('IconButton');
    expect(actionButtons).toHaveLength(0);
  });
});
