const User = require("../models/user.model");
const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized: User not logged in" });
      }

      // Normalize requiredPermissions to an array
      const permissionsRequired = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Fetch user with group, extra and restricted permissions
      const user = await User.findById(req.user._id)
        .populate({
          path: "GroupPermissions",
          populate: { path: "permissions", select: "code", model: "Permission" }
        })
        .populate({ path: "extraPermissions", select: "code" })
        .populate({ path: "restrictedPermissions", select: "code" });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Aggregate all permission codes
      const groupPermissions = user.GroupPermissions.flatMap(group =>
        group.permissions.map(p => p.code)
      );
      const extraPermissions = user.extraPermissions.map(p => p.code);
      const restrictedPermissions = user.restrictedPermissions.map(p => p.code);

      // Combine group and extra permissions
      const allowedPermissions = new Set([
        ...groupPermissions,
        ...extraPermissions
      ]);

      // Remove restricted permissions
      restrictedPermissions.forEach(code => allowedPermissions.delete(code));

      // Check if user has all required permissions
      const hasAllPermissions = permissionsRequired.every(code =>
        allowedPermissions.has(code)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error("Permission check failed:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkPermission;
