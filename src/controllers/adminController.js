const moment = require("moment-timezone");
const { getMessaging } = require("firebase-admin/messaging");
const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const { comparePasswords, hashPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/generateToken");
const validations = require("../validations");

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

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const newAdmin = await Admin.create(req.body);

    if (newAdmin) {
      return responseHandler(
        res,
        201,
        `New Admin created successfullyy..!`,
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
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {
      _id: { $ne: "66cef136282563d7bb086e30" },
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
      `Admins found successfullyy..!`,
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
    return responseHandler(res, 200, `Admin updated successfullyy..!`);
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
    return responseHandler(res, 200, `Admin deleted successfullyy..!`);
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
        { "name.first": { $regex: search, $options: "i" } },
        { "name.middle": { $regex: search, $options: "i" } },
        { "name.last": { $regex: search, $options: "i" } },
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
        fullName: `${item.name?.first || ""} ${item.name?.middle || ""} ${
          item.name?.last || ""
        }`.trim(),
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
          body: `Your membership for AKCAF has been approved successfullyy. Please complete the payment process to continue.`,
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
        console.log("successfullyy sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    return responseHandler(res, 200, `User ${status} successfullyy`);
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
      let fullName = user.name.first;
      if (user.name.middle) {
        fullName += ` ${user.name.middle}`;
      }
      if (user.name.last) {
        fullName += ` ${user.name.last}`;
      }

      return {
        _id: user._id,
        email: user.email,
        name: fullName,
      };
    });

    return responseHandler(
      res,
      200,
      "Dropdown found successfullyy",
      mappedData
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};
