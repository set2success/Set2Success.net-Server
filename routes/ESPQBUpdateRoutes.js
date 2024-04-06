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

espQbUpdateRouter.post(
    '/esp/add',
    ESPQBUpdateController.AddEspQuestionsAllUsers,
);

espQbUpdateRouter.post('/qb/add', ESPQBUpdateController.AddQbQuestionsAllUsers);

espQbUpdateRouter.post(
    '/esp/delete',
    ESPQBUpdateController.DeleteESPQuestionsAllUsers,
);

espQbUpdateRouter.post(
    '/qb/delete',
    ESPQBUpdateController.DeleteQBQuestionsAllUsers,
);

module.exports = espQbUpdateRouter;
