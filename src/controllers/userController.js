const checkAccess = require("../helpers/checkAccess");
const responseHandler = require("../helpers/responseHandler");
const User = require("../models/userModel");
const { generateOTP } = require("../utils/generateOTP");
const { generateToken } = require("../utils/generateToken");
const validations = require("../validations");

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return responseHandler(res, 400, "Phone number is required");
    }
    const checkExist = await User.findOne({ phone });
    const otp = generateOTP(5);
    if (checkExist) {
      checkExist.otp = otp;
      checkExist.save();
      return responseHandler(res, 200, "OTP sent successfully", otp);
    }
    // TODO: Send OTP with firebase function call after success otp send -> create user
    req.body.otp = otp;
    const user = await User.create(req.body);
    if (user) return responseHandler(res, 200, "OTP sent successfully", otp);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { otp, phone } = req.body;
    if (!otp) {
      return responseHandler(res, 400, "OTP is required");
    }
    if (!phone) {
      return responseHandler(res, 400, "Phone number is required");
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return responseHandler(res, 404, "User not found");
    }
    if (user.otp !== otp) {
      return responseHandler(res, 400, "Invalid OTP");
    }
    user.otp = null;
    await user.save();
    const token = generateToken(user._id);

    return responseHandler(res, 200, "User verified successfully", token);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.createUser = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { error } = validations.createUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const checkExist = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (checkExist) {
      return responseHandler(
        res,
        409,
        `User with this email or phone already exists`
      );
    }

    const newUser = await User.create(req.body);

    if (newUser)
      return responseHandler(
        res,
        201,
        `New User created successfull..!`,
        newUser
      );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.editUser = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_modify")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { error } = validations.editUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }

    const editUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!editUser) {
      return responseHandler(res, 400, `User update failed...!`);
    }
    return responseHandler(res, 200, `User updated successfully`, editUser);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getUser = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const findUser = await User.findById(id);
    if (findUser) {
      return responseHandler(res, 200, `User found successfull..!`, findUser);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_delete")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }

    const { id } = req.params;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }

    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser) {
      return responseHandler(res, 200, `User deleted successfully..!`);
    }
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error } = validations.updateUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return responseHandler(res, 400, `Invalid input: ${error.message}`);
    }

    const id = req.userId;
    if (!id) {
      return responseHandler(res, 400, "User ID is required");
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      return responseHandler(res, 404, "User not found");
    }

    const editUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!editUser) {
      return responseHandler(res, 400, `User update failed...!`);
    }
    return responseHandler(res, 200, `User updated successfully`, editUser);
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const check = await checkAccess(req.roleId, "permissions");
    if (!check || !check.includes("memberManagement_view")) {
      return responseHandler(
        res,
        403,
        "You don't have permission to perform this action"
      );
    }
    const { pageNo = 1, status, limit = 10 } = req.query;
    const skipCount = 10 * (pageNo - 1);
    const filter = {};
    const totalCount = await User.countDocuments(filter);
    const data = await User.find(filter)
      .skip(skipCount)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return responseHandler(
      res,
      200,
      `Users found successfull..!`,
      data,
      totalCount
    );
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error ${error.message}`);
  }
};
