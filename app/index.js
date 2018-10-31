import { geolocation } from "geolocation";
import { PositionOptions } from "geolocation";
import * as messaging from "messaging";
import document from "document";

var watchID;
let startUpScreen = document.getElementById("selection-screen");
let geoDataScreen = document.getElementById("data-screen");
let stopScreen = document.getElementById("stop-screen");
let resultsScreen = document.getElementById("results-screen");
let geoData1 = geoDataScreen.getElementById("geolocation-data1");
let geoData2 = geoDataScreen.getElementById("geolocation-data2");
let geoData3 = geoDataScreen.getElementById("geolocation-data3");
let geoData4 = geoDataScreen.getElementById("geolocation-data4");

let startUpScreenButton = startUpScreen.getElementById("startButton");
let buttonLeft = geoDataScreen.getElementById("button-left");
let buttonRight = geoDataScreen.getElementById("button-right");
let endScreenButtonLeft = stopScreen.getElementById("rightEndButton");
let resultScreenButton = resultsScreen.getElementById("EndButton");

function waitForPrompt(){
  startUpScreenButton.onclick = function(evt){
    startUpScreen.style.display = "none";
    geoDataScreen.style.display = "inline";
    getWatchLocation();
  }
}

//button for ending a track
endScreenButtonLeft.onclick = function(evt){
  stopScreen.style.display = "none";
  geoDataScreen.style.display = "none";
  resultsScreen.style.display = "inline";
  geolocation.clearWatch(watchID);
}

//button moves to initial ending
buttonRight.onclick = function(evt){
  geoDataScreen.style.display = "none";
  stopScreen.style.display = "inline";
}


//exits out of entirety, dumps back on main screen
resultScreenButton.onclick = function(evt){
  resultsScreen.style.display = "none";
  startUpScreen.style.display = "inline";
}

//return button clear data store - temporary
buttonLeft.onclick = function(evt){
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){
    messaging.peerSocket.send("clear");
  }
}

messaging.peerSocket.onerror = function(err){
  console.log("Connection Error: " + err.code);
}

function getWatchLocation(){
  var positionAccuracy = { enableHighAccuracy: false };
  watchID = geolocation.watchPosition(locationSuccess, locationError, positionAccuracy);
  function locationSuccess(position) {
    var coordinates = new Array();
    coordinates.push(position.coords.latitude);
    coordinates.push(position.coords.longitude);
    coordinates.push(Date.now());
    geoData1.text = ("Latitude: " +coordinates[0].toFixed(6));
    geoData2.text = ("Longitude: "+coordinates[1].toFixed(6));
    geoData3.text = ("Accuracy [Meters]: " +position.coords.accuracy);
    geoData4.text = ("Altitude [Meters]: " +position.coords.altitude);
    geoData4.text = ("Travelled [Meters]: ");
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN && coordinates.length == 3){
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