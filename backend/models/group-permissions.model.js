const mongoose = require("mongoose");
// group schema
const groupPermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
groupPermissionSchema.set("toJSON", {
  virtuals: true,
});
const GroupPermission = mongoose.model(
  "GroupPermissions",
  groupPermissionSchema
);
module.exports = GroupPermission;
