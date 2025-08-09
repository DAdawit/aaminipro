const mongoose = require("mongoose");
const GroupPermission = require("../models/group-permissions.model.js");
const Permission = require("../models/permission.model");
const User = require("../models/Users.model.js");

const groupPermissions = async (req, res) => {
  const { name, permissions, createdBy } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Group name is required" });
  }
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one permission is required" });
  }
  if (!createdBy) {
    return res.status(400).json({ message: "Created by is required" });
  }

  if (!mongoose.isValidObjectId(createdBy)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  let validPermissions = [];
  for (const permissionId of permissions) {
    if (!mongoose.isValidObjectId(permissionId)) {
      return res
        .status(400)
        .json({ message: `Invalid Permission ID: ${permissionId}` });
    }

    let permission = await Permission.findOne({ _id: permissionId });
    if (!permission) {
      return res
        .status(400)
        .json({ message: `Permission not found: ${permissionId}` });
    }
    validPermissions.push(permissionId);
  }
  // return res.send(validPermissions);

  // Create group
  try {
    const group = new GroupPermission({
      name,
      permissions: validPermissions,
      createdBy,
    });
    await group.save();
    return res.status(201).json({
      message: "Group created successfully",
      status: "success",
      data: group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating group",
      status: "error",
      error: error.message,
    });
  }
};

const getGroupPermissions = async (req, res) => {
  // return res.send("fhello");
  try {
    const groupPermissions = await GroupPermission.find({}).populate(
      "permissions"
    );
    return res.status(200).send(groupPermissions);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving group permissions",
      status: "error",
      error: error.message,
    });
  }
};
const getGroupPermissionsById = async (req, res) => {
  try {
    const { groupPermissionId } = req.params;
    if (!groupPermissionId || !mongoose.isValidObjectId(groupPermissionId)) {
      return res.status(400).json({
        message: "The Permission Group id is not valid.",
      });
    }
    const groupPermissions = await GroupPermission.findById(groupPermissionId);
    if (!groupPermissions) {
      return res.status(404).json({
        message: "The user is not found.",
      });
    }
    return res.status(200).send(groupPermissions);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving group permissions",
      status: "error",
      error: error.message,
    });
  }
};

// update group permissions
const updateGroupPermissions = async (req, res) => {
  try {
    const { groupPermissionId, userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        message: "The userId is required",
        status: "fail",
      });
    }
    if (mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "The user id is not valid",
        status: "fail",
      });
    }
    if (!groupPermissionId) {
      return res.status(400).json({
        message: "The id is required",
        status: "fail",
      });
    }
    if (mongoose.isValidObjectId(groupPermissionId)) {
      return res.status(400).json({
        message: "The id is not valid",
        status: "fail",
      });
    }
    const permissionGroup = await GroupPermission.findById(groupPermissionId);
    if (!permissionGroup) {
      return res.status(404).json({
        message: "The permission is not found.",
        status: "fail",
      });
    }
    const { name, permissions, createdBy } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(404).json({
        message: "The permission must be array.",
        status: "fail",
      });
    }
    const user = await User.findOne({ _id: createdBy });
    if (!user) {
      return res.status(404).json({
        message: "The user is not found.",
        status: "fail",
      });
    }
    await GroupPermission.findByIdAndUpdate(groupPermissionId, {
      name: name ? name : permissionGroup.name,
      permissions:
        permissions.length !== 0 ? permissions : permissionGroup.permissions,
      createdBy: createdBy ? createdBy : permissionGroup.createdBy,
    });
    return res.status(200).json({
      message: "The permission group updated successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving group permissions",
      status: "error",
    });
  }
};
// delete group permissions
const deleteGroupPermissions = async (req, res) => {
  try {
    const { groupPermissionId } = req.params;
    if (!groupPermissionId) {
      return res.status(400).json({
        message: "The id is required",
        status: "fail",
      });
    }
    if (mongoose.isValidObjectId(groupPermissionId)) {
      return res.status(400).json({
        message: "The id is not valid",
        status: "fail",
      });
    }
    const permissionGroup = await GroupPermission.findById(groupPermissionId);
    if (!permissionGroup) {
      return res.status(404).json({
        message: "The permission is not found.",
        status: "fail",
      });
    }
    await GroupPermission.findByIdAndDelete(groupPermissionId);
    return res.status(204).json({
      message: "The permission group deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving group permissions",
      status: "error",
    });
  }
};
const deleteGroupPermission = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Group permission id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid Group Permission ID");
  }

  await GroupPermission.findByIdAndDelete(req.params.id)
    .then((permission) => {
      if (!permission) {
        return res.status(404).send("Group Permission not found");
      }
      return res.status(200).send("Group Permission deleted successfully");
    })
    .catch((error) => {
      return res.status(500).send("Error deleting Group Permission");
    });
};
module.exports = {
  groupPermissions,
  getGroupPermissions,
  deleteGroupPermission,
  getGroupPermissionsById,
  deleteGroupPermissions,
  updateGroupPermissions,
};
