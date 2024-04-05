const express = require('express');
const ESPQBUpdateController = require('../controller/ESPQBUpdateController');
const espQbUpdateRouter = express.Router();

espQbUpdateRouter.post(
    '/esp/update',
    ESPQBUpdateController.UpdateEspCoursesAllUsers,
);

espQbUpdateRouter.post(
    '/qb/update',
    ESPQBUpdateController.UpdateQbCoursesAllUsers,
);

module.exports = espQbUpdateRouter;
