const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  aggrement: {
    type: Boolean,
    required: true,
  },
  isAdimn: {
    type: String,
    default: false,
  },
});
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
const User = mongoose.model("User", userSchema);

module.exports = User;
