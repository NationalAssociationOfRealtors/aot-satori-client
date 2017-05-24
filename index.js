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

var Pusher = require('pusher-client');

var pusher = new Pusher(process.env.PLENARIO_KEY, {
  authEndpoint: process.env.PLENARIO_AUTH_ENDPOINT
});

var channel = pusher.subscribe('private-array_of_things_chicago;');

channel.bind('data', function(e) {
  console.log(e);
  rtm.publish(role, JSON.parse(e.message), function(pdu) {
    console.log("Publish ack:", pdu);
  });

});
