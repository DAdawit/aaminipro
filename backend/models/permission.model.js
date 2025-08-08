const mongoose = require("mongoose");
// permission schema creation
<<<<<<< HEAD
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codeName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
=======
const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    codeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
>>>>>>> 37b31ed36be1c8a03e421a9b44ff981b447a4579
  }
);

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
