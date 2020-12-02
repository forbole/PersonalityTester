import protoLoader from '@grpc/proto-loader';
import grpc from 'grpc';

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

/**
 * 
 * @param {*} address User identity address
 * @param {*} callback funciton that take a string as arg
 */
function GetRecommended(address,callback) {
    var userInfo = {
        identity: address
    }
    function getRecommendCallback(err,words){
        if (err){
            callback(err)
            return
        }
        callback(words.word)
        console.log(words.word)
    }
    client.GetRecommended(userInfo,getRecommendCallback)
}

/**
 * 
 * @param {*} address User Identity Address
 * @param {*} parsePhase The words that need to be stored
 * @param {*} callback a function that take a string as arg
 */
function SaveData(address,parsePhase,callback) {
    var parsephase = {
        parsePhase: parsePhase,
        identity: address
    }

    function TestSaveDataCallback(err,words){
        if (err){
            callback(error)
            return
        }
        callback(words.msg)
        console.log(words.msg)
    }

    client.SaveData(parsephase,TestSaveDataCallback)
    
}

export{
    SaveData,
    GetRecommended,
}

