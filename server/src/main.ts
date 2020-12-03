/**
 * MUST NOT include "type":"module" in package.json
 */
import dotenv from 'dotenv'
dotenv.config()
import * as action from './action'
import * as path from 'path'
var grpc = require('grpc');

var __dirname = "/Users/apple/Forbole/parcel-examples/account-linking/server/src"
const PROTO_PATH = path.resolve(__dirname, './recommend.proto');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;

/**
 * Save the data to Parcel
 * @param call Datastream {parsePhase, identity} 
 * @param callback (error,{msg})
 */
function saveData(call, callback) {
    var outputstr;
    var likedpost = call.request
    if (likedpost.parsePhase != '') {
        console.log(likedpost.parsePhase);
        console.log(likedpost.identity);
        try {
            outputstr = action.uploads(likedpost.identity, likedpost.parsePhase)
        } catch (e) {
            console.error(e)
            throw new Error("Cannot upload!")
        }
    }
    callback(null, { msg: outputstr });
}

/**
 * 
 * @param call UserInfo{identity} user identity address
 * @param callback (error,Words{word})
 */
function getRecommended(call, callback) {
     var str;
    try {
        str = action.compute(call.request.identity)
        callback(null,{msg:str})
    } catch (e) {
        console.error(e)
        throw new Error("Cannot download!")
    }
}

function getServer() {
    var server = new grpc.Server();
    server.addProtoService(routeguide.RouteGuide.service, {
        saveData: saveData,
        getRecommended: getRecommended,
    });
    return server;
  }

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var routeServer = getServer();
    //which port?
    routeServer.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    //node ./dynamic_codegen/route_guide/route_guide_server.js --db_path=./dynamic_codegen/route_guide/route_guide_db.json

    routeServer.start();
}

exports.getServer = getServer;
