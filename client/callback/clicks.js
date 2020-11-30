import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var path = require('path')
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
                                       grpc.credentials.createInsecure());

    //define button
    //document.getElementById("comment-button").onclick = function() {(comment_click())};
    //document.getElementById("like-button").onclick = function() {(like_click())};
/* 
    function like_click() {
        upload(parseInt(document.getElementById('like_post_id').value));
    }

    function recommend_click(){
        var userID = document.getElementById('user-id').innerText;
        get_recommendaton(userID)
    }

    export function comment_click(){
      console.log("clicked")
      var postId = document.getElementById('comment_post_id').value;
      var comment = document.getElementById('comment_post_text').value;
      var userID = document.getElementById('user-id').innerText;
      var post=jsonlist.posts[postId].message + comment
      upload(post,comment,userID);
    } */

    /* client side streaming
    * @param post
    */
    export function upload(post,userID){
        var call = client.SaveData(function (error){
            if (error) {
                console.log("OH HERE IS ERROR!")
            }
            call.write({parsePhase:post,identity:userID});  
        })
    }

    //server side streamming
    export function get_recommendaton(userID){
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

    