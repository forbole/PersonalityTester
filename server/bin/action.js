"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.download_compute = exports.uploadsToParcel = void 0;
const tslib_1 = require("tslib");
// **this should be a server side script**
/* Set up environment variable first */
const Parcel = tslib_1.__importStar(require("@oasislabs/parcel-sdk"));
const configParams = Parcel.Config.paramsFromEnv();
const config = new Parcel.Config(configParams);
function uploadsToParcel(address, actual_data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //upload for other people
        console.log(address + " " + actual_data);
        const adminConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
        const adminIdentityAddress = Parcel.Identity.addressFromToken(yield adminConfig.tokenProvider.getToken());
        const adminIdentity = yield Parcel.Identity.connect(adminIdentityAddress, config);
        const endUserConfig = new Parcel.Config({
            apiAccessToken: "AAAAGYHZxhwjJXjnGEIiyDCyZJq+Prknbneb9gYe9teCKrGa",
        });
        const endUserIdentityAddress = new Parcel.Address(address);
        const endUserIndentity = yield Parcel.Identity.connect(endUserIdentityAddress, endUserConfig);
        const datasetMetadata = {
            title: "User's data",
            metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
        };
        const data = new TextEncoder().encode(actual_data);
        console.log('Uploading data for User');
        const dataset = yield Parcel.Dataset.upload(data, datasetMetadata, 
        // The dataset is uploaded for endUser...
        yield Parcel.Identity.connect(endUserIdentityAddress, adminConfig), 
        // ...with admin's credentials being used to do the upload...
        adminConfig, {
            // ...and admin is flagged as the dataset's creator.
            creator: adminIdentity,
        });
        console.log(`Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}\n`);
        const policy = yield Parcel.WhitelistPolicy.create(endUserConfig, endUserIndentity, // The policy creator, and subsequent owner.
        new Parcel.Set([adminIdentity.address]));
        yield dataset.setPolicy(policy);
        console.log(`Created policy with address ${policy.address.hex} and applied it to dataset ${dataset.address.hex}\n`);
        //try to download using admin identity
        /* const datasetToDownload = await Parcel.Dataset.connect(dataset.address, adminIdentity, config);
        
          try {
          console.log(`Attempting to access endUser's data without permission...`);
          await new Promise((resolve, reject) => {
              const decryptedStream = datasetToDownload.download();
              decryptedStream.on('error', reject);
              decryptedStream.on('end', resolve);
          });
          throw new Error('This should not happen.');
        } catch (e) {
          // this is expected
          console.log(`Error: ${e.constructor.name}`);
          console.log("`adminIdentity` was not able to access endUser's data (expected).\n");
          } */
        //should be ok to download
    });
}
exports.uploadsToParcel = uploadsToParcel;
;
//frontend client_id(from config.js)
function download_compute(address, api_Access_token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //whitelist the server to take endUser's config
        const endUserIdentityAddress = new Parcel.Address(address);
        const adminConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
        const adminIdentityAddress = Parcel.Identity.addressFromToken(yield adminConfig.tokenProvider.getToken());
        const adminIdentity = yield Parcel.Identity.connect(adminIdentityAddress, adminConfig);
        //download dataset
        const writestream = "../docker/test_workdir/data/in/intext";
        const streamFinished = require('util').promisify(require('stream').finished);
        let datasetByEnduser = yield Parcel.Dataset.connect(endUserIdentityAddress, adminIdentity, adminConfig);
        try {
            const secretDataStream = datasetByEnduser.download();
            const secretDatasetWriter = secretDataStream.pipe(require('fs').createWriteStream(writestream));
            yield streamFinished(secretDatasetWriter);
            console.log(`\nDataset ${datasetByEnduser.address.hex} has been downloaded to ${writestream}`);
        }
        catch (e) {
            throw new Error(`Failed to download dataset at ${datasetByEnduser.address.hex}`);
        }
        const secretDataByadmin = require('fs').readFileSync(writestream).toString();
        console.log(`Here's the data: ${secretDataByadmin}`);
        //compute
        const jobRequest = {
            name: 'interest_classificaiton',
            dockerImage: 'oasislabs/acme-derma-demo',
            inputDatasets: [{ mountPath: 'intext.txt', address: endUserIdentityAddress },
                { mountPath: 'label.txt', address: endUserIdentityAddress }],
            outputDatasets: [{ mountPath: 'prediction.txt', owner: adminIdentity }],
            cmd: [
                'python3',
                'predict.py',
                '/parcel/data/in/intext.txt',
                '/parcel/data/in/label.txt',
                '/parcel/data/out/prediction.txt',
            ],
        };
        const dispatcher = yield Parcel.Dispatcher.connect(config.dispatcherAddress, adminIdentity, config);
        const jobId = yield dispatcher.submitJob({ job: jobRequest });
        const job = yield dispatcher.getCompletedJobInfo(jobId);
        if (job.status instanceof Parcel.JobCompletionStatus.Success) {
            console.log('Job completed successfully!');
        }
        else {
            console.log('Job failed!', job.info);
        }
        if (job.outputs[0]) {
            const output = yield Parcel.Dataset.connect(job.outputs[0].address, adminIdentity, config);
            output.downloadToPath('/tmp/job_out');
            console.log('Job output stored in /tmp/job_out.');
        }
    });
}
exports.download_compute = download_compute;
