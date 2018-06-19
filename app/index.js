import { geolocation } from "geolocation";
import * as messaging from "messaging";
import document from "document";

let geoData1 = document.getElementById("geolocation-data1");
let geoData2 = document.getElementById("geolocation-data2");

messaging.peerSocket.onerror = function(err) {
  console.log("Connection Error: " + err.code);
}
function getWatchLocation(){
  geolocation.getCurrentPosition(locationSuccess, locationError);
  function locationSuccess(position) {
    var coordinates = new Array();
    coordinates.push((position.coords.latitude).toFixed(6));
    coordinates.push((position.coords.longitude).toFixed(6));
    geoData1.text = ("Latitude: " +coordinates[0]);
    geoData2.text = ("Longitude: "+coordinates[1]);
    if(coordinates.length == 2){
      if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){
        messaging.peerSocket.send(coordinates);
      }
    }
  }
}

function locationError(error){
  console.log("Error: " + error.code, "Message: " + error.message)
}

messaging.peerSocket.onopen = function() {
  getWatchLocation();
  setInterval(getWatchLocation, 5000);
}