const responseHandler = require("../helpers/responseHandler");
const Feeds = require("../models/feedsModel");
const User = require("../models/userModel");
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

exports.deletefeeds = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const deleteFeeds = await Feeds.findByIdAndDelete(id);
    if (deleteFeeds) {
      return responseHandler(
        res,
        200,
        "Feeds deleted successfully!",
        deleteFeeds
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllFeeds = async (req, res) => {
  try {
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const currentUser = await User.findById(req.userId).select(
      "blockedUsers notInterestedPosts"
    );
    const blockedUsersList = currentUser.blockedUsers;
    const notInterestedUsersList = currentUser.notInterestedPosts;

    const filter = {
      status: "published",
      author: {
        $nin: [...blockedUsersList, ...notInterestedUsersList],
      },
    };
    const totalCount = await Feeds.countDocuments(filter);
    const data = await Feeds.find(filter)
      .populate({
        path: "comment.user",
        select: "name image",
      })
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
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

exports.likeFeed = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findFeeds = await Feeds.findById(id);
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }

    if (findFeeds.like.includes(req.userId)) {
      const updateFeeds = await Feeds.findByIdAndUpdate(
        id,
        {
          $pull: { like: req.userId },
        },
        { new: true }
      );
      return responseHandler(
        res,
        200,
        "Feeds unliked successfully",
        updateFeeds
      );
    }

    const updateFeeds = await Feeds.findByIdAndUpdate(
      id,
      {
        $push: { like: req.userId },
      },
      { new: true }
    );
    return responseHandler(res, 200, "Feeds liked successfully", updateFeeds);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.commentFeed = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findFeeds = await Feeds.findById(id);
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }

    const updateFeeds = await Feeds.findByIdAndUpdate(
      id,
      {
        $push: {
          comment: {
            user: req.userId,
            comment: req.body.comment,
          },
        },
      },
      { new: true }
    );

    return responseHandler(
      res,
      200,
      "Feeds commented successfully",
      updateFeeds
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getUserFeeds = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }
    const findFeeds = await Feeds.find({ author: id });
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }
    return responseHandler(res, 200, "Feeds found successfull..!", findFeeds);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateFeeds = async (req, res) => {
  try {
    const { id, action } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findFeeds = await Feeds.findById(id);
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }

    if (action === "accept") {
      const updateFeeds = await Feeds.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "published",
          },
        },
        { new: true }
      );
      return responseHandler(
        res,
        200,
        "Feeds accepted successfully",
        updateFeeds
      );
    } else if (action === "reject") {
      const updateFeeds = await Feeds.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "rejected",
            reason: req.body.reason,
          },
        },
        { new: true }
      );
      return responseHandler(
        res,
        200,
        "Feeds rejected successfully",
        updateFeeds
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getMyFeeds = async (req, res) => {
  try {
    const findFeeds = await Feeds.find({ author: req.userId }).populate(
      "comment.user",
      "name image"
    );
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }
    return responseHandler(res, 200, "Feeds found successfull..!", findFeeds);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.notInterested = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findUser = await User.findById(req.userId);
    findUser.notInterestedPosts.push(id);
    const notInterested = await findUser.save();

    if (!notInterested) {
      return responseHandler(res, 400, `Feeds update failed...!`);
    }
    return responseHandler(res, 200, `Feeds not interest added successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.interestedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findUser = await User.findById(req.userId);
    findUser.notInterestedPosts = findUser.notInterestedPosts.filter(
      (post) => post.toString() !== id
    );
    const interested = await findUser.save();

    if (!interested) {
      return responseHandler(res, 400, `Feeds update failed...!`);
    }
    return responseHandler(res, 200, `Feeds not interest removed successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
