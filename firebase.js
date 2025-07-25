// firebase.js

// Import Firebase libraries (via CDN in HTML)
const firebaseConfig = {
  apiKey: "AIzaSyAprsqWKtJvSIWKNhH9Y5fqrsJe7eOKNYQ",
  authDomain: "haraka-connect-co-ug.firebaseapp.com",
  databaseURL: "https://haraka-connect-co-ug-default-rtdb.firebaseio.com",
  projectId: "haraka-connect-co-ug",
  storageBucket: "haraka-connect-co-ug.firebasestorage.app",
  messagingSenderId: "192137038338",
  appId: "1:192137038338:web:eedeeea79843a28867351b",
  measurementId: "G-LZPMG63L5D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export handles
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

