# -*- coding: utf-8 -*-
"""
Created on  13th, Feb 2020
@author: Akram Sheriff
AWS IOT Cloud Architecture SMART  CITY  PARKING IOT USECASE - Writing  the IOT  Telemetry data in DynamoDB in key, Value pair format  - Function Handler 
Logic
"""

console.log('Loading function');
var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
var table = "iotCatalog";
//var table2 = "Sensor_State";

  
exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
   var params = {
    TableName:table,
    Item:{
        "serialNumber": event.serialNumber,
        "clientId": event.clientId,
        "Occupancy_state": event.Occupancy_state,
        "location": event.location,
        "timestamp": event.timestamp,
        "device": event.device,
        "endpoint": event.endpoint,
        "type": event.type,
        "certificateId": event.certificateId,
        "activationCode": event.activationCode,
        "activated": event.activated,
        "email": event.email
        }
    };

    console.log("Adding a new Parking IoT Sensor into DynamoDB...");
    dynamo.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add parking Sensor. Error JSON:", JSON.stringify(err, null, 2));
            context.fail();
        } else {
            console.log("Added device:", JSON.stringify(data, null, 2));
            context.succeed();
        }
    });
}
