const mongoose = require("mongoose");
const responseHandler = require("../helpers/responseHandler");
const Feeds = require("../models/feedsModel");
const User = require("../models/userModel");
const sendInAppNotification = require("../utils/sendInAppNotification");
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
      `New Feeds created successfully..!`,
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
      return responseHandler(
        res,
        200,
        `Feeds found successfully..!`,
        findFeeds
      );
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
        "Feeds deleted successfullyy!",
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
        select: "fullName image",
      })
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();

    return responseHandler(
      res,
      200,
      `Feeds found successfully..!`,
      data,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllFeedsForAdmin = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10, search, status } = req.query;
    const skipCount = (pageNo - 1) * limit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (req.role === "user") {
      const findUser = await User.findById(req.userId);
      if (!findUser || findUser.role === "member") {
        return responseHandler(
          res,
          403,
          "You don't have permission to perform this action"
        );
      }
      filter["author.college"] = findUser.college;
    }

    if (search) {
      filter.$or = [{ type: { $regex: search, $options: "i" } }];
    }

    const pipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $match: {
          ...(filter["author.college"] && {
            "author.college": new mongoose.Types.ObjectId(filter["author.college"]),
          }),
        },
      },
      {
        $lookup: {
          from: "colleges",
          localField: "author.college",
          foreignField: "_id",
          as: "author.collegeDetails",
        },
      },
      {
        $project: {
          author: {
            fullName: 1,
            college: 1,
            collegeDetails: { $arrayElemAt: ["$author.collegeDetails", 0] },
          },
          type: 1,
          media: 1,
          link: 1,
          content: 1,
          status: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skipCount,
      },
      {
        $limit: Number(limit),
      },
    ];

    const data = await Feeds.aggregate(pipeline);

    const totalCount = await Feeds.countDocuments(filter);

    return responseHandler(
      res,
      200,
      `Feeds found successfully..!`,
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
        "Feeds unliked successfullyy",
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

    const toUser = await User.findById(updateFeeds.author).select("fcm");
    const fromUser = await User.findById(req.userId).select("fullName");
    const fcmUser = [toUser.fcm];

    if (req.userId !== String(updateFeeds.author)) {
      await sendInAppNotification(
        fcmUser,
        `${fromUser.fullName} Liked Your Post`,
        `${fromUser.fullName} Liked Your ${updateFeeds.content}`
      );

      await Notification.create({
        users: toUser._id,
        subject: `${fromUser.fullName} Liked Your Post`,
        content: `${fromUser.fullName} Liked Your ${updateFeeds.content}`,
        type: "in-app",
      });
    }

    return responseHandler(res, 200, "Feeds liked successfullyy", updateFeeds);
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

    const toUser = await User.findById(updateFeeds.author).select("fcm");
    const fromUser = await User.findById(req.userId).select("fullName");
    const fcmUser = [toUser.fcm];

    if (req.userId !== String(updateFeeds.author)) {
      await sendInAppNotification(
        fcmUser,
        `${fromUser.fullName} Commented Your Post`,
        `${fromUser.fullName} Commented Your ${updateFeeds.content}`
      );

      await Notification.create({
        users: toUser._id,
        subject: `${fromUser.fullName} Commented Your Post`,
        content: `${fromUser.fullName} Commented Your ${updateFeeds.content}`,
        type: "in-app",
      });
    }

    return responseHandler(
      res,
      200,
      "Feeds commented successfullyy",
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
    return responseHandler(res, 200, "Feeds found successfully..!", findFeeds);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateFeeds = async (req, res) => {
  try {
    if (req.role === "user") {
      const findUser = await User.findById(req.userId);
      if (findUser.role === "member") {
        return responseHandler(
          res,
          404,
          "You don't have permission to perform this action"
        );
      }
    }

    const { id, action } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Feeds with this Id is required");
    }

    const findFeeds = await Feeds.findById(id);
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }

    const toUser = await User.findById(findFeeds.author).select("fcm");
    const fcmUser = [toUser.fcm];

    await sendInAppNotification(
      fcmUser,
      `Your Feed request has been ${action}`,
      `Your Feed request has been ${action} for ${findFeeds.content}`,
      "https://akcaf.page.link/my_posts"
    );

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
        "Feeds accepted successfullyy",
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
        "Feeds rejected successfullyy",
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
      "fullName image"
    );
    if (!findFeeds) {
      return responseHandler(res, 404, "Feeds not found");
    }
    return responseHandler(res, 200, "Feeds found successfully..!", findFeeds);
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
    return responseHandler(res, 200, `Feeds not interest added successfullyy`);
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
    return responseHandler(
      res,
      200,
      `Feeds not interest removed successfullyy`
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
