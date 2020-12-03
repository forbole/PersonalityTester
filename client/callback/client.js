/* import protoLoader from '../node_modules/@grpc/proto-loader';
import grpc from '../node_modules/grpc';
 */
const {Datastream,msg,Words,UserInfo} = require('./recommend_pb.js');
const {RouteGuideClient} = require('./recommend_grpc_web_pb');
//define server to be connected
var echoService = new RouteGuideClient(
    'http://localhost:50051', null, null);

/**
 * 
 * @param {*} address User identity address
 * @param {*} callback funciton that take a string as arg
 */
function GetRecommended(address,callback) {
    function getRecommendCallback(err,words){
        if (err){
            callback(err)
            return
        }
        callback(words.word)
        console.log(words.word)
    }
    var request = new UserInfo();
    request.setIdentity(address)
    echoService.getRecommended(request, {},getRecommendCallback)
}

/**
 * 
 * @param {*} address User Identity Address
 * @param {*} parsePhase The words that need to be stored
 * @param {*} callback a function that take a string as arg
 */
function SaveData(address,parsePhase,callback) {
    function TestSaveDataCallback(err,words){
        if (err){
            callback(err)
            return
        }
        callback(words.msg)
        console.log(words.msg)
    }
    var request = new Datastream()
    request.setParsePhase(parsePhase)
    request.setIdentity(address)
    echoService.saveData(request, {},TestSaveDataCallback)
    
}

export{
    SaveData,
    GetRecommended,
}

