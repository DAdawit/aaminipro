const Permission = require("../models/permission.model");
const checkContent = require("../utils/check-strings");
const registerPermission = async (req, res) => {
  try {
    const { name, codeName, description } = req.body;
    if (!name || !codeName) {
      return res.status(400).json({
        message: "Name and codeName are required",
        status: "fail",
      });
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

module.exports = {
  registerPermission,
  deletePermission,
  updatePermission,
};
