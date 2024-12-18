const responseHandler = require("../helpers/responseHandler");
const Time = require("../models/timeModel");
const validations = require("../validations");

exports.createTime = async (req, res) => {
  try {
    const { error } = validations.addTimeSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const newTime = await Time.create(req.body);
    if (newTime) {
      return responseHandler(res, 201, "Time created successfullyy", newTime);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editTime = async (req, res) => {
  try {
    const { day } = req.params;

    if (!day) {
      return responseHandler(res, 400, "Day is required");
    }

    const { error } = validations.addTimeSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const findTime = await Time.findOne({ day });
    if (!findTime) {
      return responseHandler(res, 404, "Time not found");
    }

    const updatedTime = await Time.findOneAndUpdate(
      { day },
      { $set: req.body },
      { new: true }
    );
    if (updatedTime) {
      return responseHandler(
        res,
        200,
        "Time updated successfully",
        updatedTime
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getTimes = async (req, res) => {
  try {
    const findTime = await Time.find();
    if (findTime) {
      return responseHandler(res, 200, "Time found", findTime);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.deleteTime = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Time with this Id is required");
    }
    const findTime = await Time.findById(id);
    if (!findTime) {
      return responseHandler(res, 404, "Time not found");
    }
    const deleteTime = await Time.findByIdAndDelete(id);
    if (!deleteTime) {
      return responseHandler(res, 400, `Time delete failed...!`);
    }
    return responseHandler(res, 200, `Time deleted successfullyy..!`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getTime = async (req, res) => {
  try {
    const { day } = req.params;
    if (!day) {
      return responseHandler(res, 400, "Day is required");
    }
    const findTime = await Time.findOne({ day });
    if (!findTime) {
      return responseHandler(res, 404, "Time not found");
    }
    return responseHandler(res, 200, "Time found", findTime);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
