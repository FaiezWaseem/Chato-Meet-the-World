// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDNCHcEXWEfmydLleKIybu37LOo4ORR7B4",
    authDomain: "chat-app2-b59ab.firebaseapp.com",
    databaseURL: "https://chat-app2-b59ab.firebaseio.com",
    projectId: "chat-app2-b59ab",
    storageBucket: "chat-app2-b59ab.appspot.com",
    messagingSenderId: "372802461916",
    appId: "1:372802461916:web:e1dc92770ae3cc011c5419",
    measurementId: "G-CWGH18RHPL"
  };

  firebase.initializeApp(firebaseConfig);  
  


  function signIn(){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider );
  }
function signOut(){
    firebase.auth().signOut();
}
function onfirebasestatechanged(){
    firebase.auth().onAuthStateChanged(onStateChanged);
}
function onStateChanged(user){
if(user){
    // alert(firebase.auth().currentUser.email+'\n'+firebase.auth().currentUser.displayName);
    document.getElementById('imageProfile').src = firebase.auth().currentUser.photoURL;
    document.getElementById('imageProfile').title = firebase.auth().currentUser.displayName;
}
}
onfirebasestatechanged();