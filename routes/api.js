const express = require('express');
const app = express();

const authRouter = require('./auth');
const lmsRouter = require('./lms.routes');
const espRouter = require('./esp.routes');
const cartRouter = require('./cart.routes');
const couponsRouter = require('./Coupons.routes');
const dashboardRouter = require('./dashboard.routes');
const QuestionBankRouter = require('./QuestionBankRoutes');
const espQbUpdateRouter = require('./ESPQBUpdateRoutes');

app.use(express.json());

app.use('/lms', lmsRouter);
app.use('/esp', espRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/coupons', couponsRouter);
app.use('/qb', QuestionBankRouter);
app.use('/dashboard', dashboardRouter);
app.use('/espqbupdate', espQbUpdateRouter);

module.exports = app;
