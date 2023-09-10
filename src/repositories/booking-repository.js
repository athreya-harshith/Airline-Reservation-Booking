const {StatusCodes} = require('http-status-codes');
const {Booking} = require('../models');
const CrudRepository = require('./crud-repository');
class BookingRepository extends CrudRepository
{
    constructor(Booking)
    {
        super(Booking);
    }
}

module.exports = BookingRepository;