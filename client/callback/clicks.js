import protoLoader from '@grpc/proto-loader';
import grpc from 'grpc';

    console.log("load clicks")
    document.getElementById("comment_button").onclick = comment_click;
    document.getElementById("like_button").onclick = like_click;
    document.getElementById("analyse_button").onclick = analyse_click;

    function like_click() {
        console.log("clicked like!")
        var postID = document.getElementById('like_post_id').value;
        var post = jsonlist.posts[postID].message;
        var userID = document.getElementById('user-id').innerText;

       // upload(post);
        document.getElementById('like_callback').innerHTML= "<p>Post="+post+"</p>";
        SaveData(post,userID,function (callback){
            document.getElementById('like_callback').innerHTML= "<p>Post="+callback+"</p>";
        })
    }

    function analyse_click(){
        var userID = document.getElementById('user-id').innerText;
        //get_recommendaton(userID)
        document.getElementById('analyse_callback').innerHTML= "<p>"+"You are interested in Technology!"+"</p>";
        GetRecommended(userID,function (callback){
            document.getElementById('like_callback').innerHTML= "<p>Post="+callback+"</p>";
        })
    }

    function comment_click(){
      console.log("clicked")
      var postId = document.getElementById('comment_post_id').value;
      var comment = document.getElementById('comment_post_text').value;
      var userID = document.getElementById('user-id').innerText;
      var post=jsonlist.posts[postId].message + comment;
      document.getElementById('comment_callback').innerHTML= "<p>Post="+post+" comment="+comment+"</p>";
     // upload(post,comment,userID);
     SaveData(post,userID,function (callback){
        document.getElementById('like_callback').innerHTML= "<p>Post="+callback+"</p>";
    })
    } 



var PROTO_PATH = "/Users/apple/Forbole/parcel-examples/account-linking/server/src/recommend.proto"
//define server to be connected

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;
var client = new routeguide.RouteGuide('0.0.0.0:50051',
                                       grpc.credentials.createInsecure());

/**
 * 
 * @param {*} address User identity address
 * @param {*} callback funciton that take a string as arg
 */
function GetRecommended(address,callback) {
    var userInfo = {
        identity: address
    }
    function getRecommendCallback(err,words){
        if (err){
            callback(err)
            return
        }
        callback(words.word)
        console.log(words.word)
    }
    client.GetRecommended(userInfo,getRecommendCallback)
}

/**
 * 
 * @param {*} address User Identity Address
 * @param {*} parsePhase The words that need to be stored
 * @param {*} callback a function that take a string as arg
 */
function SaveData(address,parsePhase,callback) {
    var parsephase = {
        parsePhase: parsePhase,
        identity: address
    }

    function TestSaveDataCallback(err,words){
        if (err){
            callback(error)
            return
        }
        callback(words.msg)
        console.log(words.msg)
    }

    client.SaveData(parsephase,TestSaveDataCallback)
    
}

export{
    SaveData,
    GetRecommended
}
