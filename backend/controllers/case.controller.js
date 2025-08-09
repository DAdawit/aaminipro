const Case = require("../models/case.model");

const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("createdBy", "name")
      .populate("assignedTo", "name");
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cases", error });
  }
};

const getCaseById = async (req, res) => {
  return res.send("get by id");
};
const createCase = async (req, res) => {
  return res.send("create case");
};
const updateCase = async (req, res) => {
  return res.send("update case");
};
const deleteCase = async (req, res) => {
  return res.send("delete case");
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
};
