const Role = require("../models/roleModel");

const checkAccess = async (roleId, access) => {
  const findRole = await Role.findById(roleId);
  if (!findRole) {
    return false;
  }

  if (access === "permissions") {
    return findRole.permissions;
  }
};

module.exports = checkAccess;
