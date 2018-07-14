 import * as messaging from "messaging";

messaging.peerSocket.onmessage = function(evt) {
  var url = "http://localhost:8080/coordinate";
  //var url = "https://markcardish.ml/coordinate";
  var url1 = "https://markcardish.ml/clear";
  console.log(evt.data);
  if(evt.data == "clear"){
    fetch(url1, {
      method: 'POST',
      body: JSON.stringify(""),
      headers:{
        'Content-Type':'application/json'
      }
    });
  } else {
    fetch(url, {
    method: 'POST',
    body: JSON.stringify(evt.data),
    headers:{
      'Content-Type':'application/json'
    }
  });
  }
 }

function generateQuickIdentHash(str){
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return hex(hash);
  });
}