const permit = require('../utils/permitInstance');

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const key = name.replace(/\s+/g, '_').replace(/[^A-Za-z0-9\-_]/g, '');

        const category = await permit.api.resourceInstances.create({
            resource: 'Category',
            key: key,
            tenant: 'default'
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category', details: error.response?.data || error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await permit.api.resourceInstances.list({ resource: 'Category' });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await permit.api.resourceInstances.get('Category', id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        // Here you would typically update the category in your database
        // For Permit.io, we can update the resource instance
        const updatedCategory = await permit.api.resourceInstances.update('Category', id, { key: name });
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await permit.api.resourceInstances.delete('Category', id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};