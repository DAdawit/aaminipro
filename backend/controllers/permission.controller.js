const Permission = require("../models/permission.model");
const checkContent = require("../utils/check-strings");
const mongoose = require("mongoose");

const registerPermission = async (req, res) => {
  try {
    const { name, codeName, description, createdBy } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
        status: "fail",
      });
    }
    if (!codeName) {
      return res.status(400).json({
        message: "CodeName is required",
        status: "fail",
      });
    }
    if (!description) {
      return res.status(400).json({
        message: "description is required",
        status: "fail",
      });
    }
    // send array fields
    // const isValid = checkContent(fields);
    // if (!isValid) {
    //   return res.status(400).json({
    //     message: "The content is not valid.",
    //     status: "fail",
    //   });
    // }
    // isValidObjectId(req.params.id) is a mongoose method to check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }
    // remove spaces
    const trimmedcodeName = codeName.trim();

    const isExist = await Permission.findOne({ codeName: trimmedcodeName });
    if (isExist) {
      return res.status(409).json({
        message: "Permission with this codeName already exists",
        status: "fail",
      });
    }

    const newPermission = await Permission.create({
      name: name,
      codeName: trimmedcodeName,
      description: description || "",
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
// update permission
const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { codeName, name, description } = req.body;
    if (!permissionId) {
      return res.status(400).json({
        message: "Permission ID is required.",
        status: "fail",
      });
    }
    if (!codeName && !name) {
      return res.status(400).json({
        message: "Both codeName and name are required.",
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

    const existingPermission = await Permission.findById(permissionId);
    if (!existingPermission) {
      return res.status(404).json({
        message: "Permission not found.",
        status: "fail",
      });
    }
    const codeExists = await Permission.findOne({
      code: trimmedCodeName,
      _id: { $ne: permissionId },
    });
    if (codeExists) {
      return res.status(409).json({
        message: "Another permission with the same codeName already exists.",
        status: "fail",
      });
    }

    // ✅ Perform update
    const updatedPermission = await Permission.findByIdAndUpdate(
      permissionId,
      {
        code: trimmedCodeName,
        name: trimmedName,
        description: trimmedDescription,
      },
      { new: true } // return the updated document
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
    const isExist = await Permission.findById(permissionId);
    if (!isExist) {
      return res.status(409).json({
        message: "Permission with this code is not exist ",
        status: "fail",
      });
    }
    await Permission.findByIdAndDelete(permissionId);

    res.status(203).json({
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

const addPermissionToUser = async (req, res) => {
  return res.sen("hello");
  const { userId, permissionId } = req.body;
  try {
    if (!userId || !permissionId) {
      return res.status(400).json({
        message: "User ID and Permission ID are required.",
        status: "fail",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: "fail",
      });
    }
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({
        message: "Permission not found.",
        status: "fail",
      });
    }
    user.extraPermissions.push(permission._id);
    await user.save();
    res.status(200).json({
      message: "Permission added to user successfully.",
      status: "success",
      user,
    });
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
  addPermissionToUser,
};
