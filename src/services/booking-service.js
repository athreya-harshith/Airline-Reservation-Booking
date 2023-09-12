const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const bookingRepository = new BookingRepository();
async function createBooking(data)
{
    const transaction = await db.sequelize.transaction();
    try {
            // console.log(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flight =await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`); // this throws an error but not handled
            const flightData = flight.data;
            console.log(flightData);
            // console.log(data.noOfSeats);
            if(data.noOfSeats>flightData.data.totalSeats)
                throw new AppError('No Enough Seats Available',StatusCodes.BAD_REQUEST) ;
            // the noOfSeats is requested is less than or equal to the total Remaining Seats
            const totalBillingAmount = data.noOfSeats * flightData.data.price;
            console.log(totalBillingAmount);
            const bookingPayload = {...data,totalCost:totalBillingAmount};
             //after computing the total cost ,now create a booking
            const booking = await bookingRepository.createBooking(bookingPayload,transaction); // this booking will be in INITIATED state
            // after booking now reserve the seats using the flights service
            // /api/v1/flights/:id/seats PATCH
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
                seats:data.noOfSeats
                // this is the request body sent through the patch
            });
            await transaction.commit();
            return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
module.exports= {
    createBooking
}