/**
 * MUST include "type":"module" in package.json
 */

import protoLoader from '@grpc/proto-loader';
import grpc from 'grpc';
import async from 'async';

var PROTO_PATH = "/Users/apple/Forbole/parcel-examples/account-linking/server/src/recommend.proto"
//define server to be connected

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;
var client = new routeguide.RouteGuide('0.0.0.0:50051',
                                       grpc.credentials.createInsecure());

function TestGetRecommended(callback) {
    var parsephase = {
        parsePhase: "This is a test!",
        identity: "0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1"
    }

    var userInfo = {
        identity: "0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1"
    }
    var returnStr=""
    function getRecommendCallback(err,words){
        if (err){
            callback(err)
            return
        }
        console.log(words.word)
    }

    client.GetRecommended(userInfo,getRecommendCallback)
    
}

function TestSaveData(callback) {
    var parsephase = {
        parsePhase: "This is a test!",
        identity: "0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1"
    }

    var returnStr=""
    function TestSaveDataCallback(err,words){
        if (err){
            callback(error)
            return
        }
        console.log(words.msg)
    }

    client.SaveData(parsephase,getRecommendCallback)
    call.end();
}

function main() {
    async.series([
        TestGetRecommended,
        TestSaveData,
    ]);
  }
  
main()