const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const groupPermissionController = require("../controllers/groupPermission.controller");
const caseController = require("../controllers/case.controller");
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

router.post(
  "/permission/groupPermissions",
  groupPermissionController.groupPermissions
);
router.get("/groupPermissions", groupPermissionController.getGroupPermissions);
router.put(
  "/groupPermissions/:id",
  groupPermissionController.updateGroupPermission
);
router.delete(
  "/groupPermissions/:id",
  groupPermissionController.deleteGroupPermission
);
router.get(
  "/groupPermissions/:id",
  groupPermissionController.getGroupPermissionById
);
router.put(
  "/groupPermissions/removeSinglePermission/:id",
  groupPermissionController.removeSinglePermissionFromGroup
);

// case routes

router.get("/cases", caseController.getAllCases);
router.get("/cases/:id", caseController.getCaseById);
router.post("/cases", caseController.createCase);
router.put("/cases/:id", caseController.updateCase);
router.delete("/cases/:id", caseController.deleteCase);

module.exports = router;
