const permit = require('../utils/permitInstance');
const axios = require('axios');

// Register a user in Permit.io
const registerUser = async (req, res, next) => {
  try {
    const { userId, email, firstName, lastName } = req.body;

    if (!userId || !email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Attempting to register user:', { userId, email, firstName, lastName });

    await permit.api.users.sync({
      key: userId,
      email,
      first_name: firstName,
      last_name: lastName,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message
    });
  }
};


const assignAdmin = async (req, res) => {
  try {
    const { userId, tenantId } = req.body;

    // Create admin_of relationship between user and tenant
    await permit.api.relationshipTuples.create({
      subject: `User:${userId}`,
      relation: 'admin_of',
      object: `Tenant:${tenantId || 'default'}`
    });

    res.status(200).json({ message: 'Admin relationship assigned successfully' });
  } catch (error) {
    console.error('Error assigning admin relationship:', error);
    res.status(500).json({ error: 'Failed to assign admin relationship' });
  }
};


const getUsers = async (req, res, next) => {
  try {
    const { userId } = req.params; // If a specific user ID is provided

    if (userId) {
      // Get a specific user
      const user = await permit.api.users.get(userId);
      res.status(200).json(user);
    } else {
      // List all users
      const users = await permit.api.users.list();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      details: error.message
    });
  }
};


//  checkPermission function
const checkPermission = async (req, res, next) => {
  try {
    const { userId, action, resourceType, resourceId } = req.body;

    if (!userId || !action || !resourceType || (!resourceId && action !== 'create')) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resource = resourceId ? `${resourceType}:${resourceId}` : `${resourceType}`;

    // Directly check permission on the resource
    const permitted = await permit.check(userId, action, resource);

    if (permitted) {
      res.status(200).json({ permitted: true, message: 'User has permission' });
    } else {
      res.status(403).json({ permitted: false, message: 'Permission denied' });
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ error: 'Failed to check permission', details: error.message });
  }
};


// Create a relationship between resources
const createRelationship = async (req, res) => {
  try {
    const { userId, relation, resourceType, resourceKey } = req.body;

    if (!userId || !relation || !resourceType || !resourceKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await permit.api.relationshipTuples.create({
      subject: `User:${userId}`,
      relation: relation,
      object: `${resourceType}:${resourceKey}`
    });

    res.status(201).json({ message: 'Relationship created successfully' });
  } catch (error) {
    console.error('Error creating relationship:', error);
    res.status(500).json({ error: 'Failed to create relationship', details: error.message });
  }
};


const createResourceInstance = async (req, res, next) => {
  try {
    const { resource, key, tenant } = req.body;

    if (!resource || !key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await permit.api.resourceInstances.create({
      resource: resource,
      key: key,
      tenant: tenant || 'default'
    });

    res.status(201).json({ message: 'Resource instance created successfully' });
  } catch (error) {
    console.error('Error creating resource instance:', error);
    res.status(500).json({ error: 'Failed to create resource instance', details: error.message });
  }
};


const listResourceInstances = async (req, res, next) => {
  try {
    const instances = await permit.api.resourceInstances.list();
    res.status(200).json(instances);
  } catch (error) {
    console.error('Error listing resource instances:', error);
    res.status(500).json({ error: 'Failed to list resource instances', details: error.message });
  }
};


const listRolesAndResources = async (req, res, next) => {
  try {
    const roles = await permit.api.roles.list();
    const resources = await permit.api.resources.list();

    const rolesWithResources = roles.map(role => {
      const associatedResources = resources.filter(resource =>
        role.permissions.some(perm => perm.startsWith(`${resource.key}:`))
      );
      return {
        ...role,
        associatedResources: associatedResources.map(r => r.key)
      };
    });

    res.status(200).json(rolesWithResources);
  } catch (error) {
    console.error('Error listing roles and resources:', error);
    res.status(500).json({ error: 'Failed to list roles and resources', details: error.message });
  }
};

const getUserRelationships = async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'User ID not provided' });
    }

    const resourceType = 'user'; // Ensure this matches your Permit.io resource type

    // Fetch relationships with include_total_count for consistent structure
    const relationshipsResponse = await permit.api.relationshipTuples.list({
      subject: `${resourceType}:${userId}`,
      include_total_count: true,
    });

    console.log('Relationships Response:', JSON.stringify(relationshipsResponse, null, 2));

    const relationships = relationshipsResponse.data || relationshipsResponse;

    res.status(200).json({ relationships });
  } catch (error) {
    console.error('Error fetching user relationships:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user relationships' });
  }
};



module.exports = {
  registerUser,
  checkPermission,
  createRelationship,
  getUsers,
  createResourceInstance,
  listResourceInstances,
  listRolesAndResources,
  assignAdmin,
  getUserRelationships,
};
