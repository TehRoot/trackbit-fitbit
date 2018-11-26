import { geolocation } from "geolocation";
import { PositionOptions } from "geolocation";
import * as messaging from "messaging";
import document from "document";

var watchID;
let panoramaContainer = document.getElementById("container");
let startUpScreen = document.getElementById("selection-screen");
let geoDataScreen = document.getElementById("data-screen");
let stopScreen = document.getElementById("stop-screen");
let resultsScreen = document.getElementById("results-screen");
let geoData1 = geoDataScreen.getElementById("geolocation-data1");
let geoData2 = geoDataScreen.getElementById("geolocation-data2");
let geoData3 = geoDataScreen.getElementById("geolocation-data3");
let geoData4 = geoDataScreen.getElementById("geolocation-data4");
let geoData5 = geoDataScreen.getElementById("geolocation-data5");
let startUpScreenButton = startUpScreen.getElementById("startButton");
let buttonLeft = geoDataScreen.getElementById("button-left");
let buttonRight = geoDataScreen.getElementById("button-right");
let endScreenButtonRight = stopScreen.getElementById("rightEndButton");
let resultScreenButton = resultsScreen.getElementById("endButton");

function waitForPrompt(){
  startUpScreenButton.onclick = function(evt){
    panoramaContainer.style.display = "inline";
    startUpScreen.style.display = "none";
    geoDataScreen.style.display = "inline";
    getWatchLocation();
  }
}

//button for ending a track, displays track data
endScreenButtonRight.onclick = function(evt){
  stopScreen.style.display = "none";
  geoDataScreen.style.display = "none";
  resultsScreen.style.display = "inline";
  if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){ 
    messaging.peerSocket.send("finished");
    geolocation.clearWatch(watchID);

  }
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

//logs error -- transitition to popping up an alert
messaging.peerSocket.onerror = function(err){
  console.log("Connection Error: " + err.code);
}

function getWatchLocation(){
  let distance = 0;
  let coordinates = new Array();
  let segment = new Array();
  let positionAccuracy = { enableHighAccuracy: true };
  watchID = geolocation.watchPosition(locationSuccess, locationError, positionAccuracy);
  function locationSuccess(position) {
    let coordinate = segmentPoint(position.coords.latitude, position.coords.longitude);
    segment = segmentLength(segment, coordinate);
    if(segment.length == 2){
        let d = distancePoints(segment);
        segment.shift();
        distance = increment(d, distance);
    } else if(segment.length > 2) {
        segment.length = 0;
    }
    coordinates.push(position.coords.latitude);
    coordinates.push(position.coords.longitude);
    coordinates.push(Date.now());
    geoData1.text = ("Latitude: " +coordinates[0].toFixed(6));
    geoData2.text = ("Longitude: "+coordinates[1].toFixed(6));
    geoData3.text = ("Accuracy [Meters]: " +position.coords.accuracy);
    geoData4.text = ("Altitude [Meters]: " +position.coords.altitude);
    geoData5.text = ("Distance Traveled [KM]: "+ (distance/1000).toFixed(2));

    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN && coordinates.length == 3){
        messaging.peerSocket.send(coordinates);
        coordinates.length = 0;
    }
}
  function locationError(error){
      console.log("Error: " + error.code, "Message: " + error.message)
    }

  function distancePoints(segment){
      let radius = 6371000;
      let coordinate = segment.reduce((acc, val) => acc.concat(val), []); // lol
      let Phi1 = toRadians(coordinate[0]);
      let Phi2 = toRadians(coordinate[2]);
      let DeltaPhi = toRadians(coordinate[2] - coordinate[0]);
      let DeltaLambda = toRadians(coordinate[1] - coordinate[3]);
      let x = Math.pow(Math.sin(DeltaPhi / 2), 2);
      let y = Math.pow(Math.sin(DeltaLambda / 2), 2);
      let a = x + Math.cos(Phi1) * Math.cos(Phi2) * y;
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = radius * c;
      return d;
  }

  function segmentPoint(Latitude, Longitude){
      let segmentPoint = new Array();
      segmentPoint.push(Latitude);
      segmentPoint.push(Longitude);
      return segmentPoint;
  }

  function segmentLength(segment, segmentPoint){
      segment.push(segmentPoint);
      return segment;
  }

  function toRadians(convert){
        return (convert/180.0) * Math.PI;
  }

  function increment(d, x){
      return x+d;
  }
}

messaging.peerSocket.onopen = function(){
  waitForPrompt();
} 