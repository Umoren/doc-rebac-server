const express = require('express');
const policyController = require('../controllers/policyController');
const categoryController = require('../controllers/categoryController');
const documentController = require('../controllers/documentController');
const { checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', policyController.registerUser);
router.get('/list-roles', policyController.listRoles);
router.get('/list-resource-instances', policyController.listResourceInstances);

// Protected routes
router.post('/assign-role', checkPermission('assign', 'Role'), policyController.assignRole);
router.post('/check-permission', checkPermission('check', 'Permission'), policyController.checkPermission);
router.post('/create-relationship', checkPermission('create', 'Relationship'), policyController.createRelationship);
router.get('/user-roles/:userId', checkPermission('read', 'UserRole'), policyController.getUserRoles);
router.get('/users', checkPermission('read', 'User'), policyController.getUsers);
router.get('/users/:userId', checkPermission('read', 'User'), policyController.getUsers);
router.post('/create-resource-instance', checkPermission('create', 'ResourceInstance'), policyController.createResourceInstance);
router.get('/get-role/:roleKey', checkPermission('read', 'Role'), policyController.getRole);

// Category routes
router.post('/categories', checkPermission('create', 'Category'), categoryController.createCategory);
router.get('/categories', categoryController.getCategories); // Public route
router.get('/categories/:id', categoryController.getCategory); // Public route
router.put('/categories/:id', checkPermission('update', 'Category'), categoryController.updateCategory);
router.delete('/categories/:id', checkPermission('delete', 'Category'), categoryController.deleteCategory);

// Document routes
router.post('/documents', checkPermission('create', 'Document'), documentController.createDocument);
router.get('/documents', documentController.getDocuments); // Public route
router.get('/documents/:id', documentController.getDocument); // Public route
router.put('/documents/:id', checkPermission('update', 'Document'), documentController.updateDocument);
router.delete('/documents/:id', checkPermission('delete', 'Document'), documentController.deleteDocument);

router.post('/create-role', checkPermission('create', 'Role'), policyController.createRole);
router.post('/assign-superadmin', policyController.assignSuperAdminRole);

module.exports = router;