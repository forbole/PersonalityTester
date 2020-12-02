"use strict";
/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
var action = tslib_1.__importStar(require("./action"));
var path = tslib_1.__importStar(require("path"));
var grpc = require('grpc');
/* const action = require('./action')
const path = require('path')
const Mali = require('mali') */
var __dirname = "/Users/apple/Forbole/parcel-examples/account-linking/server/src";
var PROTO_PATH = path.resolve(__dirname, './recommend.proto');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
var routeguide = grpc.loadPackageDefinition(packageDefinition).routeguide;
/* input stream */
// savedata et the user action stream and save that to parcel
function saveData(call, callback) {
    var outputstr;
    var likedpost = call.request;
    if (likedpost.parsePhase != '') {
        console.log(likedpost.parsePhase);
        console.log(likedpost.identity);
        try {
            outputstr = action.uploads(likedpost.identity, likedpost.parsePhase);
        }
        catch (e) {
            console.error(e);
            throw new Error("Cannot upload!");
        }
    }
    callback(null, { msg: outputstr });
}
/* output stream */
function getRecommended(call, callback) {
    var str;
    try {
        str = action.compute(call.request.identity);
        callback(null, { msg: str });
    }
    catch (e) {
        console.error(e);
        throw new Error("Cannot download!");
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
