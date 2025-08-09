const mongoose = require("mongoose");
const GroupPermission = require("../models/group-permissions.model.js");
const Permission = require("../models/permission.model");

const getGroupPermissionById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Group Permission ID is required" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid Group Permission ID" });
  }

  try {
    const groupPermission = await GroupPermission.findById(id).populate(
      "permissions"
    );
    if (!groupPermission) {
      return res.status(404).json({ message: "Group Permission not found" });
    }
    return res.status(200).json(groupPermission);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving Group Permission",
      status: "error",
      error: error.message,
    });
  }
};

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

const deleteGroupPermission = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "Group permission id is required" });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: "Invalid Group Permission ID" });
  }

  await GroupPermission.findByIdAndDelete(req.params.id)
    .then((permission) => {
      if (!permission) {
        return res.status(404).send({ message: "Group Permission not found" });
      }
      return res
        .status(200)
        .send({ message: "Group Permission deleted successfully" });
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ message: "Error deleting Group Permission" });
    });
};

const updateGroupPermission = async (req, res) => {
  // return res.send("hello");
  if (!req.params.id) {
    return res.status(400).send({ message: "Group permission id is required" });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: "Invalid Group Permission ID" });
  }

  // const checkPermissionName = await GroupPermission.findOne({
  //   name: req.body.name,
  // });
  // if (checkPermissionName) {
  //   return res
  //     .status(400)
  //     .send({ message: "Group Permission name already exists" });
  // }
  let oldTempPermissions = [];

  let oldGroupPermissions = await GroupPermission.findById(
    req.params.id
  ).populate({
    path: "permissions",
    select: "_id, name",
  });

  oldTempPermissions = oldGroupPermissions.permissions.map((p) =>
    p._id.toString()
  );
  const mergedPermissionsSet = new Set([
    ...oldTempPermissions,
    ...req.body.permissions,
  ]);
  // console.log(oldTempPermissions, req.body.permissions);
  // console.log(newCleanPermissions);

  const newCleanPermissions = Array.from(mergedPermissionsSet);
  // console.log(newCleanPermissions);
  await GroupPermission.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name || oldGroupPermissions.name,
      permissions: newCleanPermissions,
    },
    {
      new: true,
    }
  )
    .then((updatedGroup) => {
      return res.status(200).send(updatedGroup);
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ message: "Error updating Group Permission" });
    });
};

const removeSinglePermissionFromGroup = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ message: "Invalid Permission Id" });
  }
  if (!mongoose.isValidObjectId(req.body.permissionId)) {
    return res.status(400).send({ message: "Invalid Group Permission Id" });
  }

  const groupPermission = await GroupPermission.findById(req.params.id);
  if (!groupPermission) {
    return res.status(404).send({ message: "Group Permission not found" });
  }

  try {
    await GroupPermission.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { permissions: req.body.permissionId },
      },
      {
        new: true,
      }
    )
      .then((updatedGroup) => {
        return res.status(200).send(updatedGroup);
      })
      .catch((error) => {
        return res.send({ message: "Error removing permission" });
      });
  } catch (error) {
    console.error("Error removing permission:", error);
    return res
      .status(500)
      .send({ message: "Internal Server Error On removing Permission" });
  }
};

module.exports = {
  groupPermissions,
  getGroupPermissions,
  deleteGroupPermission,
  updateGroupPermission,
  removeSinglePermissionFromGroup,
  getGroupPermissionById,
};
