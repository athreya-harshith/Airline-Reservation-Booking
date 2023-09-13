const axios = require('axios');
const {BookingRepository} = require('../repositories');
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const bookingRepository = new BookingRepository();
const {Enums} = require('../utils/common');
const {INITIATED,PENDING,BOOKED,CANCELLED} = Enums.BOOKING_STATUS;
async function createBooking(data)
{
    const transaction = await db.sequelize.transaction();// unmanaged transaction
    try {
            const flight =await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`); // this throws an error but not handled
            const flightData = flight.data;
            console.log(flightData);
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
                // this is the request body sent through the patch using axios
            });
            await transaction.commit();
            return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data)
{
    //data : {bookingId,flightId,userId}
    //this rollsback if the time expired
    const transaction = await db.sequelize.transaction();
    console.log('inside makePayment Service')
    let explanation = [];
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            throw new AppError('Booking Has Expired',StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime-bookingTime > 300000)
        {
            // if the time is above 5mins (300000 ms ) updated the booking status to cancelled and throw a error
            await cancelBooking(data.bookingId);
            throw new AppError('Booking Has Expired',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost != data.totalCost && bookingDetails.userId != data.userId)
        {
            explanation.push('The amount of payment doesnot match');
            explanation.push('The user corresponding to the booking doesnot match');
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        } 
        else if(bookingDetails.totalCost != data.totalCost)
        {
            explanation.push('The amount of payment doesnot match')
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        else if(bookingDetails.userId != data.userId)
        {
            explanation.push('The user corresponding to the booking doesnot match')
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
           
        // now payment is successfull
        //now change the status of booking from INITIATED to BOOKED
        const response = await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);
        await transaction.commit();
    } catch (error) {
        // console.log(error);
        await transaction.rollback();
        throw error;
    }
}
async function cancelBooking(bookingId)
{
    //this transaction always commits 
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId,transaction);
        if(bookingDetails.status == CANCELLED)
        {
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats:bookingDetails.noOfSeats,
            decrease:0
            // this is the request body sent through the patch using axios
        });
        await bookingRepository.update(bookingId,{status:CANCELLED},transaction);
        transaction.commit();
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}
async function cancelOldBookings()
{
    console.log('in services cancelOldBookings');
    try {
        const time = new Date(Date.now() - 1000*300);//time if 5mins ago
        const response = await bookingRepository.cancelOldBookings(time);
        console.log('Modified Number of Records using Crons : ',response);
        return response;
    } catch (error) {
        console.log(error);
    }
}
module.exports= {
    createBooking,
    makePayment,
    cancelOldBookings
}