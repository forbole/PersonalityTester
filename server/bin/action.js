"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.download_and_compute = exports.uploads_to_parcel = void 0;
var tslib_1 = require("tslib");
var Parcel = tslib_1.__importStar(require("@oasislabs/parcel-sdk"));
require('dotenv').config("../.env");
var fs_1 = require("fs");
//https://steward.oasiscloud.io/apps/c9d5fe98-b4d7-4b46-850f-b7ceed7e6bed/join
var configParams = Parcel.Config.paramsFromEnv();
var config = new Parcel.Config(configParams);
function uploads_to_parcel(address, parsephase) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var aliceConfig, aliceIdentityAddress, _a, _b, aliceIdentity, bobIdentityAddress, datasetMetadata, data, dataset, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
                    _b = (_a = Parcel.Identity).addressFromToken;
                    return [4 /*yield*/, aliceConfig.tokenProvider.getToken()];
                case 1:
                    aliceIdentityAddress = _b.apply(_a, [_f.sent()]);
                    return [4 /*yield*/, Parcel.Identity.connect(aliceIdentityAddress, config)];
                case 2:
                    aliceIdentity = _f.sent();
                    bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
                    datasetMetadata = {
                        title: "What you read?",
                        metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
                    };
                    data = new TextEncoder().encode('The weather will be sunny tomorrow');
                    console.log('Uploading data for Bob');
                    _d = (_c = Parcel.Dataset).upload;
                    _e = [data,
                        datasetMetadata];
                    // The dataset is uploaded for Bob...
                    return [4 /*yield*/, Parcel.Identity.connect(bobIdentityAddress, aliceConfig)];
                case 3: return [4 /*yield*/, _d.apply(_c, _e.concat([
                        // The dataset is uploaded for Bob...
                        _f.sent(), 
                        // ...with Alice's credentials being used to do the upload...
                        aliceConfig,
                        {
                            // ...and Alice is flagged as the dataset's creator.
                            creator: aliceIdentity,
                        }]))];
                case 4:
                    dataset = _f.sent();
                    console.log("Created dataset with address " + dataset.address.hex + " and uploaded to " + dataset.metadata.dataUrl + "\n");
                    return [2 /*return*/];
            }
        });
    });
}
exports.uploads_to_parcel = uploads_to_parcel;
function download_and_compute(identity) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dataset, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, download(identity)];
                case 1:
                    dataset = _a.sent();
                    result = compute(dataset);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.download_and_compute = download_and_compute;
function download(identity) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var aliceConfig, aliceIdentityAddress, _a, _b, aliceIdentity, bobIdentityAddress, datasetByAlice, streamFinished, writeFile, secretDataStream, secretDatasetWriter, e_1, secretDataByAlice;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
                    _b = (_a = Parcel.Identity).addressFromToken;
                    return [4 /*yield*/, aliceConfig.tokenProvider.getToken()];
                case 1:
                    aliceIdentityAddress = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, Parcel.Identity.connect(aliceIdentityAddress, config)];
                case 2:
                    aliceIdentity = _c.sent();
                    bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
                    return [4 /*yield*/, Parcel.Dataset.connect(bobIdentityAddress, aliceIdentity, aliceConfig)];
                case 3:
                    datasetByAlice = _c.sent();
                    streamFinished = require('util').promisify(require('stream').finished);
                    writeFile = '../docker/test_workdir/data/in';
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    secretDataStream = datasetByAlice.download();
                    secretDatasetWriter = secretDataStream.pipe(require('fs').createWriteStream(writeFile));
                    return [4 /*yield*/, streamFinished(secretDatasetWriter)];
                case 5:
                    _c.sent();
                    console.log("\nDataset " + datasetByAlice.address.hex + " has been downloaded to " + writeFile);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _c.sent();
                    throw new Error("Failed to download dataset at " + datasetByAlice.address.hex);
                case 7:
                    secretDataByAlice = require('fs').readFileSync(writeFile).toString();
                    console.log("Here's the data: " + secretDataByAlice);
                    return [2 /*return*/, secretDataByAlice];
            }
        });
    });
}
/* docker run \  -v $PWD/test_workdir:/predict/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /predict/test/data/in/intext.txt /predict/test/data/in/label.txt /predict/test/data/out/out.txt /predict/test/distilbart-mnli-12-1 */
function compute(dataset) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var aliceConfig, aliceIdentityAddress, _a, _b, aliceIdentity, dispatcher, jobRequest, jobId, job, result;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
                    _b = (_a = Parcel.Identity).addressFromToken;
                    return [4 /*yield*/, aliceConfig.tokenProvider.getToken()];
                case 1:
                    aliceIdentityAddress = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, Parcel.Identity.connect(aliceIdentityAddress, config)];
                case 2:
                    aliceIdentity = _c.sent();
                    return [4 /*yield*/, Parcel.Dispatcher.connect(config.dispatcherAddress, aliceIdentity, config)];
                case 3:
                    dispatcher = _c.sent();
                    jobRequest = {
                        name: 'social-media-personality-classification',
                        dockerImage: 'appleno0610/testlabel:latest',
                        inputDatasets: [{ mountPath: 'intext.txt', address: dataset.address }],
                        outputDatasets: [{ mountPath: 'out.txt', owner: aliceIdentity }],
                        cmd: [
                            '/usr/bin/python3',
                            'compute.py',
                            '/predict/test/data/in/intext.txt',
                            '/predict/test/data/in/label.txt',
                            '/predict/test/data/out/out.txt',
                            '/predict/test/distilbart-mnli-12-1',
                        ]
                    };
                    return [4 /*yield*/, dispatcher.submitJob({ job: jobRequest })];
                case 4:
                    jobId = _c.sent();
                    // #endregion snippet-submit-job
                    console.log("Job " + Parcel.utils.encodeHex(jobId) + " submitted.");
                    return [4 /*yield*/, dispatcher.getCompletedJobInfo(jobId)];
                case 5:
                    job = _c.sent();
                    if (job.status instanceof Parcel.JobCompletionStatus.Success) {
                        console.log('Job completed successfully!');
                    }
                    else {
                        console.log('Job failed!', job.info);
                    }
                    try {
                        result = fs_1.readFileSync("./docker/test_workdir/data/out/out.txt", 'utf8');
                    }
                    catch (e) {
                        console.log('CANNOT READ FILE', job.info);
                        result = 'CANNOT READ FILE';
                    }
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, download("123")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return console.log('All done!'); })
    .catch(function (err) {
    console.log("Error in main(): " + (err.stack || JSON.stringify(err)));
    process.exitCode = 1;
});
