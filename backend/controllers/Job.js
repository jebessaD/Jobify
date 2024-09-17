const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const OpenAI = require("openai");

const axios = require("axios");
const Job = require("../models/Job");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getJobs = async (req, res) => {
  const {
    search,
    location,
    company,
    sortBy,
    sortOrder,
    page,
    limit,
    minSalary,
    maxSalary,
  } = req.query;
  const { userId } = req.user;

  const filters = { createdBy: userId };

  if (company) {
    filters.company = company;
  }

  if (location) {
    filters.location = new RegExp(location, "i");
  }

  if (minSalary || maxSalary) {
    filters.salary = {};
    if (minSalary) filters.salary.$gte = Number(minSalary);
    if (maxSalary) filters.salary.$lte = Number(maxSalary);
  }

  let query = Job.find(filters)
    .populate("company", "name logo website")
    .populate("createdBy", "name email role");

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query = query.or([
      { title: searchRegex },
      { description: searchRegex },
      { requirements: searchRegex },
    ]);
  }

  if (sortBy) {
    const sortOptions = {
      mostRecent: { field: "createdAt", order: -1 },
      oldest: { field: "createdAt", order: 1 },
      ascendingTitle: { field: "title", order: 1 },
      descendingTitle: { field: "title", order: -1 },
    };

    if (!sortOptions[sortBy]) {
      throw new Error("Invalid sortBy option");
    }

    const { field, order } = sortOptions[sortBy];
    const sort = { [field]: sortOrder === "desc" ? -order : order };
    query = query.sort(sort);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  try {
    const jobs = await query.exec();

    let totalCountQuery = Job.find(filters);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      totalCountQuery = totalCountQuery.or([
        { title: searchRegex },
        { description: searchRegex },
        { requirements: searchRegex },
      ]);
    }

    const totalCount = await totalCountQuery.countDocuments();

    res.status(StatusCodes.OK).json({ jobs, totalCount });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const listAllJobs = async (req, res) => {
  const {
    search,
    location,
    company,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
    minSalary,
    maxSalary,
  } = req.query;

  const filters = {};

  if (location) {
    filters.location = new RegExp(location, "i");
  }

  if (company) {
    filters.company = company;
  }

  if (minSalary || maxSalary) {
    filters.salary = {};
    if (minSalary) filters.salary.$gte = Number(minSalary);
    if (maxSalary) filters.salary.$lte = Number(maxSalary);
  }

  let query = Job.find(filters)
    .populate("company", "name logo website")
    .populate("createdBy", "name email role");

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query = query.or([
      { title: searchRegex },
      { description: searchRegex },
      { requirements: searchRegex },
    ]);
  }

  if (sortBy) {
    const sortOptions = {
      mostRecent: { field: "createdAt", order: -1 },
      oldest: { field: "createdAt", order: 1 },
      ascendingTitle: { field: "title", order: 1 },
      descendingTitle: { field: "title", order: -1 },
    };

    if (!sortOptions[sortBy]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid sortBy option" });
    }

    const { field, order } = sortOptions[sortBy];
    query = query.sort({ [field]: sortOrder === "desc" ? -order : order });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  try {
    const jobs = await query.exec();

    let totalCountQuery = Job.find(filters);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      totalCountQuery = totalCountQuery.or([
        { title: searchRegex },
        { description: searchRegex },
        { requirements: searchRegex },
      ]);
    }

    const totalCount = await totalCountQuery.countDocuments();

    res.status(StatusCodes.OK).json({ jobs, totalCount });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  const { userId } = req.user;

  try {
    const job = await Job.create({
      ...req.body,
      createdBy: userId,
    });

    res.status(StatusCodes.CREATED).json(job);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  try {
    const job = await Job.findById(jobId);

    if (!job || !job.createdBy.equals(mongoose.Types.ObjectId(userId))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You are not authorized to update this job." });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json(updatedJob);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  try {
    const job = await Job.findById(jobId);

    if (!job || !job.createdBy.equals(mongoose.Types.ObjectId(userId))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You are not authorized to delete this job." });
    }

    const deletedJob = await Job.findByIdAndDelete(jobId);

    res.status(StatusCodes.OK).json(deletedJob);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const generateJobDescription = async (req, res) => {
  const { title, company } = req.body;
  console.log(title,"the title")

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates job descriptions using only title and company name.",
        },
        {
          role: "user",
          content: `Generate a simple job description for a ${title} position at ${company}. just using 2 data only`,
        },
      ],
      max_tokens: 150,
    });

    const jobDescription = response?.choices?.[0]?.message?.content;
    res.status(StatusCodes.OK).json({ description: jobDescription });
  } catch (error) {
    console.error(
      "Error generating job description:",
      error.response ? error.response.data : error.message
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to generate job description" });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  listAllJobs,
  generateJobDescription,
};
