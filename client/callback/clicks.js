/* import { createRequire } from 'module';
const require = createRequire(import.meta.url); */
/* var path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')


    var PROTO_PATH = "/Users/apple/Forbole/parcel-examples/account-linking/client/callback" + '/../recommend.proto';
    //define server to be connected
   
    var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
    });
    const loaded = grpc.loadPackageDefinition(packageDefinition);
    const hello_proto = loaded.routeguide

    var client = new hello_proto.ParcelParser('0.0.0.0:50051',
                                       grpc.credentials.createInsecure()); */

    //define button
    console.log("load clicks")
    document.getElementById("comment_button").onclick = comment_click;
    document.getElementById("like_button").onclick = like_click;
    document.getElementById("analyse_button").onclick = analyse_click;
    

    function like_click() {
        console.log("clicked like!")
        var postID = document.getElementById('like_post_id').value;
        var post = jsonlist.posts[postID].message;
       // upload(post);
        document.getElementById('like_callback').innerHTML= "<p>Post="+post+"</p>";

    }

    function analyse_click(){
        var userID = document.getElementById('user-id').innerText;
        //get_recommendaton(userID)
        document.getElementById('analyse_callback').innerHTML= "<p>"+userID+"</p>";

    }

    function comment_click(){
      console.log("clicked")
      var postId = document.getElementById('comment_post_id').value;
      var comment = document.getElementById('comment_post_text').value;
      var userID = document.getElementById('user-id').innerText;
      var post=jsonlist.posts[postId].message + comment;
      document.getElementById('comment_callback').innerHTML= "<p>Post="+post+" comment="+comment+"</p>";
     // upload(post,comment,userID);
    } 

    /* client side streaming
    * @param post
    */
     function upload(post,userID){
        var call = client.SaveData(function (error){
            if (error) {
                console.log("OH HERE IS ERROR!")
            }
            call.write({parsePhase:post,identity:userID});  
        })
    }

    //server side streamming
     function get_recommendaton(userID){
        var returnword;
        var call= client.GetRecommended(userID);
        call.on('data', function(words) {
            returnword = words.word;
        });
        //callback when the function is finish
        call.on('end', function(){
            console.log("Yea" + returnword)
        });
        return returnword
    }

    