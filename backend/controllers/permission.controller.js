const mongoose = require("mongoose");
const Permission = require("../models/permission.model");
const checkContent = require("../utils/check-strings");
const User = require("../models/Users.model");
const GroupPermission = require("../models/group-permissions.model");

const registerPermission = async (req, res) => {
  try {
    const { name, codeName, description, createdBy } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Name are required",
        status: "fail",
      });
    }
    if (!codeName) {
      return res.status(400).json({
        message: "codeName are required",
        status: "fail",
      });
    }
    if (name) {
      const ispresent = await Permission.findOne({ name });
      if (ispresent) {
        return res.status(409).json({
          message: "The Name already exist",
          status: "fail",
        });
      }
    }
    if (codeName) {
      const ispresent = await Permission.findOne({ codeName });
      if (ispresent) {
        return res.status(409).json({
          message: "The codeName already exist",
          status: "fail",
        });
      }
    }
    if (!mongoose.isValidObjectId(createdBy)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }
    const fields = [name, codeName, description];
    // send array fields
    const isValid = checkContent(fields);
    if (!isValid) {
      return res.status(400).json({
        message: "The content is not valid.",
        status: "fail",
      });
    }
    // remove spaces
    const trimmedcodeName = codeName.trim();
    const newPermission = await Permission.create({
      name: name,
      codeName: trimmedcodeName,
      description: description,
      createdBy: createdBy,
    });

    res.status(201).json({
      message: "Permission registered successfully",
      permission: newPermission,
      status: "success",
    });
  } catch (error) {
    console.error("Register permission error:", error);
    res.status(500).json({
      message: "Server error while creating permission",
      status: "error",
    });
  }
};
const getAllPermission = async (req, res) => {
  try {
    console.log("object");
    const permissions = await Permission.find();
    res.status(201).json({
      permissions: permissions ? permissions : [],
      status: "success",
    });
  } catch (error) {
    console.error("Register permission error:", error);
    res.status(500).json({
      message: "Server error while creating permission",
      status: "error",
    });
  }
};
const getPermissionById = async (req, res) => {
  const { permissionId } = req.params;
  try {
    if (!permissionId) {
      return res.status(400).json({
        message: "The permisson id is required",
        status: "fail",
      });
    }
    if (!mongoose.isValidObjectId(permissionId)) {
      return res.status(400).json({
        message: "The permisson id is not valid",
        status: "fail",
      });
    }
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(400).json({
        message: "The permisson is not found",
        status: "fail",
      });
    }
    res.status(201).json({
      permission,
      status: "success",
    });
  } catch (error) {
    console.error("Register permission error:", error);
    res.status(500).json({
      message: "Server error while creating permission",
      status: "error",
    });
  }
};

// update permission
const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    if (!permissionId) {
      return res.status(400).json({
        message: "Permission ID is required.",
        status: "fail",
      });
    }
    if (!mongoose.isValidObjectId(permissionId)) {
      return res.status(400).json({
        message: "Permission ID is not valid.",
        status: "fail",
      });
    }
    const existingPermission = await Permission.findById(permissionId);
    if (!existingPermission) {
      return res.status(404).json({
        message: "Permission not found.",
        status: "fail",
      });
    }
    const { codeName, name, description } = req.body;
    const codeNameExists = await Permission.findOne({
      codeName,
    });
    if (codeNameExists) {
      return res.status(409).json({
        message: "code name is already exist.",
        status: "fail",
      });
    }
    const nameExists = await Permission.findOne({
      name,
    });
    if (nameExists) {
      return res.status(409).json({
        message: "name is already exist.",
        status: "fail",
      });
    }
    // check contents
    const trimmedCodeName = codeName.trim();
    const fields = [name, trimmedCodeName, description];
    // send array fields
    const isValid = checkContent(fields);
    if (!isValid) {
      return res.status(400).json({
        message: "The content is not valid.",
        status: "fail",
      });
    }
    const updatedPermission = await Permission.findByIdAndUpdate(
      permissionId,
      {
        codeName: codeName ? trimmedCodeName : existingPermission.codeName,
        name: name ? name : existingPermission.name,
        description: description ? description : existingPermission.description,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Permission updated successfully.",
      status: "success",
      permission: updatedPermission,
    });
  } catch (error) {
    console.error("Update permission error:", error);
    return res.status(500).json({
      message: "Server error while updating permission.",
      status: "error",
    });
  }
};
const deletePermission = async (req, res) => {
  const { permissionId } = req.params;
  try {
    if (!permissionId) {
      return res.status(400).json({
        message: "PermissionId is required.",
        status: "fail",
      });
    }
    if (!mongoose.isValidObjectId(permissionId)) {
      return res.status(400).json({
        message: "PermissionId is not valid.",
        status: "fail",
      });
    }
    const isExist = await Permission.findById(permissionId);
    if (!isExist) {
      return res.status(409).json({
        message: "Permission with this code is not exist ",
        status: "fail",
      });
    }
    await Permission.findByIdAndDelete(permissionId);

    res.status(204).json({
      message: "Permission Deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Register permission error:", error);
    res.status(500).json({
      message: "Server error while creating permission",
      status: "error",
    });
  }
};

const addGroupPermissionToUser = async (req, res) => {
  const { userId, groupPermissionId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
        status: "fail",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }
    if (!groupPermissionId) {
      return res.status(400).json({
        message: "Group Permission ID is required.",
        status: "fail",
      });
    }
<<<<<<< HEAD
=======
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }
>>>>>>> d848d993cad9e0b3c8a61a9f31d03a3aa1fcedb3

    if (!mongoose.isValidObjectId(groupPermissionId)) {
      return res.status(400).send({ message: "Invalid Group Permission ID" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: "fail",
      });
    }
    const groupPermission = await GroupPermission.findById(groupPermissionId);
    if (!groupPermission) {
      return res.status(404).json({
        message: "Group Permission not found.",
        status: "fail",
      });
    }

    try {
      const user = await User.findByIdAndUpdate(userId, {
        groupPermissions: groupPermissionId,
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ message: "Group permission added successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Add permission to user error:", error);
    res.status(500).json({
      message: "Server error while adding permission to user.",
      status: "error",
    });
  }
};
const addPermissionsToGroups = async (req, res) => {
  const { permissionIds, groupPermissionId } = req.body;
  try {
    for (const id of permissionIds) {
      if (!id) {
        return res.status(400).json({
          message: "permission ID is required.",
          status: "fail",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid permission ID" });
      }
    }
    if (!groupPermissionId) {
      return res.status(400).json({
        message: "Group Permission ID is required.",
        status: "fail",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupPermissionId)) {
      return res.status(400).send({ message: "Invalid Group Permission ID" });
    }

    const groupPermission = await GroupPermission.findById(groupPermissionId);
    if (!groupPermission) {
      return res.status(404).json({
        message: "Group Permission not found.",
        status: "fail",
      });
    }

    try {
      const user = await User.findByIdAndUpdate(userId, {
        groupPermissions: groupPermissionId,
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ message: "Group permission added successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Add permission to user error:", error);
    res.status(500).json({
      message: "Server error while adding permission to user.",
      status: "error",
    });
  }
};

module.exports = {
  registerPermission,
  deletePermission,
  updatePermission,
  getPermissionById,
  getAllPermission,
  addGroupPermissionToUser,
};
