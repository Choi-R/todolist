const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticate } = require('../middlewares/auth');
const route = express.Router();

route.get('/checklist/:checklistId/item', authenticate, itemController.getChecklistDetail);
route.post('/checklist/:checklistId/item', authenticate, itemController.createItem);
route.get('/checklist/:checklistId/item/:itemId', authenticate, itemController.getItemDetail);
route.put('/checklist/:checklistId/item/rename/:itemId', authenticate, itemController.updateItem);
route.put('/checklist/:checklistId/item/:itemId', authenticate, itemController.updateItemStatus);
route.delete('/checklist/:checklistId/item/:itemId', authenticate, itemController.deleteItem);

module.exports = route;
