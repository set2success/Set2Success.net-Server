const express = require('express');
const app = express();

const lmsRouter = require('./lms.routes');
const authRouter = require('./auth');
const espRouter = require('./esp.routes');
const dashboardRouter = require('./dashboard.routes');
const QuestionBankRouter = require('./QuestionBankRoutes');
const cartRouter = require('./cart.routes');

app.use(express.json());


app.use('/auth', authRouter);
app.use('/lms', lmsRouter);
app.use('/esp', espRouter);
app.use('/qb', QuestionBankRouter);
app.use('/dashboard', dashboardRouter);
app.use('/cart', cartRouter);

module.exports = app;