# NLP processing with Parcel SDK

Everyone want to get recommended feed on social media. To get recommended, user activities will be analysed to the  but no one want to let people know their activies.

This would ensure the privacy of the activies of user on social media as well as doing recommendation. The user may know what data is used for analysis in the [Steward App](https://steward.oasiscloud.io/).

The user will send the metadata about their actions on blogposts to Parcel. The activities would possibility include "like", "comment" or post, depends on use cases. Parcel SDK will pull all of the user data and use a Parcel Script to analyse that. The users can view their own statistics and doing a little "personality test" base on their statistics. 

## Demo link 
[Watch Demo](https://www.youtube.com/watch?v=W19jDXtHx0c)

## Run Server
To Run the server, ensure you have npm and nodejs installed on your machine and run:

`
npm run build

npm run serve
`

"type":"Modules" must not include in "package.json"
## Server Testing
To test the functionality,set up the server and run below:
`
node test/test.js
`

Watch [steward](https://steward.oasiscloud.io/) for data usage. You can also watch output in the server debug console.
"type":"Modules" must include in "package.json"

You should see the output on server debug console below:

`
This is a test!
0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1
Uploading data for Bob
Job 0xd638b5d264e8213ec9271df17e21ae2deb542e3d166846cab0a1fd4c76be1c95 submitted.
Created dataset with address [object Object] and uploaded to parcel://824d3f53-2d77-4f38-a51f-83983bdcfd97

Job completed successfully!
Job output stored in ./job_out.
You are interest in technology!
`
## Recommendation 
Clone the model from github and put that to ./server/docker/test_workdir

`
cd ./server/docker/test_workdir
git clone https://github.com/patil-suraj/distillbart-mnli.git
`

### Run docker!

To test docker is install correctly, run:
`
cd docker

docker run \  -v $PWD/test_workdir:/parcel/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /parcel/test/data/in/intext.txt /parcel/test/data/out/out.txt 
`

## Known issue
gRPC is not compiling. Therefore, instead of the front end client, you should test the server for the Parcel SDK functionality.
