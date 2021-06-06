//---------------varibles------------------------------//
var c = console.log;
var a = alert;
var userid , profileSelf ;
var name1;
var messageId ;  //Message id can be aa particular message id & also be an User Specific id
var nameUser2 , profileUser2 ;
var chatType = true;
var pp = document.getElementById('pp');
var files = [] , isfileimg= false;
var reader;
var  imgURL;
var isfilepicked = false;
var rand1 = Math.floor((Math.random() * 99999999999) + 1);
var rand = Math.floor((Math.random() * rand1) + 1);

const auth = firebase.auth();

// Chat Working
var  message;
//----------importing user id from the login html---------------//
userid=localStorage.getItem("uid");
var mailTemp=localStorage.getItem("mail");
c("Userid : "+userid);






  //--------Checking user login and getting user profile info --------------//
  auth.onAuthStateChanged(function(user){
		
    if(user){
      
      
            //is signed in
        
    }else{
        
        c("User is not Logged in");
        window.location.replace("index.html");
        //no user is signed in
    }
    
    
});

//--------------------Use once('value') key word for getting a Users particular data once 
firebase.database().ref("JAVASCRIPTLOGIN/"+userid).once('value').then(function (snapshot) {
    if(snapshot.val().Avatar){
        profileSelf = snapshot.val().Avatar;
        document.getElementById("pp").src= snapshot.val().Avatar;  
         c("User Profile Found");
    }

      name1 = snapshot.val().name;
      c("UserName: "+name1);
      
   }
   );


  //--------Checking user login and getting user profile info --------------//






  //-------------Getting input Value -------------------//
  function inputBoxValue(){
   
      message = document.getElementById("inputBoxvalue").value;
      
  }
/*--------------------Getting  button by id-------------------------*/
let btn_send = document.getElementById("send");
//-----------------INSERT VALUE IN DATBASE ON BUTTON CLICK--------------------------//
btn_send.onclick= function(){
   
    inputBoxValue();
        // save in databasey
// if chatType true means Group chat if chattype false me private chat
        if(chatType){
        firebase.database().ref("chatBox").push().set({
            "sender": name1,
             "uid": userid,
             "message": message,
             "profile": profileSelf

        });
        document.getElementById('inputBoxvalue').value = ''
        // prevent form from submitting
        return false;
    }
        else{
            
            //input fot private chat
            firebase.database().ref("pchat/"+messageId+"/"+userid).push().set({
                "sender": name1, // name self
                 "uid": userid,
                 "message": message
        
            });
            firebase.database().ref("pchat/"+userid+"/"+messageId).push().set({
                "sender": name1,//name self
                 "uid": userid,
                 "message": message
        
            }); 
            
            // / to create chat list
            firebase.database().ref("chatlist2/"+userid+"/"+messageId).set({
                "myuid":userid,//Userid Self
                "name": nameUser2,//Name User 2
                 "uid": messageId, //Userid 2
                 "message": message,
                 "profile": profileUser2  //Profile user2
        
            });  
            firebase.database().ref("chatlist2/"+messageId+"/"+userid).set({
                "sender": name1,   //name self
                 "myuid":userid,   //userid self
                "name": name1,       //name self
                 "uid": userid,       //userid self
                 "message": message,      
                 "profile": profileSelf    // profile self

        
            }); 
            
            document.getElementById('inputBoxvalue').value = ''
            // prevent form from submitting
            return false;
        }

};


//File CLick pick
 function filePick(){
    c("File Clicked");

//Picking a file
    var  input = document.createElement('input');
    input.type = 'file';
   

   input.onchange = e =>{
       files = e.target.files;
       reader = new FileReader();
       reader.onload = function(){
           document.getElementsByClassName('avatar').src = reader.result;
           document.getElementsByTagName('img').src = reader.result;
           isfilepicked =  confirm("File picked Do You Want to Send\n Press OK TO Upload");
           if (isfilepicked) {
               c(isfilepicked);
               UploadFile();
            } else {
              c(isfilepicked);
           
          }
       }
       reader.readAsDataURL(files[0]);
   }    
   input.click();
     
}




//function to upload file
function UploadFile(){
    if(chatType){
    inputBoxValue();
   let  img = "chatimg";
 
    //firebase cloud storage
    var uploadTask = firebase.storage().ref('JS CHAT IMG/'+img+rand+'.png').put(files[0]);
 
    uploadTask.on('state_changed', function(snapshot){
         var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        c("upload"+progress+"%");
        
     
 
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
      firebase.database().ref("chatBox").push().set({
        "sender": name1,
         "uid": userid,
         "message": message,
         "filename": files[0].name,
         "profile": profileSelf,
         "url": imgURL

    });
    document.getElementById('inputBoxvalue').value = ''
     });
     //realtime db

      alert("Upload Successfull");
    }
    
    );
}
//if Chat is private then it will upload in the current list
else{
    inputBoxValue();
    let  img = "chatimg";
  //input fot private chat

  var uploadTask = firebase.storage().ref('JS PCHAT IMG/'+img+rand+'.png').put(files[0]);
  uploadTask.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
   c("upload"+progress+"%");
   a("upload"+progress+"%");


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
 firebase.database().ref("pchat/"+messageId+"/"+userid).push().set({
    "sender": name1, // name self
     "uid": userid,
     "message": message,
     "filename": files[0].name,
     "url": imgURL

});
firebase.database().ref("pchat/"+userid+"/"+messageId).push().set({
    "sender": name1,//name self
     "uid": userid,
     "message": message,
     "filename": files[0].name,
     "url": imgURL

}); 

// / to create chat list
firebase.database().ref("chatlist2/"+userid+"/"+messageId).set({
    "myuid":userid,//Userid Self
    "name": nameUser2,//Name User 2
     "uid": messageId, //Userid 2
     "message": "sent a file",
     "profile": profileUser2  //Profile user2

});  
firebase.database().ref("chatlist2/"+messageId+"/"+userid).set({
    "sender": name1,   //name self
     "myuid":userid,   //userid self
    "name": name1,       //name self
     "uid": userid,       //userid self
     "message": "Sent a file",      
     "profile": profileSelf    // profile self


}); 

document.getElementById('inputBoxvalue').value = ''





});
//realtime db

 alert("Upload Successfull");
}

);





}
}










// Onclick User to chat in private-------------//
function PrivateMessage(id) {
    // get message ID
    var tempnum = 0;
    messageId = id.getAttribute("data-id");
    nameUser2 = id.getAttribute("name");
    profileUser2 = id.getAttribute("profile");

    c("User2 Profile :" +profileUser2);
    var title = document.getElementById('blocktitle');
    c("user2 Name :",nameUser2);
    document.getElementById('title2').innerHTML = nameUser2;
    document.getElementById('friend-picture').src  = profileUser2;
    chatType = false;
    let ul = document.getElementById("messages");
    ul.innerHTML = "";
    c("invoked private chat");
    c("User2 id :",messageId);

    //Private chat working Start here
    firebase.database().ref("pchat/"+userid+"/"+messageId).on("child_added", function (snapshot) {
        let ul = document.getElementById("messages");
        //If Name Matched me
        if(snapshot.val().uid == userid){
            //message contains img or file
              if(snapshot.val().url){
                  //Checking file type
                     var filename = snapshot.val().filename;
                     fileType(filename);
                     //if file is image or not
                     if(isfileimg){
                         //when file is an image
                        messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , true , ul , snapshot.val().uid);
                     }else{
                           // when file is not image
                           fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , true  , ul , snapshot.val().uid);
                     }
                     // message doesnt contain img or file
              }else{
                   // when Simple Text message
                   messageText( snapshot.val().profile ,snapshot.val().sender , snapshot.val().message , snapshot.key , true , ul , snapshot.val().uid);
              }
              //if we are reciver
        }else{
               //  we are reciever
               if(snapshot.val().url){
                         //Checking file               
                               var filename = snapshot.val().filename;
                              fileType(filename);
                                   //if file is image or not
                               if(isfileimg){
                              //when file is an image
                                    messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , false , ul, snapshot.val().uid);
                                      }else{
                                       // when file is not image
                                         fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , false , ul, snapshot.val().uid);
                                          }


                 // message doesnt contain img or file
               }else{
                  // when Simple Text message
                  messageText(snapshot.val().profile ,snapshot.val().sender , snapshot.val().message , snapshot.key , false , ul, snapshot.val().uid);
               }
        }
        if(tempnum == 0){
            $('.card-body').animate({
                scrollTop: $('.card-body').get(0).scrollHeight}, 4000);
                tempnum++;
                tempnum++;
            }

}); 
  return false;
}
//--------------------------------------//






//-----------------------FIREBASE ONCHILD ADDED Group Chat-------------------//
// listen for incoming messages
var tempnum = 0;
if(chatType){
    let ul = document.getElementById("messages");
    ul.innerHTML = "";
    document.getElementById('title2').innerHTML = "Global Chat";
firebase.database().ref("chatBox").on("child_added", function (snapshot) {



    let ul = document.getElementById("messages");
        //If Name Matched me
        if(snapshot.val().uid == userid){
            //message contains img or file
              if(snapshot.val().url){
                  //Checking file type
                  var filename = snapshot.val().filename;
                  fileType(filename);
                  //if file is image or not
                  if(isfileimg){
                      //when file is an image  profile ,sender , message ,key , url , type , ul 
                      messagefileImg(snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , true , ul , snapshot.val().uid );
                    }else{
                        
                           // when file is not image
                           fileOnly(snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , true  , ul, snapshot.val().uid);
                     }
                     // message doesnt contain img or file
              }else{
                   // when Simple Text message
                 
                   messageText(snapshot.val().profile ,snapshot.val().sender , snapshot.val().message , snapshot.key , true , ul, snapshot.val().uid);
              }
              //if we are reciver
        }else{
               //  we are reciever
               if(snapshot.val().url){
                         //Checking file               
                               var filename = snapshot.val().filename;
                              fileType(filename);
                                   //if file is image or not
                               if(isfileimg){
                              //when file is an image
                                    messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , false , ul, snapshot.val().uid);
                                      }else{
                                       // when file is not image
                                         fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , false , ul, snapshot.val().uid);
                                          }


                 // message doesnt contain img or file
               }else{
                  // when Simple Text message
                  messageText( snapshot.val().profile,snapshot.val().sender , snapshot.val().message , snapshot.key , false , ul, snapshot.val().uid);
               }
            }
            
            if(tempnum == 0){
            $('.card-body').animate({
                scrollTop: $('.card-body').get(0).scrollHeight}, 4000);
                tempnum++;
                tempnum++;
            }

});
}
//--------------------- private Chat On child Listener------------------//
else{
    // <img src="${snapshot.val().photo}" style="width:200px;height:200px;">
    //if Photo avaialble in  Private chat
    
        firebase.database().ref("pchat/"+userid+"/"+messageId).on("child_added", function (snapshot) {
            let ul = document.getElementById("messages");
            
            //If Name Matched me
            if(snapshot.val().uid == name1){
                //message contains img or file
                  if(snapshot.val().url){
                      //Checking file type
                         var filename = snapshot.val().filename;
                         fileType(filename);
                         //if file is image or not
                         if(isfileimg){
                             //when file is an image
                            messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , true , ul, snapshot.val().uid);
                         }else{
                               // when file is not image
                               fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , true  , ul, snapshot.val().uid);
                         }
                         // message doesnt contain img or file
                  }else{
                       // when Simple Text message
                       messageText(snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , true , ul ,  snapshot.val().uid);
                  }
                  //if we are reciver
            }else{
                   //  we are reciever
                   if(snapshot.val().url){
                             //Checking file               
                                   var filename = snapshot.val().filename;
                                  fileType(filename);
                                       //if file is image or not
                                   if(isfileimg){
                                  //when file is an image
                                        messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , false , ul, snapshot.val().uid);
                                          }else{
                                           // when file is not image
                                             fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , false , ul, snapshot.val().uid);
                                              }
    
    
                     // message doesnt contain img or file
                   }else{
                      // when Simple Text message
                      messageText(snapshot.val().profile ,snapshot.val().sender , snapshot.val().message , snapshot.key , false , ul, snapshot.val().uid);
                   }
            }

    }); 
}
//-----------------PRIVATE CHAT ONCHILD LISTENER------------------//



//----------ON CHILD ADDED  CHATLIST -------------------//
firebase.database().ref("chatlist2/"+userid).on("child_added", function (snapshot) {

    
    if(snapshot.val().myuid == userid){


        let ul = document.getElementById("testListChat");

            ul.innerHTML +=`<li  data-id='${snapshot.val().uid}'  profile="${snapshot.val().profile}"  name='${snapshot.val().name}' onclick="PrivateMessage(this)"> 
            <div class="row">
            <div class=" col-2 col-md-2">
                <img src="${snapshot.val().profile}" class="friend-pic" />
            </div>
            <div class="col-10 col-md-10 d-md-block" style="cursor:pointer;">
                <div class="name">${snapshot.val().name}</div>
                <div class="under-name">You :${snapshot.val().message}</div>
            </div>
        </div>
            </li>`;
           
    }else{
      let ul = document.getElementById("testListChat");


      ul.innerHTML +=`<li  data-id='${snapshot.val().uid}' name='${snapshot.val().name}' onclick="PrivateMessage(this)"> 
      <div class="row">
      <div class="col-md-2">
          <img src="${snapshot.val().profile}" class="friend-pic" />
      </div>
      <div class="col-md-10 d-md-block" style="cursor:pointer;">
          <div class="name">${snapshot.val().name}</div>
          <div class="under-name">${snapshot.val().message}</div>
      </div>
  </div>
      </li>`;
   
    }
});
















//----------DELETE MESSAGE AND DELETE CHILD LISTNER FIREBASE -------------//
function deleteMessage(self) {
    // get message ID
    var message2 = self.getAttribute("data-id");
 
    // delete message
    if(chatType){
    firebase.database().ref("chatBox").child(message2).remove();
     }else{
        document.getElementById(message2).style.display = "none";
        // document.getElementById("message-" + message2).innerHTML = "This message has been removed";
        firebase.database().ref("pchat/"+userid+"/"+messageId).child(message2).remove();
        firebase.database().ref("pchat/"+messageId+"/"+userid).child(message2).remove();
     }
}
 
// attach listener for delete message
if(chatType){
    //Message DELETE from Global chat
firebase.database().ref("chatBox").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).style.display = "none";
    document.getElementById(snapshot.key).style.display = "none";
    // document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
});
}
    //Message Delete Listener Private Chat
    firebase.database().ref("pchat/"+userid+"/"+messageId).on("child_removed", function (snapshot) {
        // remove message node
        a("Message Deleted");
        document.getElementById("message-" + snapshot.key).style.display = "none";
        document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
    });




// -------Onclick Chat list-------------------//
function chatlist(x){
    if(x == 1){
        //GLobal Chat OnChild Listener
     chatType = true;
     document.getElementById('title2').innerHTML = "Global Chat";
     document.getElementById('friend-picture').src  = "images/pp.png";
     let ul = document.getElementById("messages");
     ul.innerHTML = "";
 firebase.database().ref("chatBox").on("child_added", function (snapshot) {
    let ul = document.getElementById("messages");
        //If Name Matched me
        if(snapshot.val().uid == userid){
            //message contains img or file
              if(snapshot.val().url){
                  //Checking file type
                     var filename = snapshot.val().filename;
                     fileType(filename);
                     //if file is image or not
                     if(isfileimg){
                         //when file is an image
                        messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , true , ul, snapshot.val().uid);
                     }else{
                           // when file is not image
                           fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , true  , ul, snapshot.val().uid);
                     }
                     // message doesnt contain img or file
              }else{
                   // when Simple Text message
                   messageText(snapshot.val().profile,snapshot.val().sender , snapshot.val().message , snapshot.key , true , ul, snapshot.val().uid);
              }
              //if we are reciver
        }else{
               //  we are reciever
               if(snapshot.val().url){
                         //Checking file               
                               var filename = snapshot.val().filename;
                              fileType(filename);
                                   //if file is image or not
                               if(isfileimg){
                              //when file is an image
                                    messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , false , ul, snapshot.val().uid);
                                      }else{
                                       // when file is not image
                                         fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , false , ul, snapshot.val().uid);
                                          }


                 // message doesnt contain img or file
               }else{
                  // when Simple Text message
                  messageText( snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , false , ul, snapshot.val().uid);
               }
        }
 });
}
    //else{
    //     //Private Chat OnChildListener 
    //     document.getElementById('title2').innerHTML = nameUser2;
    //     let ul = document.getElementById("messages");
    //     ul.innerHTML = "";
    //     firebase.database().ref("pchat/"+userid+"/"+messageId).on("child_added", function (snapshot) {
    //         let ul = document.getElementById("messages");
    //         //If Name Matched me
    //         if(snapshot.val().sender == name1){
    //             //message contains img or file
    //               if(snapshot.val().url){
    //                   //Checking file type
    //                      var filename = snapshot.val().filename;
    //                      fileType(filename);
    //                      //if file is image or not
    //                      if(isfileimg){
    //                          //when file is an image
    //                         messagefileImg( snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , true , ul);
    //                      }else{
    //                            // when file is not image
    //                            fileOnly( snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , true  , ul);
    //                      }
    //                      // message doesnt contain img or file
    //               }else{
    //                    // when Simple Text message
    //                    messageText(snapshot.val().profile,snapshot.val().sender , snapshot.val().message , snapshot.key , true , ul);
    //               }
    //               //if we are reciver
    //         }else{
    //                //  we are reciever
    //                if(snapshot.val().url){
    //                          //Checking file               
    //                                var filename = snapshot.val().filename;
    //                               fileType(filename);
    //                                    //if file is image or not
    //                                if(isfileimg){
    //                               //when file is an image
    //                                     messagefileImg(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url , false , ul);
    //                                       }else{
    //                                        // when file is not image
    //                                          fileOnly(snapshot.val().profile  ,snapshot.val().sender , snapshot.val().message , snapshot.key , snapshot.val().url ,snapshot.val().filename , false , ul);
    //                                           }
    
    
    //                  // message doesnt contain img or file
    //                }else{
    //                   // when Simple Text message
    //                   messageText( snapshot.val().profile , snapshot.val().sender , snapshot.val().message , snapshot.key , false , ul);
    //                }
    //         }
    // }); 


    // chatType = false;
    // }
}
 





// -----------UPDATE USER PROFILE --------------------//

// function updateUserDetail(){
// user.updateProfile({
//   displayName: name1,
//   photoURL: "https://example.com/jane-q-user/profile.jpg"
// }).then(function() {
//   Update successful.
// }).catch(function(error) {
//   An error happened.
// });
// }
// updateUserDetail();

//-----------------------------------------------------//



// document.getElementsByClassName('card-body').scrollTop = 9999999;


//Window Load Function is used for  html page loaded 

// window.onload=function () {
//    $('.card-body').animate({
//     scrollTop: $('.card-body').get(0).scrollHeight}, 2000);
   
// }



var counter = 0;
// Set interval will keeep running in background and check internet connection
window.setInterval(function() {
    var ifConnected = window.navigator.onLine;
    if (ifConnected) {
      c("Runtime : ",counter++,'  Message : Connection available');
    } else {
        c("Runtime : ",counter++,'  Message : No Connection');
      alert('Connection not available');
    }
  }, 10000);



pp.onclick = function(){
    
    window.location.replace("profile.html");
    c(" Profile trigerred ");
}
//SignOut
function GoTOHome(){
    window.location.replace("index.html");
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
function imgClick(id){
    var sour = id.getAttribute("src");
  modal.style.display = "block";
  modalImg.src = sour;
  captionText.innerHTML = `You Are Viewing an image <a href ="${sour}" download>Download</a>`;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}

// Get the modal
var modal2 = document.getElementById("modalUser");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close2")[0];

// When the user clicks the button, open the modal 
function openUserlist() {
  modal2.style.display = "block";
  users();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal2.style.display = "none";
  }
}













//----------Checking File Type-----------------//
function fileType(fname){
    if(fname.includes('.jpg')|| fname.includes('.png') || fname.includes('.jpeg') || fname.includes('.gif') || fname.includes('.JPG') || fname.includes('.PNG') )
    {
    isfileimg = true;

    
    } else {
     isfileimg = false;
    }

}

//----------Message TO list ---------------------------------------//
function messageText (profile , sender , message ,key  , type , ul , uid ){
    
    if(type){
        // type true means we are sender
        ul.innerHTML += ` <li id="${key}">
    <div class="sent" >
    <h3>${sender}</h3>
    <p id="${"message-"+key}">${message}</p>
    <button data-id='${key}' onclick='deleteMessage(this);'>Delete</button>
    </div>
    </li>`; 
    }else{
         // type true means we are reciver
        ul.innerHTML += ` <li id="${key}" data-id="${uid}" profile ="${profile}" name="${sender}" onclick="PrivateMessage(this);">
        <div class="recieve" >
        <h3>${sender}</h3>
        <p id="${"message-"+key}">${message}</p>
        </div>
        </li>`; 
    }
     
}
function messagefileImg(profile ,sender , message ,key , url , type , ul, uid ){
    if(type){
        ul.innerHTML += ` <li id="${key}" data-id="${key}" profile ="${profile}" name="${sender}" >
    <div class="sent" >
    <h3>${sender}</h3>
    <p id="${"message-"+key}">${message}</p>
    <img src="${url}" class="file" alt="image not found" style = "width:200px ; height:200px" onclick ="imgClick(this);">
    <button data-id='${key}' onclick='deleteMessage(this);'>Delete</button>
    </div>
    </li>`;
    }else{
    ul.innerHTML += ` <li id="${key}" data-id="${uid}" profile ="${profile}" name="${sender}"  onclick="PrivateMessage(this);">
    <div class="recieve" >
    <h3>${sender}</h3>
    <p id="${"message-"+key}">${message}</p>
    <img src="${url}" class="file" alt="image not found" style = "width:200px ; height:200px" onclick ="imgClick(this);">
    </div>
    </li>`; }
}
function fileOnly(profile ,sender , message ,key , url , filename , type  , ul , uid){
    if(type){
        if(filename.includes(".mp4")|| filename.includes(".mp3")){
            ul.innerHTML += ` <li id="${key}">
            <div class="sent" >
            <h3>${sender}</h3>
            <p id="${"message-"+key}">${message}</p>
            <video  muted loop controls src="${url}" class="file" style="width: 300px; height: 250px;">
            </video>
            <p data-id="${url}">${filename}</p>
            <button data-id='${key}' onclick='deleteMessage(this);'>Delete</button>
            </div>
            </li>`;
        }else{
        ul.innerHTML += ` <li id="${key}">
        <div class="sent" >
        <h3>${sender}</h3>
        <p id="${"message-"+key}">${message}</p>
        <div>
        <p data-id="${url}">${filename}</p>
        <i class="fas fa-file-alt"></i>
        </div>
        <button data-id='${key}' onclick='deleteMessage(this);'>Delete</button>
        </div>
        </li>`; } 
    }else{
        if(filename.includes(".mp4")|| filename.includes(".mp3")){
            ul.innerHTML += ` <li id="${key}">
            <div class="recieve" >
            <h3>${sender}</h3>
            <p id="${"message-"+key}">${message}</p>
            <video  muted loop controls src="${url}" class="file" style="width: 300px; height: 250px;">
            </video>
            <p data-id="${url}">${filename}</p>
            </div>
            </li>`;
        }else{
    ul.innerHTML += ` <li  id="${key}" data-id="${uid}" profile ="${profile}" name="${sender}"  onclick="PrivateMessage(this);">
    <div class="recieve" >
    <h3>${sender}</h3>
    <p id="${"message-"+key}">${message}</p>
    <div>
    <i class="fas fa-file-alt"></i>
    <p data-id="${url}">${filename}</p>
    </div>
    </div>
    </li>`;  }
    }
}
//------------------Message TO list --------------------------------------//






//-----------UserList-------------------//
function users(){
    let ul = document.getElementById('userslist');
    ul.innerHTML = "";
    firebase.database().ref("JAVASCRIPTLOGIN").on("child_added", function (snapshot) {
       ul.innerHTML +=`<li  data-id='${snapshot.val().uid}'  profile="${snapshot.val().Avatar}"  name='${snapshot.val().name}' onclick="PrivateMessage(this)" style="  background-color: rgba(210, 219, 220,0.4) ;"> 
       <div class="row">
       <div class=" col-2 col-md-2">
           <img src="${snapshot.val().Avatar}" class="friend-pic" />
       </div>
       <div class="col-10 col-md-10 d-md-block" style="cursor:pointer;">
           <div class="name">${snapshot.val().name}</div>
       </div>
   </div>
       </li>`;
    //   snapshot.val().name;
    //   <div class="under-name">You :${snapshot.val().message}</div>

   }
   );
}


//----------Search in list --------------//
function SearchInChatList() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    ul = document.getElementById("testListChat");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
       
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//----------Search in User List --------------//
function SearchInUserList() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("input2");
    filter = input.value.toUpperCase();
    ul = document.getElementById("userslist");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
       
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}