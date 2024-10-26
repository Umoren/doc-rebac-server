const permit = require('../utils/permitInstance');

const createDocument = async (req, res) => {
    try {
        const { key, tenant, categoryKey, ownerId } = req.body;

        if (!key || !categoryKey || !ownerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create the document resource instance
        const document = await permit.api.resourceInstances.create({
            resource: 'Document',
            key: key,
            tenant: tenant || 'default',
        });

        res.status(201).json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document', details: error.message });
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