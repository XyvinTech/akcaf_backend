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
    req.body.author = req.userId;
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

exports.getAllFeeds = async (req, res) => {
  try {
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    const totalCount = await Feeds.countDocuments(filter);
    const data = await Feeds.find(filter)
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return responseHandler(
      res,
      200,
      `Feeds found successfull..!`,
      data,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
