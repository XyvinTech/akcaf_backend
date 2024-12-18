const responseHandler = require("../helpers/responseHandler");
const Time = require("../models/timeModel");
const validations = require("../validations");

exports.createTime = async (req, res) => {
  try {
    const { error } = validations.bulKaddTimeSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    for (const entry of req.body.addTimeSchema) {
      const { day, start, end } = entry;

      if (!start && !end) {
        await Time.findOneAndDelete({ day });
      } else {
        await Time.findOneAndUpdate(
          { day },
          { start, end },
          { new: true, upsert: true }
        );
      }
    }

    return responseHandler(res, 201, "Time data processed successfully");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
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
