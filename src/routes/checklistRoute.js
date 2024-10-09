const express = require('express');
const checklistController = require('../controllers/checklistController');
const { authenticate } = require('../middlewares/auth');
const route = express.Router();

route.post('/checklist', authenticate, checklistController.createChecklist);
route.get('/checklist', authenticate, checklistController.getChecklists);
route.delete('/checklist/:checklistId', authenticate, checklistController.deleteChecklist);

module.exports = route;
