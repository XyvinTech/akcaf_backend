const responseHandler = require("../helpers/responseHandler");
const Feeds = require("../models/feedsModel");
const validations = require("../validations");

exports.createFeeds = async (req, res) => {
  try {
    const createFeedsValidator = validations.createFeedsSchema.validate(
      req.body,
      {
        abortEarly: true,
      }
    );

    if (createFeedsValidator.error) {
      return responseHandler(
        res,
        400,
        `Invalid input: ${createFeedsValidator.error}`
      );
    }

    const newFeeds = await Feeds.create(req.body);
    if (!newFeeds) {
      return responseHandler(res, 400, `Feeds creation failed...!`);
    }
    return responseHandler(
      res,
      201,
      `New Feeds created successfull..!`,
      newFeeds
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findFeeds = await Feeds.findById(id);
    if (findFeeds) {
      return responseHandler(res, 200, `Feeds found successfull..!`, findFeeds);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
