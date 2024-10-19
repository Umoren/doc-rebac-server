const express = require('express');
const {
    registerUser,
    assignRole,
    checkPermission,
    createRelationship,
    getUserRoles,
    getUsers,
    getRole,
    listRoles,
    createResourceInstance,
    listResourceInstances,
    listRolesAndResources
} = require('../controllers/policyController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/assign-role', assignRole);
router.post('/check-permission', checkPermission);
router.post('/create-relationship', createRelationship);
router.get('/user-roles/:userId', getUserRoles);
router.get('/users', getUsers);
router.get('/users/:userId', getUsers);
router.get('/list-roles', listRoles);
router.post('/create-resource-instance', createResourceInstance);
router.get('/list-resource-instances', listResourceInstances);
router.get('/get-role/:roleKey', getRole);
router.get('/list-roles-and-resources', listRolesAndResources);



module.exports = router;