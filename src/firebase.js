import firebase from "firebase";

// Initialize Firebase
var config = {
  // test db, will need to reinstate this without pushing to github
  apiKey: "AIzaSyAcHKEBAbF1VPCt9-jQ2Hmf3He6bybWZgs",
  authDomain: "cocktails-81feb.firebaseapp.com",
  databaseURL: "https://cocktails-81feb.firebaseio.com",
  projectId: "cocktails-81feb",
  storageBucket: "cocktails-81feb.appspot.com",
  messagingSenderId: "1088158674250"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
