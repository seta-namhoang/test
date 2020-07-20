import moment from 'moment';

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}-${s4()}-${s4()}`;
}

export function getMinutesDiffNow(timestamp) {
  const now = new moment(Date.now());
  const nodeStateTime = new moment(new Date(timestamp * 1000));
  return moment.duration(now.diff(nodeStateTime)).as('minutes');
}

export function timestampToDate(timestamp) {
  const date = new moment(new Date(timestamp * 1000));
  return date.format('HH:mm DD-MM-YYYY');
}

export function timestampToDateTime(timestamp) {
  const date = new moment(new Date(timestamp * 1000));
  return date.format('DD/MM/YYYY HH:mm');
}

export function isObjectEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) return false;
  }
  return true;
}
