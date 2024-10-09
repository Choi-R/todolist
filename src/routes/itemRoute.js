const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticate } = require('../middlewares/auth');
const route = express.Router();

route.get('/checklist/:checklistId', authenticate, itemController.getChecklistDetail);
route.post('/checklist/:checklistId', authenticate, itemController.createItem);
route.get('/:itemId', authenticate, itemController.getItemDetail);
route.put('/:itemId', authenticate, itemController.updateItem);
route.patch('/:itemId/status', authenticate, itemController.updateItemStatus);
route.delete('/:itemId', authenticate, itemController.deleteItem);

module.exports = route;
