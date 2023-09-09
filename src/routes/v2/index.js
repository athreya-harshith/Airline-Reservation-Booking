const express = require('express');
const router = express.Router();

// here for testing have implemented the controller here itself
//in a cleaner level define the fuction corresoponding to it in the controller folder , 
//import that here and continue
router.get('/info',(req,res)=> {
    res.json({
        msg:"Ok ",
        desc:"The response from v2 routes info "
    });
});

module.exports = router;