const api = require('express')();
const lmsRouter = require('./lms.routes');
const authRouter = require('./auth');

api.use('/auth', authRouter);
api.use('/lms', lmsRouter);

module.exports = api;
