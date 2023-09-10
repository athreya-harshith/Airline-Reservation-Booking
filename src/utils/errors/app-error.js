class AppError extends Error
{
    constructor(message, statusCode)
    {
        super(message);
        this.statusCode = statusCode;// send a valid status code for client
        this.explanation = message;// pass an error message or can be an array even
       
    }
}
// the captureStackTrace() method thats used to write down all the errors
module.exports = AppError;