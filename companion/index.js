 import * as messaging from "messaging";

messaging.peerSocket.onmessage = function(evt) {
  //finished endpoint is a dummy stub -- read TODO on main 
  //work on transaction system
  var url = "http://localhost:8080/coordinate";
  var url1 = "http://localhost:8080/clear";
  var url2 = "http://localhost:8080/finished";
  var coordinates = new Array();
  coordinates = evt.data;
  if(evt.data == "clear"){
    fetch(url1, {
      method: 'POST',
      body: JSON.stringify(""),
      headers:{
        'Content-Type':'application/json'
      }
    });
  } else if(evt.data == "finished"){
    fetch(url2, {
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