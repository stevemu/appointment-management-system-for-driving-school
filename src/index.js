// import {run} from './server';
let server = require("./server");
let {run} = server;
let config = require("./config");


run({
    ...config
});