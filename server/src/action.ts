import * as Parcel from '@oasislabs/parcel-sdk';
require('dotenv').config("../.env");
import {readFileSync} from 'fs'

//https://steward.oasiscloud.io/apps/c9d5fe98-b4d7-4b46-850f-b7ceed7e6bed/join
const configParams = Parcel.Config.paramsFromEnv();
const config = new Parcel.Config(configParams);



async function uploads(address,parsephase) {
  const aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
  const aliceIdentityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken(),
  );
  const aliceIdentity = await Parcel.Identity.connect(aliceIdentityAddress, config);

  //need to get grant from steward app first
  const bobIdentityAddress = new Parcel.Address(address);
  //const bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");


  const datasetMetadata = {
    title: "What you read?",
    metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
  }

  const data =new TextEncoder().encode(parsephase)
  //const data = new TextEncoder().encode('The weather will be sunny tomorrow')
  console.log('Uploading data for Bob');
  const dataset = await Parcel.Dataset.upload(
    data,
    datasetMetadata,
    // The dataset is uploaded for Bob...
    await Parcel.Identity.connect(bobIdentityAddress, aliceConfig),
    // ...with Alice's credentials being used to do the upload...
    aliceConfig,
    {
      // ...and Alice is flagged as the dataset's creator.
      creator: aliceIdentity,
    },
  );

  console.log(
    `Created dataset with address ${dataset.address} and uploaded to ${dataset.metadata.dataUrl}\n`,
  );

  return dataset.address
}

async function download(identity="0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1",writeFile='./docker/test_workdir/data/in/intext.txt') {
  const aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
  const aliceIdentityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken(),
  );
  const aliceIdentity = await Parcel.Identity.connect(aliceIdentityAddress, config);
  //get all identity address
  const bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
  const bobIdentity = await Parcel.Identity.connect(bobIdentityAddress,aliceConfig);
  const bobDatasets = await bobIdentity.getOwnedDatasets();
  var datasets = aliceIdentity.getOwnedDatasets();
  //const writeFile = '../docker/test_workdir/data/in';

    bobDatasets.forEach(
      async function (value) {
        var datasetByAlice = await Parcel.Dataset.connect(value.address, aliceIdentity, aliceConfig);
        const streamFinished = require('util').promisify(require('stream').finished);
        try {
          const secretDataStream = datasetByAlice.download();
      
          const secretDatasetWriter = secretDataStream.pipe(
          require('fs').createWriteStream(writeFile),
          );
        await streamFinished(secretDatasetWriter);
        console.log(
          `\nDataset ${datasetByAlice.address.hex} has been downloaded to ${writeFile}`,
        );
        } catch (e) {
      throw new Error(`Failed to download dataset at ${datasetByAlice.address.hex}`);
    }
      }
  )
    
const secretDataByAlice = require('fs').readFileSync(writeFile).toString();
  console.log(`Here's the data: ${secretDataByAlice}`);
  return secretDataByAlice;
}
/* docker run \  -v $PWD/test_workdir:/predict/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /predict/test/data/in/intext.txt /predict/test/data/in/label.txt /predict/test/data/out/out.txt /predict/test/distilbart-mnli-12-1 */

/* 
This function get the latest entry of the user dataset and return the personality test
@param user identity address (string)
@return result 
*/
async function compute(address) {
  const aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
  const aliceIdentityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken(),
  );
  const aliceIdentity = await Parcel.Identity.connect(aliceIdentityAddress, config);
  const dispatcher = await Parcel.Dispatcher.connect(config.dispatcherAddress, aliceIdentity, config);
  
  const bobIdentityAddress = new Parcel.Address(address);
  //const bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
  const bobIdentity = await Parcel.Identity.connect(bobIdentityAddress,aliceConfig);
  const bobDatasets = await bobIdentity.getOwnedDatasets();
  const dataset = bobDatasets.pop();

  const jobRequest = {
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
  }

  const jobId = await dispatcher.submitJob({ job: jobRequest });
    // #endregion snippet-submit-job
    console.log(`Job ${Parcel.utils.encodeHex(jobId)} submitted.`);

    // Wait for job completion.
    const job = await dispatcher.getCompletedJobInfo(jobId);
    if (job.status instanceof Parcel.JobCompletionStatus.Success) {
        console.log('Job completed successfully!');
    } else {
        console.log('Job failed!', job.info);
    }
  
    if (job.outputs[0]) {
      const output = await Parcel.Dataset.connect(job.outputs[0].address, aliceIdentity, aliceConfig);
      await output.downloadToPath('./job_out');
      console.log('Job output stored in ./job_out.');
  }
  
  try {
    var result = readFileSync('./job_out', 'utf8');
  } catch (e) {
    console.log('CANNOT READ FILE');
    result = 'CANNOT READ FILE'
  }
    console.log(result);
    return result;
}


export {
  uploads,
  download,
  compute,
}

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