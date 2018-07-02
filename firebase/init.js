import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBStUfqB518ErWRiPyct2u6jHE3Vovqvg",
    authDomain: "drinks-dea37.firebaseapp.com",
    databaseURL: "https://drinks-dea37.firebaseio.com",
    projectId: "drinks-dea37",
    storageBucket: "drinks-dea37.appspot.com",
    messagingSenderId: "1085778192627"
  };
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })

  export default firebaseApp.firestore()