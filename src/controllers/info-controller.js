const {StatusCodes} = require('http-status-codes');
const info = (req,res)=>{
    return res.status(StatusCodes.OK).json({
        success:true,
        message : 'API is live',
        error :{},
        data :{}
    });
};

module.exports = {info};// here exported as object import this in controller/index.js and export that from there to outside