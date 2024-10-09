const { Op } = require('sequelize');
const { success, error, serverError } = require('../helpers/response');
const { emptyBody } = require('../helpers/validation');
const { Checklist, Item } = require('../models');

// Get detail of a checklist including items
exports.getChecklistDetail = async (req, res) => {
    const { checklistId } = req.params;
    const userId = req.user.id;
    try {
        const checklist = await Checklist.findOne({
            where: { id: checklistId, userId: userId },
            include: [{ model: Item }]
        });
        if (!checklist) {
            return error(res, `Checklist not found`, 404);
        }
        return success(res, checklist, 200);
    } catch (err) {
        return serverError(res, err);
    }
};

// Create a new item in a checklist
exports.createItem = async (req, res) => {
    const { checklistId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    try {
        const emptyMessage = emptyBody({ content });
        if (emptyMessage) {
            return error(res, emptyMessage, 400);
        }

        const checklist = await Checklist.findOne({ where: { id: checklistId, userId: userId } });
        if (!checklist) {
            return error(res, `Checklist not found`, 404);
        }

        const itemBody = { content, checklistId: checklist.id };
        const newItem = await Item.create(itemBody);
        return success(res, newItem, 201);
    } catch (err) {
        return serverError(res, err);
    }
};

// Get detail of an item
exports.getItemDetail = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    try {
        const item = await Item.findOne({
            where: {
                id: itemId,
                checklistId: {
                    [Op.in]: [sequelize.literal(`SELECT id FROM "Checklists" WHERE "userId" = ${userId}`)]
                }
            }
        });
        if (!item) {
            return error(res, `Item not found`, 404);
        }
        return success(res, item, 200);
    } catch (err) {
        return serverError(res, err);
    }
};

// Update an item in a checklist
exports.updateItem = async (req, res) => {
    const { itemId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    try {
        const item = await Item.findOne({
            where: {
                id: itemId,
                checklistId: {
                    [Op.in]: [sequelize.literal(`SELECT id FROM "Checklists" WHERE "userId" = ${userId}`)]
                }
            }
        });
        if (!item) {
            return error(res, `Item not found`, 404);
        }

        item.content = content || item.content;
        await item.save();
        return success(res, item, 200);
    } catch (err) {
        return serverError(res, err);
    }
};

// Update the status of an item in a checklist
exports.updateItemStatus = async (req, res) => {
    const { itemId } = req.params;
    const { isComplete } = req.body;
    const userId = req.user.id;
    try {
        const item = await Item.findOne({
            where: {
                id: itemId,
                checklistId: {
                    [Op.in]: [sequelize.literal(`SELECT id FROM "Checklists" WHERE "userId" = ${userId}`)]
                }
            }
        });
        if (!item) {
            return error(res, `Item not found`, 404);
        }

        item.isComplete = isComplete !== undefined ? isComplete : item.isComplete;
        await item.save();
        return success(res, item, 200);
    } catch (err) {
        return serverError(res, err);
    }
};

// Delete an item from a checklist
exports.deleteItem = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    try {
        const item = await Item.findOne({
            where: {
                id: itemId,
                checklistId: {
                    [Op.in]: [sequelize.literal(`SELECT id FROM "Checklists" WHERE "userId" = ${userId}`)]
                }
            }
        });
        if (!item) {
            return error(res, `Item not found`, 404);
        }

        await item.destroy();
        return success(res, 'Item deleted successfully', 200);
    } catch (err) {
        return serverError(res, err);
    }
};
