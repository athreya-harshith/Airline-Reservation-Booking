const express = require('express');
const router = express.Router();

const v1Routes = require('./v1');
const v2Routes = require('./v2');
router.use('/v1', v1Routes);
router.use('/v2',v2Routes);

module.exports = router;// must be done as we are using const apiRoute = require('./routes') , in index.js in src