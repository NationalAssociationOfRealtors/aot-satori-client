require('dotenv').config()
var RTM = require('satori-sdk-js');

var endpoint = process.env.ENDPOINT
var appkey = process.env.APPKEY
var role = process.env.ROLE
var roleSecretKey = process.env.ROLESECRETKEY

var roleSecretProvider = RTM.roleSecretAuthProvider(role, roleSecretKey);

var rtm = new RTM(endpoint, appkey, {
  authProvider: roleSecretProvider,
});

rtm.start();

var socket = require('socket.io-client')('ws://streaming.plenar.io?' +
    'network=array_of_things_chicago');

socket.on('data', function (e) {
        console.log(e);
        rtm.publish(role, e.attributes, function(pdu) {
          console.log("Publish ack:", pdu);
    });

});

socket.on('internal_error', function (err) {
    console.log(err);
});
