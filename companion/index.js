 import * as messaging from "messaging";

messaging.peerSocket.onmessage = function(evt) {
  var url = "http://localhost:8080/coordinate";
  var url1 = "http://localhost:8080/clear";
  var coordinates = new Array();
  coordinates = evt.data;
  console.log(coordinates);
  console.log(coordinates[0], coordinates[1], coordinates[2]);
  console.log(JSON.stringify(coordinates[0]+","+coordinates[1]+","+coordinates[2]));
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
    body: JSON.stringify({
      "Latitude": coordinates[0],
      "Longitude": coordinates[1],
      "Timestamp": coordinates[2],
    }),
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