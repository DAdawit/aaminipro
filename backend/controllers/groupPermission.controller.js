const mongoose = require("mongoose");
const GroupPermission = require("../models/group-permissions.model.js");
const Permission = require("../models/permission.model");

const groupPermissions = async (req, res) => {
  // return res.send("hello");
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
  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }
  let validPermissions = [];
  for (const permissionId of permissions) {
    if (!mongoose.Types.ObjectId.isValid(permissionId)) {
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
    validPermissions.push(permission);
  }

  // Create group
  try {
    const group = new GroupPermission({
      name,
      validPermissions,
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
  try {
    const groupPermissions = await GroupPermission.find();
    return res.status(200).send(groupPermissions);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving group permissions",
      status: "error",
      error: error.message,
    });
  }
};

module.exports = {
  groupPermissions,
  getGroupPermissions,
};
