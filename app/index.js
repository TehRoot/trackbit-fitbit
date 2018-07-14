import { geolocation } from "geolocation";
import { PositionOptions } from "geolocation";
import * as messaging from "messaging";
import document from "document";
import { memory } from "system";

let startUpScreen = document.getElementById("selection-screen");
let geoDataScreen = document.getElementById("data-screen");

let geoData1 = geoDataScreen.getElementById("geolocation-data1");
let geoData2 = geoDataScreen.getElementById("geolocation-data2");
let geoData3 = geoDataScreen.getElementById("geolocation-data3");
let geoData4 = geoDataScreen.getElementById("geolocation-data4");

let startUpScreenButton = startUpScreen.getElementById("startButton");
startUpScreen.style.display = "inline";
let buttonleft = geoDataScreen.getElementById("button-left");

function waitForPrompt(){
  startUpScreenButton.onclick = function(evt){
    startUpScreen.style.display = "none";
    getWatchLocation();
  }
}

buttonleft.onclick = function(evt){
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){
    messaging.peerSocket.send("clear");
  }
}

messaging.peerSocket.onerror = function(err){
  console.log("Connection Error: " + err.code);
}

function getWatchLocation(){
  var positionAccuracy = { enableHighAccuracy: false };
  var watchID = geolocation.watchPosition(locationSuccess, locationError, positionAccuracy);
  function locationSuccess(position) {
    var coordinates = new Array();
    coordinates.push(position.coords.latitude);
    coordinates.push(position.coords.longitude);
    coordinates.push(Date.now());
    geoData1.text = ("Latitude: " +coordinates[0].toFixed(6));
    geoData2.text = ("Longitude: "+coordinates[1].toFixed(6));
    geoData3.text = ("Accuracy [Meters]: " +position.coords.accuracy);
    geoData4.text = ("Altitude [Meters]: " +position.coords.altitude);
    
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN && coordinates.length == 3){
        console.log(memory.js.used);
        messaging.peerSocket.send(coordinates);
        coordinates.length = 0;
    }
}  
    function locationError(error){
      console.log("Error: " + error.code, "Message: " + error.message)
    }
}

messaging.peerSocket.onopen = function(){
  waitForPrompt();
} 