## Booking Service
* This repository consists booking logic thats required to book an Airline

## Models 
* This service consists of the following models.
    * Booking
## Booking Model
* The attributes in the booking model are
  * flightId:Integer
  * userId : Integer
  * status : [INITIATED,PENDING,BOOKED,CANCELLED]
  * noOfSeats : Integer
  * totalCost : Integer
## API-ROUTES (ENDPOINTs)
* This service contains only two API-ROUTES 
  * One for booking
  * Second for payments
* ## Creating a Booking
* To create a booking ,
* `POST` request on **/api/v1/bookings/**
* The request-body should contain the following fields.
```
POST on => localhost:4000/api/v1/bookings
```
* The request body
```
{
    flightId:6
    noOfSeats:10
    userId:4
}
```
* Response from the server 
```json
{
    "success": true,
    "message": "Successfully Obtained the flight",
    "data": {
        "status": "initiated",
        "id": 27,
        "flightId": "6",
        "userId": "4",
        "noOfSeats": "10",
        "totalCost": 22500,
        "updatedAt": "2023-10-10T04:43:02.438Z",
        "createdAt": "2023-10-10T04:43:02.438Z"
    },
    "error": {}
}
```
* When the booking is requested , the  state of booking will be **INITIAL** .
* The user must ensure that he does the payment within **% mins** of the booking initiation.
* Else the booking state turns out to **CANCELLED** from initiated .
* The database snapshot at the time of booking creation.
```
27 | 6 | 4 | initiated | 10 | 22500 | 2023-10-10 04:43:02 | 2023-10-10 04:43:02 |
```
* All the above operations will be done as a single transaction.

* ## Making Payment
* To make Payment no public API's are used.
* The playment must be completed within 5mis of initiation of booking.
* To make payment use ,
* `POST` request on **/api/v1/booings/payments**
```
POST on => localhost:4000/api/v1/bookings/payments
```
* The request body must contain
```
{
    bookingId:27
    userId:4
    totalCost:22500
}
```
* The response from server
```json
{
    "success": true,
    "message": "Successfully Completed the payment",
    "error": {}
}
```
* Once the payment is completed , booking status changes to **BOOKED**
* The database snapshot is ,
```
27 | 6 | 4 | booked | 10 | 22500 | 2023-10-10 04:43:02 | 2023-10-10 04:45:37
```

* ## Payments API
* The payment API is an Idempotent API.
* It requires an `x-idempotency-key` for making a payment
* This key's value will be stored before for the payment.
* If for some reasons the user re-initiate a payment for the same booking , the API wont work and response will be
```json
{
    "message": "Cannot Retry on a Successfull Payment"
}
```
* This key must be sent in the request headers along with some value .
* If an user initiates the payment after 5mins of booking , the payment will rollback.

* ## CRON JOBS
* These are used to schedule some process to occur in some time interval in an OS.
* The CRON JOBS used here monitor the `bookings` table in DataBase , and if the booking is not `BOOKED` or `CANCELLED` , it checks the time of initiation , if the time gap is more than **5mins** the booking status will be changed to `CANCELLED`.
  
* ## Message Queue (RabbitMQ)
* RabbitMQ is a popular message queue to handle some quiet amount of capacity .
* Once the payment is committed , the payments service publish an event consisting of `userId` , `bookingId`, and `flightId`.
* This event will be consumed by Notifcation Service to send the notifications.

