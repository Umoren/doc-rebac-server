const permit = require('../utils/permitInstance');

const createDocument = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;

        // Replace spaces with underscores and ensure the key is valid
        const key = title.replace(/\s+/g, '_');  // This transforms "Document available to super admin" to "Document_available_to_super_admin"

        // Create the document resource instance
        const document = await permit.api.resourceInstances.create({
            resource: 'Document',
            key: key,  // Use the sanitized key
            tenant: 'default'
        });

        // Create a relationship between the document and its category
        await permit.api.relationshipTuples.create({
            subject: `Category:${categoryId}`,
            relation: 'parent',
            object: `Document:${document.key}`
        });

        res.status(201).json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
};


const getDocuments = async (req, res) => {
    try {
        const documents = await permit.api.resourceInstances.list({ resource: 'Document' });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await permit.api.resourceInstances.get('Document', id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
};

const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, attributes = {} } = req.body; // Ensure attributes are passed or default to empty

        const updatedDocument = await permit.api.resourceInstances.update(
            'Document',
            id,
            {
                key: title,
                attributes: attributes // Send attributes even if empty
            }
        );

        res.json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
};


const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        await permit.api.resourceInstances.delete('Document', id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

module.exports = {
    createDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument
};