import {upload,get_recommendaton} from './clicks.js';

const bobIdentityAddress = "0xddbe5ae7e8bf58f24f8253fe9d3473392c61a8f1";

function testUpload(){
    upload("Always looking at the bright side of life",bobIdentityAddress)
}

function testRecommendation(){
    get_recommendaton(bobIdentityAddress)
}

function main(){
    testUpload();
    testRecommendation();
}

main()