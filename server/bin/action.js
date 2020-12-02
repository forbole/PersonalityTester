"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compute = exports.download = exports.uploads = void 0;
var tslib_1 = require("tslib");
var Parcel = tslib_1.__importStar(require("@oasislabs/parcel-sdk"));
require('dotenv').config("../.env");
var fs_1 = require("fs");
//https://steward.oasiscloud.io/apps/c9d5fe98-b4d7-4b46-850f-b7ceed7e6bed/join
var configParams = Parcel.Config.paramsFromEnv();
var config = new Parcel.Config(configParams);
function uploads(address, parsephase) {
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
                    bobIdentityAddress = new Parcel.Address(address);
                    datasetMetadata = {
                        title: "What you read?",
                        metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
                    };
                    data = new TextEncoder().encode(parsephase);
                    //const data = new TextEncoder().encode('The weather will be sunny tomorrow')
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
                    console.log("Created dataset with address " + dataset.address + " and uploaded to " + dataset.metadata.dataUrl + "\n");
                    return [2 /*return*/, dataset.address];
            }
        });
    });
}
exports.uploads = uploads;
function download(identity, writeFile) {
    if (identity === void 0) { identity = "0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1"; }
    if (writeFile === void 0) { writeFile = './docker/test_workdir/data/in/intext.txt'; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var aliceConfig, aliceIdentityAddress, _a, _b, aliceIdentity, bobIdentityAddress, bobIdentity, bobDatasets, datasets, secretDataByAlice;
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
                    return [4 /*yield*/, Parcel.Identity.connect(bobIdentityAddress, aliceConfig)];
                case 3:
                    bobIdentity = _c.sent();
                    return [4 /*yield*/, bobIdentity.getOwnedDatasets()];
                case 4:
                    bobDatasets = _c.sent();
                    datasets = aliceIdentity.getOwnedDatasets();
                    //const writeFile = '../docker/test_workdir/data/in';
                    bobDatasets.forEach(function (value) {
                        return tslib_1.__awaiter(this, void 0, void 0, function () {
                            var datasetByAlice, streamFinished, secretDataStream, secretDatasetWriter, e_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Parcel.Dataset.connect(value.address, aliceIdentity, aliceConfig)];
                                    case 1:
                                        datasetByAlice = _a.sent();
                                        streamFinished = require('util').promisify(require('stream').finished);
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        secretDataStream = datasetByAlice.download();
                                        secretDatasetWriter = secretDataStream.pipe(require('fs').createWriteStream(writeFile));
                                        return [4 /*yield*/, streamFinished(secretDatasetWriter)];
                                    case 3:
                                        _a.sent();
                                        console.log("\nDataset " + datasetByAlice.address.hex + " has been downloaded to " + writeFile);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_1 = _a.sent();
                                        throw new Error("Failed to download dataset at " + datasetByAlice.address.hex);
                                    case 5: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    secretDataByAlice = require('fs').readFileSync(writeFile).toString();
                    console.log("Here's the data: " + secretDataByAlice);
                    return [2 /*return*/, secretDataByAlice];
            }
        });
    });
}
exports.download = download;
/* docker run \  -v $PWD/test_workdir:/predict/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /predict/test/data/in/intext.txt /predict/test/data/in/label.txt /predict/test/data/out/out.txt /predict/test/distilbart-mnli-12-1 */
/*
This function get the latest entry of the user dataset and return the personality test
@param user identity address (string)
@return result
*/
function compute(address) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var aliceConfig, aliceIdentityAddress, _a, _b, aliceIdentity, dispatcher, bobIdentityAddress, bobIdentity, bobDatasets, dataset, jobRequest, jobId, job, output, result;
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
                    bobIdentityAddress = new Parcel.Address(address);
                    return [4 /*yield*/, Parcel.Identity.connect(bobIdentityAddress, aliceConfig)];
                case 4:
                    bobIdentity = _c.sent();
                    return [4 /*yield*/, bobIdentity.getOwnedDatasets()];
                case 5:
                    bobDatasets = _c.sent();
                    dataset = bobDatasets.pop();
                    jobRequest = {
                        name: 'social-media-personality-classification',
                        dockerImage: 'appleno0610/testlabel:var0.5',
                        inputDatasets: [{ mountPath: 'intext.txt', address: dataset.address }],
                        outputDatasets: [{ mountPath: 'out.txt', owner: bobIdentity }],
                        cmd: [
                            '/usr/bin/python3',
                            'compute.py',
                            '/parcel/data/in/intext.txt',
                            '/parcel/data/out/out.txt',
                        ]
                    };
                    return [4 /*yield*/, dispatcher.submitJob({ job: jobRequest })];
                case 6:
                    jobId = _c.sent();
                    // #endregion snippet-submit-job
                    console.log("Job " + Parcel.utils.encodeHex(jobId) + " submitted.");
                    return [4 /*yield*/, dispatcher.getCompletedJobInfo(jobId)];
                case 7:
                    job = _c.sent();
                    if (job.status instanceof Parcel.JobCompletionStatus.Success) {
                        console.log('Job completed successfully!');
                    }
                    else {
                        console.log('Job failed!', job.info);
                    }
                    if (!job.outputs[0]) return [3 /*break*/, 10];
                    return [4 /*yield*/, Parcel.Dataset.connect(job.outputs[0].address, aliceIdentity, aliceConfig)];
                case 8:
                    output = _c.sent();
                    return [4 /*yield*/, output.downloadToPath('./job_out')];
                case 9:
                    _c.sent();
                    console.log('Job output stored in ./job_out.');
                    _c.label = 10;
                case 10:
                    try {
                        result = fs_1.readFileSync('./job_out', 'utf8');
                    }
                    catch (e) {
                        console.log('CANNOT READ FILE');
                        result = 'CANNOT READ FILE';
                    }
                    console.log(result);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.compute = compute;
/* async function main() {
  console.log("start");
  await compute("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
}

main()
    .then(() => console.log('All done!'))
    .catch((err) => {
        console.log(`Error in main(): ${err.stack || JSON.stringify(err)}`);
        process.exitCode = 1;
    });
 */ 
