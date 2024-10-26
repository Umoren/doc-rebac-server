const permit = require('../utils/permitInstance');

const checkPermission = (action, resource) => async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID not provided' });
        }

        const resourceId = req.params.id || req.body.resourceId || req.body.resourceKey || 'default';

        const resourceString = `${resource}:${resourceId}`;

        // Directly check permission based on relationships
        const permitted = await permit.check(userId, action, resourceString);

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
