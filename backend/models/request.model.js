const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    request_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
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
    requestResponse: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestResponse",
      },
    ],
  },
  {
    timestamps: true,
  }
);

RequestSchema.set("toJSON", { virtuals: true });

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
