import * as Parcel from '@oasislabs/parcel-sdk';
require('dotenv').config("../.env");

//https://steward.oasiscloud.io/apps/c9d5fe98-b4d7-4b46-850f-b7ceed7e6bed/join
const configParams = Parcel.Config.paramsFromEnv();
const config = new Parcel.Config(configParams);



async function uploads_to_parcel(address,parsephase) {
  const aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
  const aliceIdentityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken(),
  );
  const aliceIdentity = await Parcel.Identity.connect(aliceIdentityAddress, config);

  //need to get grant from steward app first
  //const bobIdentityAddress = new Parcel.Address(address);
  const bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");


  const datasetMetadata = {
    title: "What you read?",
    metadataUrl: 'http://s3-us-west-2.amazonaws.com/my_first_metadata.json',
  }

  //const data =new TextEncoder().encode(parsephase)
  const data = new TextEncoder().encode('The weather will be sunny tomorrow')
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
    `Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}\n`,
  );
}

async function download(identity) {
  const aliceConfig = new Parcel.Config(Parcel.Config.paramsFromEnv());
  const aliceIdentityAddress = Parcel.Identity.addressFromToken(
    await aliceConfig.tokenProvider.getToken(),
  );
  const aliceIdentity = await Parcel.Identity.connect(aliceIdentityAddress, config);

  //const bobIdentityAddress = new Parcel.Address(identity);
  const bobIdentityAddress = new Parcel.Address("0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1");
  var datasetByAlice = await Parcel.Dataset.connect(bobIdentityAddress, aliceIdentity, aliceConfig);
  const streamFinished = require('util').promisify(require('stream').finished);
  const writeFile = '../docker/test_workdir/data/in'
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
const secretDataByAlice = require('fs').readFileSync(writeFile).toString();
console.log(`Here's the data: ${secretDataByAlice}`);
}

export {
  uploads_to_parcel,
  download,
}

async function main() {
  await download("123")
}

main()
    .then(() => console.log('All done!'))
    .catch((err) => {
        console.log(`Error in main(): ${err.stack || JSON.stringify(err)}`);
        process.exitCode = 1;
    });