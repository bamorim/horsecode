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
    var current = 0,
    longTimeout,
    outTimeout,
    spaceTimeout,
    playInterval,
    char = [],
    received = [];
    var socket = io.connect("http://horsecode.herokuapp.com/");
    document.addEventListener("touchstart",function(){
      // Pause the auto-play
      pause();

      navigator.vibrate(100);
      current = 0;
      longTimeout = window.setTimeout(function(){
        current = 1;
        navigator.vibrate(100);
      },400);

      // Stop the touch-out timeouts
      window.clearTimeout(outTimeout);
      window.clearTimeout(spaceTimeout);
    });
    document.addEventListener("touchend",function(){
      window.clearTimeout(longTimeout);
      char.push(current);
      outTimeout = window.setTimeout(function(){
        if(char[char.length-1]==2) char.pop();
        socket.emit('over',char);
        char = [];

        // Resume the auto-play
        resume();
      },2000);
      spaceTimeout = window.setTimeout(function(){
        navigator.vibrate(100);
        char.push(2);
      },500);

    });

    function pause(){
      clearInterval(playInterval);
    }
    function resume(){
      pause();
      playInterval = setInterval(play,50);
    }
    function play(){
      if(received.length == 0) return;

      clearInterval(play,50);
      var message = received.shift();
      function vibrate(){
        if(message.length == 0){
          setTimeout(resume,500);
          return;
        }
        var pulse = message.shift();
        if(pulse == 2)
          setTimeout(vibrate,500);
        if(pulse == 0){
          navigator.vibrate(150);
          setTimeout(vibrate,300);
        }if(pulse == 1){
          navigator.vibrate(450);
          setTimeout(vibrate,600);
        }
      }
      vibrate();
    }

    socket.on('copy',function(message){
      received.push(message);
    });
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement    = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement  = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    console.log('Received Event: ' + id);
  }
};

app.initialize();
