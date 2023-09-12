const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
async function createBooking(data)
{
    return new Promise(function(resolve,reject)
    {
        const result = db.sequelize.transaction(async function bookingImplementation(t)
        {
            console.log(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flight =await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`); // this throws an error but not handled
            const flightData = flight.data;
            console.log(flightData);
            console.log(data.noOfSeats);
            if(data.noOfSeats>flightData.data.totalSeats)
                reject(new AppError('No Enough Seats Available',StatusCodes.BAD_REQUEST));
            resolve(true);
        });
    });
}
module.exports= {
    createBooking
}