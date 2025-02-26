const moment = require("moment-timezone");
const { getMessaging } = require("firebase-admin/messaging");
const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const { comparePasswords, hashPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/generateToken");
const validations = require("../validations");
const sendMail = require("../utils/sendMail");
const { generateRandomPassword } = require("../utils/generateRandomPassword");
const College = require("../models/collegeModel");
const Payment = require("../models/paymentModel");
const Event = require("../models/eventModel");
const News = require("../models/newsModel");
const Promotion = require("../models/promotionModel");
const Feeds = require("../models/feedsModel");
const { generateUniqueDigit } = require("../utils/generateUniqueDigit");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseHandler(res, 400, "Email and password are required");
    }

    const findAdmin = await Admin.findOne({ email });
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }

    const comparePassword = await comparePasswords(
      password,
      findAdmin.password
    );
    if (!comparePassword) {
      return responseHandler(res, 401, "Invalid password");
    }

    const token = generateToken(findAdmin._id, findAdmin.role);

    return responseHandler(res, 200, "Login successfully", token);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { error } = validations.createAdminSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const findAdmin = await Admin.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (findAdmin)
      return responseHandler(
        res,
        409,
        `Admin with this email or phone already exists`
      );

    const generatedPassword = generateRandomPassword();

    const hashedPassword = await hashPassword(generatedPassword);
    req.body.password = hashedPassword;

    const data = {
      to: req.body.email,
      subject: "Admin Registration Notification",
      text: `Hello, ${req.body.name}. 
      You have been registered as an admin on the platform. 
      Please use the following credentials to log in: Email: ${req.body.email} Password: ${generatedPassword} 
      Thank you for joining us! 
      Best regards, The Admin Team`,
    };

    await sendMail(data);

    const newAdmin = await Admin.create(req.body);

    if (newAdmin) {
      return responseHandler(
        res,
        201,
        `New Admin created successfully..!`,
        newAdmin
      );
    } else {
      return responseHandler(res, 400, `Admin creation failed...!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }
    const findAdmin = await Admin.findById(id)
      .select("-password")
      .populate("role", "permissions roleName")
      .lean();
    const mappedData = {
      ...findAdmin,
      createdAt: moment(findAdmin.createdAt).format("MMM DD YYYY"),
    };
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    return responseHandler(res, 200, "Admin found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { pageNo = 1, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {
      _id: { $nin: ["66cef136282563d7bb086e30", req.userId] },
    };
    const totalCount = await Admin.countDocuments(filter);
    const data = await Admin.find(filter)
      .skip(skipCount)
      .limit(limit)
      .populate("role")
      .populate("college")
      .sort({ createdAt: -1, _id: 1 })
      .lean();

    const mappedData = data.map((user) => {
      return {
        ...user,
        college: user.college?.collegeName,
        fullName: user.name,
      };
    });

    return responseHandler(
      res,
      200,
      `Admins found successfully..!`,
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.fetchAdmin = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }
    const findAdmin = await Admin.findById(id)
      .select("-password")
      .populate("role", "permissions")
      .lean();
    const mappedData = {
      ...findAdmin,
      createdAt: moment(findAdmin.createdAt).format("MMM DD YYYY"),
    };
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    return responseHandler(res, 200, "Admin found", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editAdmin = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { error } = validations.editAdminSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }

    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }

    const editAdmin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!editAdmin) {
      return responseHandler(res, 400, `Admin update failed...!`);
    }
    return responseHandler(res, 200, `Admin updated successfully..!`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("adminManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "Admin ID is required");
    }
    const findAdmin = await Admin.findById(id);
    if (!findAdmin) {
      return responseHandler(res, 404, "Admin not found");
    }
    const deleteAdmin = await Admin.findByIdAndDelete(id);
    if (!deleteAdmin) {
      return responseHandler(res, 400, `Admin delete failed...!`);
    }
    return responseHandler(res, 200, `Admin deleted successfully..!`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getApprovals = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { pageNo = 1, limit = 10, search } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = { status: "inactive" };
    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }
    const totalCount = await User.countDocuments(filter);
    const data = await User.find(filter)
      .populate("college course")
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1, _id: 1 })
      .lean();
    const mappedData = data.map((item) => {
      return {
        ...item,
        college: item?.college?.collegeName,
        course: item?.course?.courseName,
      };
    });
    return responseHandler(
      res,
      200,
      `Approvals found successfully..!`,
      mappedData,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.approveUser = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }
    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }
    const editUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!editUser) {
      return responseHandler(res, 400, `User update failed...!`);
    }

    let message;

    if (status === "awaiting_payment") {
      message = {
        notification: {
          title: `AKCAF Membership has been approved`,
          body: `Your membership for AKCAF has been approved successfully. Please complete the payment process to continue.`,
        },
        token: findUser.fcm,
      };
    } else {
      message = {
        notification: {
          title: `AKCAF Membership has been rejected`,
          body: `Your membership for AKCAF has been rejected, because of ${req.body.reason}.`,
        },
        token: findUser.fcm,
      };
    }
    getMessaging()
      .send(message)
      .then((response) => {
        console.log("successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    return responseHandler(res, 200, `User ${status} successfully`);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getDropdown = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const users = await User.find({
      status: { $in: ["active", "awaiting_payment"] },
    });

    const mappedData = users.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        name: user.fullName,
      };
    });

    return responseHandler(res, 200, "Dropdown found successfully", mappedData);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const { type = "month" } = req.query;

    const [
      totalMembers,
      totalColleges,
      totalRevenue,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      deletedUsers,
      awaitingPaymentUsers,
      eventsCount,
      newsCount,
      feedsCount,
      promotionCount,
    ] = await Promise.all([
      User.countDocuments(),
      College.countDocuments(),
      Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "inactive" }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ status: "deleted" }),
      User.countDocuments({ status: "awaiting_payment" }),
      Event.countDocuments(),
      News.countDocuments({ status: "published" }),
      Feeds.countDocuments(),
      Promotion.countDocuments(),
    ]);

    let totalMemberGraph, totalRevenueGraph, memberGraph, revenueGraph;

    if (type === "month") {
      totalMemberGraph = await User.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: 1 },
          },
        },
      ]);

      totalRevenueGraph = await Payment.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$amount" },
          },
        },
      ]);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const data = monthNames.map((name, index) => {
        const memberEntry = totalMemberGraph.find(
          (item) => item._id === index + 1
        );
        const revenueEntry = totalRevenueGraph.find(
          (item) => item._id === index + 1
        );

        return {
          name,
          memberCount: memberEntry ? memberEntry.total : 0,
          revenue: revenueEntry ? revenueEntry.total : 0,
        };
      });

      memberGraph = data.map((item) => {
        return {
          name: item.name,
          count: item.memberCount,
        };
      });

      revenueGraph = data.map((item) => {
        return {
          name: item.name,
          count: item.revenue,
        };
      });
    } else if (type === "year") {
      totalMemberGraph = await User.aggregate([
        { $match: { status: "active" } },
        {
          $group: {
            _id: { $year: "$createdAt" },
            total: { $sum: 1 },
          },
        },
      ]);

      totalRevenueGraph = await Payment.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: { $year: "$createdAt" },
            total: { $sum: "$amount" },
          },
        },
      ]);
      const data = totalMemberGraph.map((memberEntry) => {
        const revenueEntry = totalRevenueGraph.find(
          (item) => item._id === memberEntry._id
        );

        return {
          name: memberEntry._id,
          memberCount: memberEntry.total,
          count: revenueEntry ? revenueEntry.total : 0,
        };
      });

      memberGraph = data.map((item) => {
        return {
          name: item.name,
          count: item.memberCount,
        };
      });

      revenueGraph = data.map((item) => {
        return {
          name: item.name,
          revenue: item.revenue,
        };
      });
    }

    return responseHandler(res, 200, "Dashboard found successfully", {
      totalMembers,
      totalColleges,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      deletedUsers,
      awaitingPaymentUsers,
      eventsCount,
      newsCount,
      feedsCount,
      promotionCount,
      memberGraph,
      revenueGraph,
    });
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

exports.bulkCreateUser = async (req, res) => {
  try {
    const { error } = validations.bulkCreateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return responseHandler(
        res,
        400,
        `Validation Error: ${error.details
          .map((err) => err.message)
          .join(", ")}`
      );
    }

    let users = req.body;

    const existingUsers = await User.find({
      $or: users.map((user) => ({
        email: user.email,
        emiratesID: user.emiratesID,
        phone: user.phone,
      })),
    });

    if (existingUsers.length > 0) {
      const duplicateDetails = existingUsers.map((user) => ({
        email: user.email,
        phone: user.phone,
        emiratesID: user.emiratesID,
      }));

      return responseHandler(
        res,
        400,
        "Some users already exist with the same email, Emirates ID, or phone.",
        { duplicates: duplicateDetails }
      );
    }

    for (let user of users) {
      const uniqueMemberId = await generateUniqueDigit();
      user.memberId = `AKCAF-${uniqueMemberId}`;
    }

    const createdUsers = await User.insertMany(users);

    return responseHandler(
      res,
      201,
      "Users created successfully",
      createdUsers
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
