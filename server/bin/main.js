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
/* require('dotenv').config();
 */
var action = tslib_1.__importStar(require("./action.js"));
var path = tslib_1.__importStar(require("path"));
var mali_1 = tslib_1.__importDefault(require("mali"));
/* const action = require('./action')
const path = require('path')
const Mali = require('mali') */
var PROTO_PATH = path.resolve(__dirname, './recommend.proto');
var app = new mali_1.default(PROTO_PATH, 'ParcelParser');
/* input stream */
// savedata et the user action stream and save that to parcel
function saveData(call, callback) {
    call.on('data', function (likedpost) {
        if (likedpost.parsePhase != '') {
            console.log(likedpost.parsePhase);
            console.log(likedpost.identity);
            try {
                action.uploads_to_parcel(likedpost.identity, likedpost.parsePhase);
            }
            catch (e) {
                console.error(e);
                throw new Error("Cannot upload!");
            }
        }
    });
    call.on('end', function () {
        callback(null, { msg: "message received!" });
    });
}
/* output stream */
function getRecommended(call, callback) {
    if (callback === void 0) { callback = function () { }; }
    var str;
    try {
        str = action.download_and_compute(call.request.identity);
        call.write(str);
    }
    catch (e) {
        console.error(e);
        throw new Error("Cannot download!");
    }
    call.end();
}
function main() {
    app.use({ saveData: saveData, getRecommended: getRecommended });
    console.log("Yeah you made it!");
    app.start('127.0.0.1:50051');
}
main();
