const express = require('express');
const policyController = require('../controllers/policyController');
const categoryController = require('../controllers/categoryController');
const documentController = require('../controllers/documentController');
const { checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', policyController.registerUser);
router.get('/list-resource-instances', policyController.listResourceInstances);

// Protected routes
router.post('/check-permission', policyController.checkPermission);
router.post('/create-relationship', policyController.createRelationship);
router.get('/users', checkPermission('read', 'User'), policyController.getUsers);
router.get('/users/:userId', checkPermission('read', 'User'), policyController.getUsers);
router.post('/create-resource-instance', checkPermission('create', 'ResourceInstance'), policyController.createResourceInstance);


// Category routes
router.post('/categories', checkPermission('create', 'Category'), categoryController.createCategory);
router.get('/categories', categoryController.getCategories); // Public route
router.get('/categories/:id', categoryController.getCategory); // Public route
router.put('/categories/:id', checkPermission('update', 'Category'), categoryController.updateCategory);
router.delete('/categories/:id', checkPermission('delete', 'Category'), categoryController.deleteCategory);

// Document routes
router.post('/documents', documentController.createDocument);
router.get('/documents', documentController.getDocuments); // Public route
router.get('/documents/:id', documentController.getDocument); // Public route
router.put('/documents/:id', checkPermission('update', 'Document'), documentController.updateDocument);
router.delete('/documents/:id', checkPermission('delete', 'Document'), documentController.deleteDocument);

router.post('/assign-admin', policyController.assignAdmin)
router.get('/get-user-relationships', policyController.getUserRelationships);


module.exports = router;