// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDg6FOHq1RyyNFvshL4LN8tKw3htOTlBlQ',
  authDomain: 'outings-383907.firebaseapp.com',
  projectId: 'outings-383907',
  storageBucket: 'outings-383907.appspot.com',
  messagingSenderId: '253304146219',
  appId: '1:253304146219:web:03030c32c497efb45edd6e',
  measurementId: 'G-8QSWPBHZQP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
