const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services');
const {SuccessResponse,ErrorResponse} = require('../utils/common')
async function createBooking(req,res)
{
    try {
        const response = await BookingService.createBooking(
            {
                flightId:req.body.flightId,
                userId:req.body.userId,
                noOfSeats:req.body.noOfSeats
            }
        );
        console.log('response in controller',response);
        SuccessResponse.message = 'Successfully Obtained the flight'
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = 'Unable to perform the requested action , failed to get the flight';
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function makePayment(req,res)
{
    try {
        console.log('inside makeyPayment Controller')
        const response = await BookingService.makePayment(
            {
                bookingId:req.body.bookingId,
                userId:req.body.userId,
                totalCost:req.body.totalCost
            }
        );
        SuccessResponse.message = 'Successfully Completed the payment'
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = 'Unable to perform the requested action , Payment Failed';
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
module.exports = {
    createBooking,
    makePayment
};