const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

messageSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
messageSchema.set("toJSON", {
  virtuals: true,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
