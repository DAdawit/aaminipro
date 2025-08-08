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

router.post(
  "/users/assign-permission/:id",
  userController.assignExtraPermissions
);
router.post(
  "/users/restrict-permission/:id",
  userController.restrictUsersPermission
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
router.get(
  "/permission/getGroupPermissions",
  groupPermissionController.getGroupPermissions
);
router.post(
  "/permission/groupPermissions",
  groupPermissionController.groupPermissions
);
