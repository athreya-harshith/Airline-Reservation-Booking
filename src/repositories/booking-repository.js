const {StatusCodes} = require('http-status-codes');
const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');
const {Op} = require('sequelize');
const {Enums} = require('../utils/common');
const {INITIATED,PENDING,BOOKED,CANCELLED} = Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository
{
    constructor(Booking)
    {
        super(Booking);
    }

    async createBooking(data,transaction)
    {
        const response = await Booking.create(data,transaction);
        return response;
    }

    async get(data,transaction)
    {
        const response = await Booking.findByPk(data,{transaction:transaction});
        if(!response)
            throw new AppError('Not Able to find the resource',StatusCodes.NOT_FOUND);
        return response;
    }

    async update(id,data,transaction)
    {
        const response = await Booking.update(data,{
            where:{
                id:id
            }
        },{transaction:transaction});
        if(!(response[0]))// because it gives the data as an array 
            throw new AppError('Requested Resource not found to update',StatusCodes.NOT_FOUND);
        return response;
    }
    async  cancelOldBookings(timestamp)
    {
        console.log('in repository cancelOldBookings')
        const response = await Booking.update({
            status:CANCELLED
        },
        {
            where:{
                [Op.and]:[{
                    createdAt:{
                        [Op.lt]:timestamp
                    }
                },
                {
                    status:{
                        [Op.ne]:BOOKED
                    }
                },
                {
                    status:{
                        [Op.ne]:CANCELLED
                    }
                }
            ]
            }
        });
    return response;
    }
}

module.exports = BookingRepository;