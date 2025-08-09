const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    response: {
      type: String,
      default: null,
    },
    responseGiven: {
      type: Boolean,
      default: false,
    },
    responseApproved: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  },
  {
    timestamps: true,
  }
);
CaseSchema.set("toJSON", {
  virtuals: true,
});
const Request = mongoose.model("Request", CaseSchema);

module.exports = Request;
