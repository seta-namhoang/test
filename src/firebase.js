import * as firebase from 'firebase/app';
import 'firebase/messaging';

const initializedFirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBDFTAgeKD04PmTYY88u00bqmywAXcA94A',
  authDomain: 'vncss-7c78c.firebaseapp.com',
  databaseURL: 'https://vncss-7c78c.firebaseio.com',
  projectId: 'vncss-7c78c',
  storageBucket: 'vncss-7c78c.appspot.com',
  messagingSenderId: '522606716293',
  appId: '1:522606716293:web:23b2ac1f9347c85f2d90ec',
  measurementId: 'G-CE5J0XC6CZ'
});

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
  'BNjVgqQVsylSd9y-Tj_pxJrvWtR-cmtV5sNNnArU-f6S2_hnh4KTT74URGh_fE5QfzQKzCkw4TBDXLnMFib4TOE'
);

export { messaging };
