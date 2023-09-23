const CRONS = require('./utils/common/cron-jobs');
const express = require('express');

// in the below line object destructuring happens and the PORT is a constant that hold the value of the key : value pair PORT:process.env.PORT
const {ServerConfig,Logger,MessageQueue} = require('./config');// no need for './config/index' it automatically pics index.js

const app = express();
const apiRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
//both above are for reading requests that has request body
app.use('/api',apiRoutes);//starting point for all the api routes
// app.use('/bookingService/api',apiRoutes); // this is commented because , pathRewrite object in the API gateway rewrites the path
app.listen(ServerConfig.PORT,async ()=>{
    console.log(`Server is up and running on the port ${ServerConfig.PORT}`);
    // Logger.info({message:'some logging is begin done',error:"some error caught",label :'some label according to us'});
    CRONS();
    await MessageQueue.connectQueue();
    console.log('queue connected');
});

