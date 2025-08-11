const { default: mongoose } = require("mongoose");
const User = require("../models/Users.model");
const fileUploader = require("../utils/fileUploader");
const Request = require("../models/request.model");

const sendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(404).json({
        message: "The id is not found",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({
        message: "The user is is not valid",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "The user is not found",
      });
    }

    // const { fields, files } = await fileUploader(req);
    // const tempfiles = Object.values(files || {}).map(
    //   (file) => file.originalname
    // );
    const files = [];
    // console.log(tempfiles);
    const { title, description, assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(404).json({
        message: "The assigned user id is not found.",
      });
    }
    if (!mongoose.isValidObjectId(assignedTo)) {
      return res.status(404).json({
        message: "The assigned user id is not valid",
      });
    }
    const assignedUser = await User.findOne({ _id: assignedTo });
    if (!assignedUser) {
      return res.status(404).json({
        message: "The assigned user is not found",
      });
    }
    if (!title) {
      return res.status(404).json({
        message: "The case title is required",
      });
    }
    const newRequest = new Request({
      title,
      description,
      createdBy: userId,
      assignedTo,
      attachments: files.length === 0 ? [] : files,
    });
    await newRequest.save();
    return res.status(201).json({
      message: "The request sended",
      request: newRequest,
    });
  } catch (error) {
    console.log("Error on send request:", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
const updateRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.params;
    if (!userId) {
      return res.status(404).json({
        message: "The id is not found",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({
        message: "The user is is not valid",
      });
    }
    if (!requestId) {
      return res.status(404).json({
        message: "The request id is not found.",
      });
    }
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(404).json({
        message: "The request id is not valid",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "The user is not found",
      });
    }
    const requestedCase = await Request.findOne({ _id: requestId });
    if (!requestedCase) {
      return res.status(404).json({
        message: "The request is not found",
      });
    }
    const { fields, files } = await fileUploader(req);
    const { title, description, assignedTo } = fields;
    if (!assignedTo) {
      return res.status(404).json({
        message: "The assigned person is required",
      });
    }
    if (!mongoose.isValidObjectId(assignedTo)) {
      return res.status(404).json({
        message: "The assigned id is not valid",
      });
    }
    const assignedUser = await User.findOne({ _id: assignedTo });
    if (!assignedUser) {
      return res.status(404).json({
        message: "The request is not found",
      });
    }
    const updatedRequest = await User.findByIdAndUpdate(requestId, {
      title: title ? title : requestedCase.title,
      assignedTo: assignedTo ? assignedTo : requestedCase.assignedTo,
      description: description ? description : requestedCase.description,
      attachments: attachments.length === 0 ? requestedCase.attachments : files,
    });
    return res.status(201).json({
      message: "The request updated successfully.",
      request: updatedRequest,
    });
  } catch (error) {
    console.log("Error on send request:", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
const getAllRequest = async (req, res) => {
  try {
    let { status, request_status, assignedTo, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (status) filter.status = status;
    if (request_status) filter.request_status = request_status;
    if (assignedTo) filter.assignedTo = assignedTo;
    const [requests, total] = await Promise.all([
      Request.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate({
          path: "requestResponse",
          populate: { path: "responder", select: "name email" },
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Request.countDocuments(filter),
    ]);
    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: requests,
    });
  } catch (error) {
    console.log("error on get all requests:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
// get by id
const getRequestById = async (req, res) => {
  try {
    const { userId, requestId } = req.params;
    if (!userId) {
      return res.status(404).json({
        message: "The id is not found",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(404).json({
        message: "The user is is not valid",
      });
    }
    if (!requestId) {
      return res.status(404).json({
        message: "The request id is not found.",
      });
    }
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(404).json({
        message: "The request id is not valid",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "The user is not found",
      });
    }
    const requestedCase = await Request.findOne({
      $and: [{ _id: requestId }, { user: user._id }],
    });

    if (!requestedCase) {
      return res.status(404).json({
        message: "The request is not found",
      });
    }
    return res.status(200).json({
      request: requestedCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server user.",
    });
  }
};
const deleteRequests = async (req, res) => {
  try {
    const { userId } = req.params;

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

    const { requestIds } = req.body;
    if (!Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ message: "requestIds is not array." });
    }

    const tempRequests = [];

    for (const requestId of requestIds) {
      if (!requestId) {
        return res.status(404).json({
          message: "The request id is not found.",
        });
      }
      if (!mongoose.isValidObjectId(requestId)) {
        return res.status(404).json({
          message: "The request id is not valid",
        });
      }

      const requestedCase = await Request.findById(requestId);
      if (!requestedCase) {
        return res.status(404).json({
          message: "The request is not found",
        });
      }

      tempRequests.push(requestId);
    }
    await Request.deleteMany({ _id: { $in: tempRequests } });

    return res.status(200).json({
      message: `${tempRequests.length} request deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  sendRequest,
  updateRequest,
  getAllRequest,
  getRequestById,
  deleteRequests,
};
