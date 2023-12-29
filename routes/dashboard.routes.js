const express = require('express');
const dashboardRouter = express();
const dashboardController = require('../controller/dashboard.controller');

// Get all statistics of all courses
dashboardRouter.get('/statisticsRead', dashboardController.GetStatisticsRead);

module.exports = dashboardRouter;
