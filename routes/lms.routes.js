const express = require('express');
const LMSTextBookRouter = require('../controller/lms.controller');
const lmsRouter = express();

lmsRouter.use('/tb', LMSTextBookRouter);

module.exports = lmsRouter;
