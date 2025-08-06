const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
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
});
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
const User = mongoose.model("User", userSchema);

module.exports = User;
