/*\
title: $:/core/modules/utils/corebos.js
type: application/javascript
module-type: utils

This file sets up the globals that need to be available when JavaScript modules are executed in the browser. The overall sequence is:

\*/

(function(){

"use strict";

var Add = (a, b) => {
    return a + b;
}

// var Fetch = () => {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         console.log("I am from Google");
//         console.log(this.responseText);
//       }
//     };
//     xhttp.open("GET", "http://google.com", true);
//     xhttp.send();
//     console.log("I am done");
// }

var Fetch = () => {
    fetch("https://ipinfo.io/json")
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        console.log(myJson.ip);
    })
    .catch(function (error) {
        console.log("Error: " + error);
    });
}


exports.add = Add;
exports.fetch = Fetch;

})();