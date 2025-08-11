const { default: mongoose } = require("mongoose");
const Request = require("../models/request.model");
const RequestResponse = require("../models/RequestResponse.model");
const User = require("../models/Users.model");
const fileUploader = require("../utils/fileUploader");

const submitResponse = async (req, res) => {
  try {
    const { requestId, userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required." });
    }
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid request ID." });
    }
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }
    // use it later
    // const { fields, files } = await fileUploader(req);
    // const { responseText, comments } = fields;
    let files = [];
    const { responseText, comments } = req.body;

    if (!responseText) {
      return res.status(400).json({ message: "Response text is required." });
    }
    const response = new RequestResponse({
      caseId: requestId,
      responder: userId,
      responseText,
      comments: comments || "",
      attachments: files.length === 0 ? [] : files,
      approved: "no",
    });

    const savedResponse = await response.save();

    request.requestResponse.push(savedResponse._id);
    await request.save();

    return res.status(201).json({
      message: "Response submitted successfully.",
      response: savedResponse,
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
// approve the response
const approveResponse = async (req, res) => {
  try {
    const { responseId, userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!responseId) {
      return res.status(400).json({ message: "Response ID is required." });
    }
    if (!mongoose.isValidObjectId(responseId)) {
      return res.status(400).json({ message: "Invalid response ID." });
    }
    const response = await RequestResponse.findById(responseId).populate(
      "caseId"
    );
    if (!response) {
      return res.status(404).json({ message: "Response not found." });
    }
    const { approved, comments } = req.body;

    if (!["yes", "no"].includes(approved)) {
      return res.status(400).json({ message: "must contain only yes or no." });
    }

    response.approved = approved;
    response.approvedBy = userId;
    response.approvalDate = Date.now();
    if (comments) response.comments = comments;

    const updatedResponse = await response.save();

    const request = response.caseId;
    request.request_status = approved === "yes" ? "approved" : "rejected";
    request.status = approved === "yes" ? "closed" : "open";
    await request.save();

    return res.status(200).json({
      message: `Response ${
        approved === "yes" ? "approved" : "rejected"
      } successfully.`,
      response: updatedResponse,
    });
  } catch (error) {
    console.error("Error approving response:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getResponsesByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required." });
    }
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({ message: "Invalid request ID." });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    const { userId } = req.query;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid userId is required." });
    }

    if (
      request.createdBy.toString() !== userId &&
      request.assignedTo.toString() !== userId
    ) {
      return res.status(403).json({
        message:
          "Access denied. You are not authorized to view these responses.",
      });
    }

    const responses = await RequestResponse.find({ caseId: requestId })
      .populate("responder", "name email")
      .populate("approvedBy", "name email")
      .sort({ responseDate: -1 });

    return res.status(200).json({
      total: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const updateResponse = async (req, res) => {
  try {
    const { responseId, userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    if (!responseId) {
      return res.status(400).json({ message: "Response ID is required." });
    }
    if (!mongoose.isValidObjectId(responseId)) {
      return res.status(400).json({ message: "Invalid response ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const response = await RequestResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: "Response not found." });
    }

    if (response.responder.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to edit this response.",
      });
    }

    if (response.approved !== "no") {
      return res.status(400).json({
        message: "Cannot edit response after it has been approved or rejected.",
      });
    }

    const { fields, files } = await fileUploader(req);
    const { responseText, comments } = fields;

    if (responseText) response.responseText = responseText;
    if (comments) response.comments = comments;
    if (files.length > 0) response.attachments = files;

    const updated = await response.save();

    return res.status(200).json({
      message: "Response updated successfully.",
      response: updated,
    });
  } catch (error) {
    console.error("Error updating response:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const deleteResponse = async (req, res) => {
  try {
    const { responseId, userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    if (!responseId) {
      return res.status(400).json({ message: "Response ID is required." });
    }
    if (!mongoose.isValidObjectId(responseId)) {
      return res.status(400).json({ message: "Invalid response ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const response = await RequestResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: "Response not found." });
    }

    if (response.responder.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this response.",
      });
    }

    if (response.approved !== "no") {
      return res.status(400).json({
        message: "Cannot delete response after approval.",
      });
    }

    await Request.updateOne(
      { _id: response.caseId },
      { $pull: { requestResponse: response._id } }
    );

    await RequestResponse.findByIdAndDelete(responseId);

    return res.status(200).json({
      message: "Response deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting response:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  submitResponse,
  approveResponse,
  getResponsesByRequestId,
  updateResponse,
  deleteResponse,
};
