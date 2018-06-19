import * as messaging from "messaging";

messaging.peerSocket.onmessage = function(evt) {
  console.log(evt.data);
  var url = "http://localhost:8080/coordinate/add";
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(evt.data),
    headers:{
      'Content-Type':'application/json'
    }
  });
  }