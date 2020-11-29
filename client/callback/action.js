"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.download_compute = exports.uploadsToParcel = void 0;
// **this should be a server side script**
/* Set up environment variable first */
var Parcel = require("@oasislabs/parcel-sdk");
var configParams = Parcel.Config.paramsFromEnv();
var config = new Parcel.Config(configParams);
function uploadsToParcel(address, actual_data) {
    return __awaiter(this, void 0, void 0, function () {
        var adminConfig, adminIdentityAddress, _a, _b, adminIdentity, endUserConfig, endUserIdentityAddress, endUserIndentity, datasetMetadata, data, dataset, _c, _d, _e, policy;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    //upload for other people
                    console.log(address + " " + actual_data);
                    adminConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
                    _b = (_a = Parcel.Identity).addressFromToken;
                    return [4 /*yield*/, adminConfig.tokenProvider.getToken()];
                case 1:
                    adminIdentityAddress = _b.apply(_a, [_f.sent()]);
                    return [4 /*yield*/, Parcel.Identity.connect(adminIdentityAddress, config)];
                case 2:
                    adminIdentity = _f.sent();
                    endUserConfig = new Parcel.Config({
                        apiAccessToken: "AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa"
                    });
                    endUserIdentityAddress = new Parcel.Address(address);
                    return [4 /*yield*/, Parcel.Identity.connect(endUserIdentityAddress, endUserConfig)];
                case 3:
                    endUserIndentity = _f.sent();
                    datasetMetadata = {
                        title: "User's data",
                        metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json'
                    };
                    data = new TextEncoder().encode(actual_data);
                    console.log('Uploading data for User');
                    _d = (_c = Parcel.Dataset).upload;
                    _e = [data,
                        datasetMetadata];
                    // The dataset is uploaded for endUser...
                    return [4 /*yield*/, Parcel.Identity.connect(endUserIdentityAddress, adminConfig)];
                case 4: return [4 /*yield*/, _d.apply(_c, _e.concat([
                        // The dataset is uploaded for endUser...
                        _f.sent(), 
                        // ...with admin's credentials being used to do the upload...
                        adminConfig,
                        {
                            // ...and admin is flagged as the dataset's creator.
                            creator: adminIdentity
                        }]))];
                case 5:
                    dataset = _f.sent();
                    console.log("Created dataset with address " + dataset.address.hex + " and uploaded to " + dataset.metadata.dataUrl + "\n");
                    return [4 /*yield*/, Parcel.WhitelistPolicy.create(endUserConfig, endUserIndentity, // The policy creator, and subsequent owner.
                        new Parcel.Set([adminIdentity.address]))];
                case 6:
                    policy = _f.sent();
                    return [4 /*yield*/, dataset.setPolicy(policy)];
                case 7:
                    _f.sent();
                    console.log("Created policy with address " + policy.address.hex + " and applied it to dataset " + dataset.address.hex + "\n");
                    return [2 /*return*/];
            }
        });
    });
}
exports.uploadsToParcel = uploadsToParcel;
;
//frontend client_id(from config.js)
function download_compute(address, api_Access_token, datasets) {
    return __awaiter(this, void 0, void 0, function () {
        var endUserIdentityAddress, endUserConfig, endUserIdentity, adminConfig, adminIdentityAddress, _a, _b, adminIdentity, writestream, streamFinished, datasetByadmin, secretDataStream, secretDatasetWriter, e_1, secretDataByadmin, jobRequest, dispatcher, jobId, job, output;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    endUserIdentityAddress = new Parcel.Address(address);
                    endUserConfig = new Parcel.Config({
                        apiAccessToken: "AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa"
                    });
                    return [4 /*yield*/, Parcel.Identity.connect(endUserIdentityAddress, endUserConfig)];
                case 1:
                    endUserIdentity = _c.sent();
                    adminConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
                    _b = (_a = Parcel.Identity).addressFromToken;
                    return [4 /*yield*/, adminConfig.tokenProvider.getToken()];
                case 2:
                    adminIdentityAddress = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, Parcel.Identity.connect(adminIdentityAddress, config)];
                case 3:
                    adminIdentity = _c.sent();
                    writestream = "../docker/test_workdir/data/in/intext";
                    streamFinished = require('util').promisify(require('stream').finished);
                    return [4 /*yield*/, Parcel.Dataset.connect(endUserIdentityAddress, adminIdentity, adminConfig)];
                case 4:
                    datasetByadmin = _c.sent();
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    secretDataStream = datasetByadmin.download();
                    secretDatasetWriter = secretDataStream.pipe(require('fs').createWriteStream(writestream));
                    return [4 /*yield*/, streamFinished(secretDatasetWriter)];
                case 6:
                    _c.sent();
                    console.log("\nDataset " + datasetByadmin.address.hex + " has been downloaded to " + writestream);
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _c.sent();
                    throw new Error("Failed to download dataset at " + datasetByadmin.address.hex);
                case 8:
                    secretDataByadmin = require('fs').readFileSync(writestream).toString();
                    console.log("Here's the data: " + secretDataByadmin);
                    jobRequest = {
                        name: 'interest_classificaiton',
                        dockerImage: 'oasislabs/acme-derma-demo',
                        inputDatasets: [{ mountPath: 'intext.txt', address: endUserIdentityAddress },
                            { mountPath: 'label.txt', address: endUserIdentityAddress }],
                        outputDatasets: [{ mountPath: 'prediction.txt', owner: endUserIdentity }],
                        cmd: [
                            'python3',
                            'predict.py',
                            '/parcel/data/in/intext.txt',
                            '/parcel/data/in/label.txt',
                            '/parcel/data/out/prediction.txt',
                        ]
                    };
                    return [4 /*yield*/, Parcel.Dispatcher.connect(config.dispatcherAddress, endUserIdentity, config)];
                case 9:
                    dispatcher = _c.sent();
                    return [4 /*yield*/, dispatcher.submitJob({ job: jobRequest })];
                case 10:
                    jobId = _c.sent();
                    return [4 /*yield*/, dispatcher.getCompletedJobInfo(jobId)];
                case 11:
                    job = _c.sent();
                    if (job.status instanceof Parcel.JobCompletionStatus.Success) {
                        console.log('Job completed successfully!');
                    }
                    else {
                        console.log('Job failed!', job.info);
                    }
                    if (!job.outputs[0]) return [3 /*break*/, 13];
                    return [4 /*yield*/, Parcel.Dataset.connect(job.outputs[0].address, endUserIdentity, config)];
                case 12:
                    output = _c.sent();
                    output.downloadToPath('/tmp/job_out');
                    console.log('Job output stored in /tmp/job_out.');
                    _c.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.download_compute = download_compute;
