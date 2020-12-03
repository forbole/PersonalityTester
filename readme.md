# NLP processing with Parcel SDK

Everyone want to get recommended feed on social media, but no one want to let people know their activies.

This would ensure the privacy of the activies of user on social media as well as doing recommendation. The user may know what data is used for analysis in the [Steward App](https://steward.oasiscloud.io/).

The user will send the metadata about their actions on blogposts to Parcel. The activities would possibility include "like", "comment" or post, depends on use cases. Parcel SDK will pull all of the user data and use a Parcel Script to analyse that. The users can view their own statistics and doing a little "personality test" base on their statistics. 

## Run Server
To Run the server, ensure you have npm and nodejs installed on your machine and run:

`
npm run build
npm start
`
"type":"Modules" must not include in "package.json"
## Server Testing
To test the functionality,set up the server and run below:
`
ts-node test/test.js
`
Watch [steward](https://steward.oasiscloud.io/) for data usage. You can also watch output in the server debug console.
"type":"Modules" must include in "package.json"

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

docker run \  -v $PWD/test_workdir:/predict/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /predict/test/data/in/intext.txt /predict/test/data/in/label.txt /predict/test/data/out/out.txt /predict/test/distilbart-mnli-12-1
`