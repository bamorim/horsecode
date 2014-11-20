/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
          var a0,
            zone = false,
            zoneC = 0,
            upTime,
            la,
            ga,
            started = false;
        var count = 0;

        document.addEventListener("touchstart",function(){
          document.getElementById("e").innerHTML = ++count;
        });

        app.receivedEvent('deviceready');
        window.setInterval(function(){ga = 0; la = 0;},5000);
        function onSuccess(accel) {
          if(!started){
            started = true;
            a0 = module(accel);
          }
          var a = Math.ceil(10*(module(accel)-a0))/10;
          if(a > ga){
            ga = a;
          }
          if(a < la){
            la = a;
          }

          if(!zone && a > 0.8){
            zone = true;
            zoneC++;
          }
          if(zone && a < 0.5){
            zone = false;
          }
          if(zoneC == 1 && upTime == 0){
            upTime = accel.timestamp;
          }
          if(zoneC == 2){
            var char = -1,
                t = (accel.timestamp - upTime);

            if(t < 300)
              char = 0;
            if(t > 300 && t < 1000)
              char = 1;

            //if(char != -1)
            //  document.getElementById("e").innerHTML += char;

            upTime = 0;
            zoneC = 0;
          }
          document.getElementById("ga").innerHTML = ga;
          document.getElementById("la").innerHTML = la;
          document.getElementById("a").innerHTML = a;
          document.getElementById("t").innerHTML = accel.timestamp
        };

        function module(a){
          return Math.sqrt(
            Math.pow(a.x,2)+
            Math.pow(a.y,2)+
            Math.pow(a.z,2)
          )
        }

        function onError() {
            alert('onError!');
        };

        var options = { frequency: 10 };  // Update every 3 seconds

        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
