const responseHandler = require("../helpers/responseHandler");
const Feeds = require("../models/feedsModel");
const Message = require("../models/messageModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const validations = require("../validations");

exports.createReport = async (req, res) => {
  try {
    const { error } = validations.createReport.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }
    req.body.reportBy = req.userId;
    const newReport = await Report.create(req.body);
    if (newReport) {
      return responseHandler(
        res,
        201,
        "Report created successfullyy",
        newReport
      );
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getReports = async (req, res) => {
  try {
    const { pageNo = 1, limit = 10, search } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};

    if (search) {
      filter.$or = [{ reportType: { $regex: search, $options: "i" } }];
    }
    const totalCount = await Report.countDocuments(filter);
    const data = await Report.find(filter)
      .populate("reportBy", "fullName")
      .populate("content")
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();

    const mappedData = data.map((item) => {
      let content = "";

      if (item.reportType === "Feeds") {
        content = item.content?.content || "";
      } else if (item.reportType === "User") {
        content = `${item.content?.fullName || ""}`;
      } else if (item.reportType === "Message") {
        content = item.content?.content || "Chat";
      }

      return {
        _id: item._id,
        content: content,
        reportType: item.reportType,
        reportBy: `${item.reportBy?.fullName || ""}`,
        description: item.description,
        status: item.status,
      };
    });

    return responseHandler(
      res,
      200,
      `Reports found successfully..!`,
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Report id is required`);
    }
    const report = await Report.findById(id);
    if (!report) {
      return responseHandler(res, 404, `Report not found`);
    }
    report.status = req.body.status;
    await report.save();
    if (req.body.status === "approved") {
      if (report.reportType === "Feeds") {
        const feed = await Feeds.findById(report.content);
        if (feed) {
          feed.status = "reported";
          await feed.save();
        }
      } else if (report.reportType === "Message") {
        await Message.findByIdAndDelete(report.content);
      } else if (report.reportType === "User") {
        const user = await User.findById(report.content);
        if (user) {
          user.status = "blocked";
          await user.save();
        }
      }
    }
    return responseHandler(res, 200, `Report status updated successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, `Report id is required`);
    }
    const report = await Report.findById(id)
      .populate("reportBy", "fullName")
      .populate("content");
    if (!report) {
      return responseHandler(res, 404, `Report not found`);
    }
    return responseHandler(res, 200, `Report found successfully`, report);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
