const { Op } = require('sequelize');
const { success, error, serverError } = require('../helpers/response');
const { emptyBody } = require('../helpers/validation');
const { Checklist } = require('../models');

// Create a new checklist
exports.createChecklist = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id
    try {
        const emptyMessage = emptyBody({ name });
        if (emptyMessage) { return error(res, emptyMessage, 400); }

        // Create checklist
        const checklistBody = { name, userId  };
        const newChecklist = await Checklist.create(checklistBody);
        return success(res, newChecklist, 201);
    } catch (err) {
        return serverError(res, err);
    }
};

// Delete checklist by ID
exports.deleteChecklist = async (req, res) => {
    const { checklistId } = req.params;
    const userId = req.user.id
    try {
        // Find checklist
        const checklist = await Checklist.findOne({ where: { id: checklistId, userId: userId } });
        if (!checklist) { return error(res, `Checklist not found`, 404); }

        // Delete checklist
        await checklist.destroy();
        return success(res, 'Checklist deleted successfully', 200);
    } catch (err) {
        return serverError(res, err);
    }
};

// Get all checklists for the logged-in user
exports.getChecklists = async (req, res) => {
  const { name, sort, order = 'ASC', limit = 10, page = 1 } = req.query;
  const userId = req.user.id
    try {
        const filter = name? { userId, name: { [Op.iLike]: `%${name}%` } } : { userId }
        const totalChecklists = await Checklist.count({ where: filter });
        const maxPages = Math.ceil(totalChecklists / limit);
        const actualPage = page > maxPages? maxPages : page
        const orderBy = sort ? [[sort, order.toUpperCase()]] : [['name', 'ASC']];
        const checklists = await Checklist.findAll({
          where: filter,
          order: orderBy,
          offset: parseInt((actualPage - 1) * limit, 10)
        });
        return success(res, { total: totalChecklists, page, maxPages, checklists }, 200)
    } catch (err) {
        return serverError(res, err);
    }
};
