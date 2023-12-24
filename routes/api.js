const api = require('express')();
const lmsRouter = require('./lms.routes');
const authRouter = require('./auth');
const espRouter = require('./esp.routes');

api.use('/auth', authRouter);
api.use('/lms', lmsRouter);
api.use('/esp', espRouter);

module.exports = api;
