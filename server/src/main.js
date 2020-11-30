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
require('dotenv').config();
const action = require('./action')
const path = require('path')
const Mali = require('mali')
const PROTO_PATH = path.resolve(__dirname, './recommend.proto');
const app = new Mali(PROTO_PATH, 'ParcelParser')

/* input stream */
// savedata et the user action stream and save that to parcel
function saveData(call,callback) {
    call.on('data', function (likedpost) {
        if (likedpost.parsePhase != '') {
            console.log(likedpost.parsePhase);
            console.log(likedpost.identity);
             action.uploads_to_parcel(likedpost.identity,likedpost.parsePhase)
         }
    });
    call.on('end', function () {
        callback(null, { msg: "message received!" });
    })
}

/* output stream */
function getRecommended(call,callback) {
     var str = action.download_compute(call.request.identity)
    call.write(str);
    call.end();
}

function main () {
    app.use({saveData, getRecommended })
    console.log("Yeah you made it!")
    app.start('127.0.0.1:50051')
  }
  
  main()