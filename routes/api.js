const api = require('express')();
const lmsRouter = require('./lms.routes');
const authRouter = require('./auth');
const espRouter = require('./esp.routes');
const dashboardRouter = require('./dashboard.routes');
const QuestionBankRouter = require('./QuestionBankRoutes');

api.use('/auth', authRouter);
api.use('/lms', lmsRouter);
api.use('/esp', espRouter);
api.use('/qb', QuestionBankRouter)
api.use('/dashboard', dashboardRouter);

module.exports = api;
