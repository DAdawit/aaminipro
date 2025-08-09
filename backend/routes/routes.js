const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const groupPermissionController = require("../controllers/groupPermission.controller");
const fileUploader = require("../utils/fileUploader");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
// const { registerPermission } = require("../controllers/permission.controller");
const PermissionController = require("../controllers/permission.controller");
router.get("/", (req, res) => {
  res.send({
    message: "wellcome",
  });
});

router.put(
  "/users/assign-permission/:id",
  userController.assignExtraPermissions
);
router.put(
  "/users/remove-permission/:id",
  userController.removeExtraPermissions
);
router.put(
  "/users/restrict-permission/:id",
  userController.restrictUsersPermission
);
router.put(
  "/users/remove-restrict-permission/:id",
  userController.removePermissionsRestricted
);
router.get("/users", userController.getUsers);
router.get("/users/count", userController.getUserCount);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.registerUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verifyToken", userController.verifyToken);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUser);
router.post(
  "/users/addGroupPermission/",
  PermissionController.addGroupPermissionToUser
);

// permission routes
router.put("/users/updateProfile/:id", userController.updateProfilePicture);
router.get("/permission", PermissionController.getAllPermission);
router.post("/permission/register", PermissionController.registerPermission);
router.put(
  "/permission/update/:permissionId",
  PermissionController.updatePermission
);
router.get("/permission/:permissionId", PermissionController.getPermissionById);
router.delete(
  "/permission/delete/:permissionId",
  PermissionController.deletePermission
);
// permission groups.

router.get(
  "/permission/getGroupPermissions/permissionId",
  groupPermissionController.getGroupPermissionsById
);
router.post(
  "/permission/groupPermissions",
  groupPermissionController.groupPermissions
);
router.put(
  "/permission/groupPermissions/:permissionId/:userId",
  groupPermissionController.updateGroupPermissions
);
router.delete(
  "/permission/groupPermissions/:permissionId",
  groupPermissionController.deleteGroupPermissions
);

module.exports = router;
router.get("/groupPermissions", groupPermissionController.getGroupPermissions);

module.exports = router;
