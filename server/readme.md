# NLP processing with Parcel SDK

To Run the server, ensure you have npm and nodejs installed on your machine and run:

`
npm install
npm build
node src/main.js
`

## Recommendation 

Clone the model from github and put that to ./server/docker/test_workdir

`
cd ./server/docker/test_workdir
git clone https://github.com/patil-suraj/distillbart-mnli.git
`


### Run docker!

To test docker is install correctly, run :
`
docker run \  -v $PWD/test_workdir:/predict/test \
   appleno0610/testlabel:latest \
  /usr/bin/python3 compute.py /predict/test/data/in/intext.txt /predict/test/data/in/label.txt /predict/test/data/out/out.txt /predict/test/distilbart-mnli-12-1

`