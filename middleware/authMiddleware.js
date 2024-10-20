const permit = require('../utils/permitInstance');

const checkPermission = (action, resource) => async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID not provided' });
        }

        const userRoles = await permit.api.users.getAssignedRoles(userId);
        if (userRoles.some(role => role.role === 'SuperAdmin')) {
            return next(); // SuperAdmin can do anything
        }

        const permitted = await permit.check(userId, action, resource);
        if (permitted) {
            next();
        } else {
            res.status(403).json({ error: 'Permission denied' });
        }
    } catch (error) {
        console.error('Error checking permission:', error);
        res.status(500).json({ error: 'Failed to check permission' });
    }
};

module.exports = { checkPermission };