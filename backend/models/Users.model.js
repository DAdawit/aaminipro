const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isSuperAdmin: {
      type: String,
      default: "yes",
      enum: ["yes", "no"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
    },
    age: {
      type: Number,
      min: 10,
      max: 120,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    groupPermissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupPermissions",
      },
    ],
    extraPermissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    restrictedPermissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  virtuals: true,
});
const User = mongoose.model("User", userSchema);

module.exports = User;
