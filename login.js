
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

var UserName = "temp" , UserMail, UserPass;
var c = console.log;
var fuserid ;

const auth = firebase.auth();


//-------------Getting Values From Input Box ---------------------//
function inputvalues(){
    UserName = document.getElementById('name').value;
    UserMail = document.getElementById('mail').value;
    UserPass = document.getElementById('pass').value;

}



//---------------Signin --- Register ----------//
function SignIn(){
    inputvalues();
    const promise = auth.signInWithEmailAndPassword(UserMail, UserPass);
    promise.catch(e => alert(e.message));
}
var btns = document.getElementById('btn-login');

btns.onclick = function() {

    inputvalues();
    if(UserName === "" || UserMail === "" || UserPass === ""){
        alert("Fill out all field");
     }else{
         const promise = auth.createUserWithEmailAndPassword(UserMail, UserPass).then(function(){

             fuserid = firebase.auth().currentUser.uid;
             console.log(fuserid);
             
             info();
             alert("Account Created");
         
         
        }).catch(function(error){
            alert(error);
        });   
        
         document.getElementById('pass').value = ''
         document.getElementById('mail').value = ''
         document.getElementById('name').value = ''
         // prevent form from submitting
         
        }
        // info();
        return false;
    }

//---------------Signin --- Register ----------//

function info(){
    c("info ruunnning");
    c(fuserid);
    c(UserName);
    firebase.database().ref("JAVASCRIPTLOGIN/"+fuserid).set({ 
        "uid": fuserid ,
        "Email": UserMail,
        "name": UserName,
        "Avatar" : "https://firebasestorage.googleapis.com/v0/b/chat-app2-b59ab.appspot.com/o/JSIMG%2Fpp.png?alt=media&token=17b65eef-fe8d-4ff0-9b8f-3ada4ffd4e11",
        "Password": UserPass
    });
}


//----------SignOut------------------//
function outSign(){
		
    auth.signOut();
    c("Signed Out");
    
}
outSign();

//----------------------------------------------------------------------------------------------//

//----------function to hide name box and btn register ------------//
var i = 0;
function Hideous(){

    
    c("clicked");



    if(i==0){
    //-----------getting ids ------------------//
    UserName = document.getElementById('name')
  var  UserNameLabel = document.getElementById('nameLabel')
  var  btn = document.getElementById('btn-login')
  var  btn2 = document.getElementById('btn-login2')
  var  anker = document.getElementById('anker')
//----------------------------------------------//


//-----------removing class ------------//
btn2.classList.remove("none");
UserName.classList.remove("block");
UserNameLabel.classList.remove("block");
//--------------------------------------//


//---------------adding class -------------//
    UserName.className += " none";
    UserNameLabel.className += " none";
    btn.className += " none";
    anker.innerHTML = "Dont Have an Account  Click here... "
 //-------------------------------------//   
    i++;
    i++;

    }else{

   //-----------getting ids ------------------//
   UserName = document.getElementById('name')
   var  UserNameLabel = document.getElementById('nameLabel')
   var  btn = document.getElementById('btn-login')
   var  btn2 = document.getElementById('btn-login2')
   var  anker = document.getElementById('anker')
 //----------------------------------------------//
 
 
 //-----------removing class ------------//
 btn.classList.remove("none");
 UserName.classList.remove("none");
 UserNameLabel.classList.remove("none");
 //--------------------------------------//
 
 
 //---------------adding class -------------//
     UserName.className += " block";
     UserNameLabel.className += " block";
     btn2.className += " none";
     anker.innerHTML = "Already have an Account click her "
  //-------------------------------------//   
     i--;
     i--;
    }
}
//--------------------------------------------------------------------//









//----------------user if loggined---------------------//
auth.onAuthStateChanged(function(user){
		
    if(user){
        
        var email = user.email;
       var  userid = user.uid;
       
            // Take user to a different or home page
            window.setInterval(function() {
                window.location.replace("home.html");
                localStorage.setItem("uid",userid);
                localStorage.setItem("mail",email);
           
              }, 2000);
            // is signed in
        
      
        
        
    }else{
        
        console.log("No Active User");
        //no user is signed in
    }
    
    
    
});
