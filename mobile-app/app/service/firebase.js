import { initializeApp } from 'firebase/app';

import * as all from "firebase/database"
const { getDatabase } = all

const firebaseConfig = {
    // apiKey: 'api-key',
    authDomain: 'doit-3de48.firebaseapp.com',
    databaseURL: 'https://doit-3de48.firebaseio.com',
    projectId: 'doit-3de48',
    storageBucket: 'doit-3de48.appspot.com',
    messagingSenderId: '145156571124',
    appId: '1:145156571124:android:30993f4747b216faf403a1',
    // measurementId: 'G-measurement-id',
};

initializeApp(firebaseConfig);



