const permit = require('../utils/permitInstance');

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

// Assign a role to a user for a specific resource
const assignRole = async (req, res, next) => {
  try {
    console.log('Starting assignRole function');
    const { userId, roleKey, resourceType, resourceKey, tenant } = req.body;
    console.log('Request body:', { userId, roleKey, resourceType, resourceKey, tenant });

    if (!userId || !roleKey || !resourceType || !resourceKey || !tenant) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching roles');
    const roles = await permit.api.roles.list();
    console.log('Roles fetched:', roles);

    const fullRoleKey = `${resourceType}${roleKey}`;
    console.log('Looking for role with key:', fullRoleKey);
    const role = roles.find(r => r.key === fullRoleKey);
    if (!role) {
      console.log('Role not found');
      return res.status(400).json({ error: 'Role not found' });
    }
    console.log('Role found:', role);

    console.log('Fetching resource instances');
    const resourceInstances = await permit.api.resourceInstances.list();
    console.log('Resource instances fetched:', resourceInstances);

    const instance = resourceInstances.find(instance =>
      instance.resource === resourceType && instance.key === resourceKey
    );

    if (!instance) {
      console.log('Resource instance does not exist');
      return res.status(400).json({ error: 'Resource instance does not exist' });
    }
    console.log('Resource instance exists');

    const assignedRole = {
      user: userId,
      role: role.key,  // Use the role key instead of ID
      resource_instance: `${resourceType}:${resourceKey}`,
      tenant: tenant
    };

    console.log('Attempting to assign role:', JSON.stringify(assignedRole, null, 2));

    const response = await permit.api.roleAssignments.assign(assignedRole);
    console.log('Role assignment response:', response);

    res.status(200).json({ message: 'Role assigned successfully', response });
  } catch (error) {
    console.error('Error assigning role:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({
      error: 'Failed to assign role',
      details: error.message,
      stack: error.stack
    });
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


// Check permission for a user on a specific resource
const checkPermission = async (req, res, next) => {
  try {
    const { userId, action, resourceType, resourceId } = req.body;

    if (!userId || !action || !resourceType || !resourceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const permitted = await permit.check(userId, action, `${resourceType}:${resourceId}`);

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
const createRelationship = async (req, res, next) => {
  try {
    const { subject, relation, object } = req.body;

    if (!subject || !relation || !object) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await permit.api.relationshipTuples.create({
      subject: subject,
      relation: relation,
      object: object
    });

    res.status(201).json({ message: 'Relationship tuple created successfully' });
  } catch (error) {
    console.error('Error creating relationship tuple:', error);
    res.status(500).json({ error: 'Failed to create relationship tuple', details: error.message });
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

// Get user's direct roles and permissions
const getUserRoles = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userRoles = await permit.api.users.getAssignedRoles(userId);

    res.status(200).json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
};

const listRoles = async (req, res, next) => {
  try {
    const roles = await permit.api.roles.list();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error listing roles:', error);
    res.status(500).json({
      error: 'Failed to list roles',
      details: error.message
    });
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

const getRole = async (req, res, next) => {
  try {
    const { roleKey } = req.params;
    const role = await permit.api.roles.get(roleKey);
    res.status(200).json(role);
  } catch (error) {
    console.error('Error getting role:', error);
    res.status(500).json({ error: 'Failed to get role', details: error.message });
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


module.exports = {
  registerUser,
  assignRole,
  listRoles,
  checkPermission,
  createRelationship,
  getUsers,
  getUserRoles,
  getRole,
  createResourceInstance,
  listResourceInstances,
  listRolesAndResources
};
