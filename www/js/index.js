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
        char = [],
        received = [];
        var socket = io.connect("http://horsecode.herokuapp.com/");
        document.addEventListener("touchstart",function(){
            navigator.vibrate(100);
            current = 1;
            longTimeout = window.setTimeout(function(){
                current = 2;
                navigator.vibrate(100);
            },400);
            window.clearTimeout(outTimeout);
        });
        document.addEventListener("touchend",function(){
            window.clearTimeout(longTimeout);
            char.push(current);
            outTimeout = window.setTimeout(function(){
                socket.emit('message',char);
                document.getElementById("e").innerHTML = char.toString();
            },1000);
        });
        socket.on('message',function(message){
            alert(message);
            var msg = char;
            function vibrate(){
                if(char.length == 0) return;
                var pulse = char.pop();
                if(pulse == 0)
                    setTimeout(vibrate,500);
                if(pulse == 1){
                    navigator.vibrate(100);
                    setTimeout(vibrate,200);
                }if(pulse == 2){
                    navigator.vibrate(400);
                    setTimeout(vibrate,500);
                }
            }
            vibrate();
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
