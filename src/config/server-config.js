const dotenv = require('dotenv');// this returns an object 
dotenv.config();//Loads .env file contents into process.env by default.

module.exports = {
    PORT:process.env.PORT,
    FLIGHT_SERVICE:process.env.FLIGHT_SERVICE,
    API_GATEWAY:process.env.API_GATEWAY
};