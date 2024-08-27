const moment = require("moment-timezone");
const responseHandler = require("../helpers/responseHandler");
const College = require("../models/collegeModel");
const validations = require("../validations");

exports.createCollege = async (req, res) => {
  try {
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
