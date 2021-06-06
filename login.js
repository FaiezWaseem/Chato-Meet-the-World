var UserName , UserMail, UserPass;
var c = console.log;

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
    c(UserName);
    c(UserPass);
    c(UserMail);
    promise.catch(e => alert(e.message));
}


function signUp(){
    inputvalues();
    if(UserName === "" || UserMail === "" || UserPass === ""){
        alert("Fill out all field");
     }else{
         const promise = auth.createUserWithEmailAndPassword(UserMail, UserPass).then(function(){

            alert("Signed Up");
         var fuserid = firebase.auth().currentUser.uid;
         console.log(fuserid);
         firebase.database().ref("JAVASCRIPTLOGIN/").set({
             "uid": fuserid ,
             "Email": UserMail,
             "name": UserName,
             "Avatar" : "https://firebasestorage.googleapis.com/v0/b/chat-app2-b59ab.appspot.com/o/JSIMG%2Fpp.png?alt=media&token=17b65eef-fe8d-4ff0-9b8f-3ada4ffd4e11",
             "Password": UserPass
         });



         }).catch(function(error){
              alert(error);
         });
      
         
         document.getElementById('pass').value = ''
         document.getElementById('mail').value = ''
         document.getElementById('name').value = ''
         // prevent form from submitting
         return false;
     }
}

//---------------Signin --- Register ----------//


//----------SignOut------------------//
function outSign(){
		
    auth.signOut();
    alert("Signed Out");
    
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
        var userid = user.uid;
        alert(email);
        var r = confirm("Active User " + email+"\n uid :"+userid+"   "+"\nPress ok To continue  to Home Page\n Press Cancel To Stay Here");
        if (r == true) {
            // Take user to a different or home page
            window.location.replace("home.html");
            localStorage.setItem("uid",userid);
            localStorage.setItem("mail",email);
            // is signed in
        
        } else {
           
        }
        
        
    }else{
        
        console.log("No Active User");
        //no user is signed in
    }
    
    
    
});
