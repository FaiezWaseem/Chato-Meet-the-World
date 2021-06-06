//---------- variables----------/
var edit = document.getElementsByClassName('edit');
var select = document.getElementById('select');
var upload = document.getElementById('upload');
var nameS = document.getElementById('uname');
var emailS = document.getElementById('uemail');
var myprog = document.getElementById('myProgress');
var i = 0;
var img , imgURL;
var files = [] , fileName;
var reader;
const auth = firebase.auth();
var c = console.log;
var userid , name1;
userid=localStorage.getItem("uid");
c(userid);
var rand1 = Math.floor((Math.random() * 99999999999) + 1);
var rand = Math.floor((Math.random() * rand1) + 1);
c(rand);

function editClick(){

     if(i == 0){
        select.classList.remove("none");
        upload.classList.remove("none");
       
        i++;i++;
    }else{
       
        i--;i--;
        select.className += " none";
        upload.className += " none";
        
     }
}

//-------Selection Process -----------------//
select.onclick = function(e){
    var  input = document.createElement('input');
    input.type = 'file';
   

   input.onchange = e =>{
       files = e.target.files;
       fileName = e.target.files[0].name;
       c(e.target.files[0].name);
       reader = new FileReader();
       reader.onload = function(){
           document.getElementsByClassName('avatar').src = reader.result;
           document.getElementsByTagName('img').src = reader.result;
           

              alert("file picked click upload button");
       }
       reader.readAsDataURL(files[0]);
   }    
   input.click();

}

//----------UPLOAD PROCESS-----------------//


upload.onclick = function (){
    myprog.classList.remove("none");
   img = "avatar";
 
   //firebase cloud storage
   var uploadTask = firebase.storage().ref('JSIMG/'+img+rand+'.png').put(files[0]);

   uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        document.getElementsByName('h4').innerHTML = "upload"+progress+"%";
     c(progress);
     move(progress);

   },
   //error catching
   function(error){
      alert(error);
   },

   //on upload success
   function(){
       uploadTask.snapshot.ref.getDownloadURL().then(function(url){
     imgURL = url;
     c(imgURL);
     firebase.database().ref('JAVASCRIPTLOGIN/'+userid).update({
          
         "Avatar" : imgURL
 
     });
    });
    //realtime db
    myprog.className += " none";
     alert("Upload Successfull \n REFRESH THE PAGE");
   }
   
   );


}

//----------------user if loggined---------------------//
auth.onAuthStateChanged(function(user){
		
    if(user){
        c("User Logged in");
        
        var email = user.email;
        var userid = user.uid;
        c(email);
        
    }else{
        
        alert("No Active User");
        //no user is signed in
    }
    
    
    
});


//---------------getting user profile details -------------------// 
firebase.database().ref("JAVASCRIPTLOGIN/"+userid).once('value').then(function (snapshot) {

   

  c(document.getElementById('avatar'));
  var profileLink =   snapshot.val().Avatar;
  if(profileLink != undefined){
  document.getElementById("avatar").src= profileLink;
  c(profileLink);
  }else if(profileLink != ""){
    document.getElementById("avatar").src= profileLink;
    c(profileLink);
  }
    name1 = snapshot.val().name;
    c("UserName: "+name1);
    emailS.innerHTML = snapshot.val().Email;
    nameS.innerHTML = name1;
 }
 );



 //--------progress bar --------------//
 function move(x) {
    
      var elem = document.getElementById("myBar");
      var per = document.getElementById("per");
      var width = x;
   
          elem.style.width = width + "%";
          per.innerHTML = x + "%";
        }
   

 function GoTOHome(){
    window.location.replace("home.html");
}





