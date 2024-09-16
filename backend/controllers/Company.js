const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Company = require("../models/Company");

const getCompanies = async (req, res) => {
  const { search, location, industry, sortBy, sortOrder, page, limit } = req.query;
  console.log(req.user,"the user")
  const { userId } = req.user;


  const filters = { createdBy: userId }; 

  if (location) {
    filters.location = { $in: location.split(",") };
  }

  if (industry) {
    filters.industry = { $in: industry.split(",") };
  }

  let query = Company.find(filters).populate("createdBy", "name email");

  if (search) {
    const searchRegex = new RegExp(search, "i");
    query = query.or([{ name: searchRegex }, { description: searchRegex }]);
  }

  if (sortBy) {
    const sortOptions = {
      mostRecent: { field: "createdAt", order: -1 },
      oldest: { field: "createdAt", order: 1 },
      ascendingName: { field: "name", order: 1, collation: { locale: "en", strength: 1 } },
      descendingName: { field: "name", order: -1 },
    };

    if (!sortOptions[sortBy]) {
      throw new Error("Invalid sortBy option");
    }

    const { field, order, collation } = sortOptions[sortBy];
    const sort = { [field]: sortOrder === "desc" ? -order : order };
    query = query.sort(sort).collation(collation);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  try {
    const companies = await query.exec();
    let totalCountQuery = Company.find(filters);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      totalCountQuery = totalCountQuery.or([{ name: searchRegex }, { description: searchRegex }]);
    }

    const totalCount = await totalCountQuery.countDocuments();
    res.status(StatusCodes.OK).json({ companies, totalCount });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createCompany = async (req, res) => {
  const { userId } = req.user;
  const file = req.file;
  let newCompanyData = { ...req.body };

  if (file) {
    newCompanyData.logo = file.path;
  }

  try {
    const company = await Company.create({
      ...newCompanyData,
      createdBy: userId,
    });

    res.status(StatusCodes.CREATED).json(company);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id: companyId } = req.params;
  const { userId } = req.user;
  const file = req.file;
  let updateData = { ...req.body };

  if (file) {
    updateData.logo = file.path;
  }

  try {
    const company = await Company.findById(companyId);

    if (!company || !company.createdBy.equals(mongoose.Types.ObjectId(userId))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized to update this company." });
    }

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true, runValidators: true });
    res.status(StatusCodes.OK).json(updatedCompany);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { id: companyId } = req.params;
  const { userId } = req.user;

  try {
    const company = await Company.findById(companyId);

    if (!company || !company.createdBy.equals(mongoose.Types.ObjectId(userId))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "You are not authorized to delete this company." });
    }

    const deletedCompany = await Company.findByIdAndDelete(companyId);
    res.status(StatusCodes.OK).json(deletedCompany);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
