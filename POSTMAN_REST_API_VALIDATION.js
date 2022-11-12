# -*- coding: utf-8 -*-
"""
Created on  13th, Feb 2020
@author: Akram Sheriff
AWS IOT Cloud Architecture Diagram with different components in IOT Cloud  Data lake implementation".
SMART  CITY  PARKING IOT USECASE
"""
console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
var table = "iotCatalog";
//var table = "Parking_State";
exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));

   var params = {
    TableName:table,
    Key:{
        "serialNumber": event.serialNumber,
        "clientId": event.clientId,
     //    "location": event.location,
     //     "timestamp": event.timestamp,
    //    "Occupancy_state": event.Occupancy_state,
     //   "activationCode": event.activationCode
        }
    };

    console.log("Gettings Parking IoT device details & current occupancy state of Sensor");
    dynamo.get(params, function(err, data) {
    if (err) {
        console.error("Unable to get Parking Sensor device details from DB. Error JSON:", JSON.stringify(err, null, 2));
        context.fail();
    } else {
        console.log("Parking Sensor data:", JSON.stringify(data, null, 2));
        
        // Logic for  Identifying the closest Parking Sensor  to the Car & also to check if that Parking Sensor is Occupied or not currently 
        console.log(data.Item.activationCode);
        //var distance = 
        console.log(data.Item.Occupancy_state);
        console.log("event code location is " , JSON.stringify(event.car_location));
        if (data.Item.activationCode == event.activationCode && (data.Item.Occupancy_state != false ) ){
            console.log("This Parking spot is un-occupied, Proceed to assigner Car owner e-mail address and update the Parking space allotment slot");
            console.log('Activate the parking sensor and send email to the car owner about this allotment');
            var params = {
                TableName:table,
                Key:{
                    "serialNumber": event.serialNumber,
                    "clientId": event.clientId,
                },
                UpdateExpression: "set email = :val1, activated = :val2",
                ExpressionAttributeValues:{
                    ":val1": event.email,
                    ":val2": "true"
                },
                ReturnValues:"UPDATED\_NEW"
            };
            dynamo.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    context.fail();
                } else {
                    console.log("Parking Sensor Device is now active!", JSON.stringify(data, null, 2));
                    context.succeed("Car is alloted with the Parking Sensor at Location: !");
                }
            });
        } else {
            context.fail("Activation Code Invalid");
        }
    }
});
}
