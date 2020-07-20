import React from 'react';
import { mount } from 'enzyme';
import Notifier from './';

const handleOpen = jest.fn();
const handleClose = jest.fn();
const handleEntryRemove = jest.fn();
const handleEntryAction = jest.fn();

const mockNotifications = {
  onOpen: handleOpen,
  onClose: handleClose,
  notifications: [
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
  ]
};

describe('Notifier Component', () => {
  it('Empty notifier should be disabled', () => {
    const emptyNotifer = mount(<Notifier notifications={[]} />);
    expect(emptyNotifer.find('IconButton').props()['disabled']).toBe(true);
  });

  it('should display notification number', () => {
    const closeNotifier = mount(<Notifier {...mockNotifications} />);
    expect(closeNotifier.text()).toEqual(
      mockNotifications.notifications.length.toString()
    );
    expect(closeNotifier.find('.notificationWindow')).toHaveLength(0);
  });

  const openNotifier = mount(<Notifier {...mockNotifications} />);
  const notifierButtons = openNotifier.find('IconButton');
  it('should have notifier icon button', () => {
    expect(notifierButtons).toHaveLength(1);
  });

  notifierButtons.first().simulate('click');
  it('handle open callback should be called', () => {
    expect(handleOpen).toHaveBeenCalled();
  });

  const entryWindows = openNotifier.find('.notificationWindow');
  it('should have notification list', () => {
    expect(entryWindow).toHaveLength(1);
  });

  let entryWindow = entryWindows.first();
  it('should have notification list header', () => {
    const header = entryWindow.find('div.header');
    expect(header).toHaveLength(1);
    expect(header.first().text()).toContain(
      mockNotifications.notifications.length.toString()
    );
  });
});
