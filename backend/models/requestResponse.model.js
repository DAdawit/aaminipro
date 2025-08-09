const mongoose = require("mongoose");

const RequestResponseSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request", // reference to your main case/request model
      required: true,
    },
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // who gave the response
      required: true,
    },
    responseText: {
      type: String,
      required: true,
    },
    responseDate: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who approved/rejected the response
    },
    approvalDate: {
      type: Date,
    },
    comments: {
      type: String, // optional additional notes on response or approval
    },
    isActive: {
      type: Boolean,
      default: true, // if you want to mark responses as active/obsolete
    },
  },
  {
    timestamps: true,
  }
);

const RequestResponse = mongoose.model(
  "RequestResponse",
  RequestResponseSchema
);
module.exports = RequestResponse;
