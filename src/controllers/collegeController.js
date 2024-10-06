const moment = require("moment-timezone");
const responseHandler = require("../helpers/responseHandler");
const College = require("../models/collegeModel");
const validations = require("../validations");
const checkAccess = require("../helpers/checkAccess");
const mongoose = require("mongoose");
const User = require("../models/userModel");

exports.createCollege = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { error } = validations.createCollegeSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const findCollege = await College.findOne({
      collegeName: req.body.collegeName,
    });
    if (findCollege)
      return responseHandler(
        res,
        409,
        `College with this email or phone already exists`
      );

    const batches = [];

    const currentYear = moment().year();

    if (req.body.startYear < currentYear) {
      for (let i = req.body.startYear; i <= currentYear; i++) {
        batches.push(i);
      }
    }

    req.body.batch = batches;

    const newCollege = await College.create(req.body);
    if (newCollege) {
      return responseHandler(
        res,
        201,
        `New College created successfull..!`,
        newCollege
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editCollege = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { id } = req.params;

    if (!id) {
      return responseHandler(res, 400, "College Id is required");
    }

    const { error } = validations.editCollegeSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const updateCollege = await College.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateCollege) {
      return responseHandler(
        res,
        200,
        `College updated successfull..!`,
        updateCollege
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getCollege = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { id } = req.params;

    if (!id) {
      return responseHandler(res, 400, "College Id is required");
    }

    const findCollege = await College.findById(id);
    if (findCollege) {
      return responseHandler(
        res,
        200,
        `College found successfull..!`,
        findCollege
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.deleteCollege = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { id } = req.params;

    if (!id) {
      return responseHandler(res, 400, "College Id is required");
    }

    const deleteCollege = await College.findByIdAndDelete(id);
    if (deleteCollege) {
      return responseHandler(res, 200, `College deleted successfull..!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.bulkCreateCollege = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { error } = validations.bulkCreateCollegeSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const colleges = req.body;
    const names = colleges.map((college) => college.collegeName);

    const existingColleges = await College.find({
      collegeName: { $in: names },
    });

    if (existingColleges.length > 0) {
      const duplicateColleges = existingColleges.map(
        (college) => college.collegeName
      );

      return responseHandler(res, 400, "Duplicate college names found", {
        duplicateColleges,
      });
    }

    const currentYear = moment().year();

    colleges.forEach((college) => {
      const batches = [];

      if (college.startYear < currentYear) {
        for (let i = college.startYear; i <= currentYear; i++) {
          batches.push(i);
        }
      }

      college.batch = batches;
    });

    const newColleges = await College.create(colleges);

    if (newColleges) {
      return responseHandler(
        res,
        201,
        `New Colleges created successfully..!`,
        newColleges
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllColleges = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("collegeManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { pageNo = 1, status, limit = 10, search } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    if (search) {
      filter.$or = [
        { collegeName: { $regex: search, $options: "i" } },
      ];
    }
    const totalCount = await College.countDocuments(filter);
    const aggregateQuery = [
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "college",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $addFields: {
          noOfMembers: { $size: "$members" },
          noOfCourses: {
            $cond: {
              if: { $isArray: "$course" },
              then: { $size: "$course" },
              else: 0,
            },
          },
          noOfBatches: {
            $cond: {
              if: { $isArray: "$batch" },
              then: { $size: "$batch" },
              else: 0,
            },
          },
        },
      },
      { $unset: "members" },
      { $sort: { createdAt: -1, _id: 1 } },
      { $skip: skipCount },
      { $limit: parseInt(limit) },
    ];

    const data = await College.aggregate(aggregateQuery);

    return responseHandler(
      res,
      200,
      `Colleges found successfull..!`,
      data,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getCollegeDropdown = async (req, res) => {
  try {
    const colleges = await College.find().populate("course");
    if (colleges) {
      return responseHandler(res, 200, `Colleges`, colleges);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getCouseWise = async (req, res) => {
  try {
    const { collegeId, courseId } = req.params;
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);

    const aggregateQuery = [
      {
        $match: {
          college: new mongoose.Types.ObjectId(collegeId),
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: "$batch",
          noOfMembers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: skipCount },
      { $limit: parseInt(limit) },
    ];

    const batchData = await User.aggregate(aggregateQuery);

    return responseHandler(res, 200, `Course wise Batch List`, batchData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getBatchWise = async (req, res) => {
  try {
    const { collegeId, courseId, batch } = req.params;
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const aggregateQuery = [
      {
        $match: {
          college: new mongoose.Types.ObjectId(collegeId),
          course: new mongoose.Types.ObjectId(courseId),
          batch: parseInt(batch),
        },
      },
      {
        $addFields: {
          fullName: {
            $concat: ["$name.first", " ", "$name.middle", " ", "$name.last"],
          },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: skipCount },
      { $limit: parseInt(limit) },
    ];

    const batchData = await User.aggregate(aggregateQuery);
    return responseHandler(res, 200, `Batch wise List`, batchData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.createCollegeBulk = async (req, res) => {
  try {
    const { error } = validations.bulkCreateCollegeSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    const colleges = await College.create(req.body);
    return responseHandler(res, 201, "Colleges created successfully", colleges);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
