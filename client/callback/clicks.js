  const {SaveData,GetRecommended} = require('./client')
  
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
