const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  name: Joi.string().required(),
  designation: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  college: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  status: Joi.boolean(),
});

exports.editAdminSchema = Joi.object({
  name: Joi.string(),
  designation: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  college: Joi.string(),
  role: Joi.string(),
  status: Joi.boolean(),
});

exports.createRoleSchema = Joi.object({
  roleName: Joi.string().required(),
  description: Joi.string(),
  permissions: Joi.array(),
  status: Joi.boolean(),
});

exports.editRoleSchema = Joi.object({
  roleName: Joi.string(),
  description: Joi.string(),
  permissions: Joi.array(),
  status: Joi.boolean(),
});

exports.createCollegeSchema = Joi.object({
  collegeName: Joi.string().required(),
  startYear: Joi.number().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
});

exports.editCollegeSchema = Joi.object({
  collegeName: Joi.string(),
  batch: Joi.array(),
  country: Joi.string(),
  state: Joi.string(),
  status: Joi.boolean(),
});

exports.bulkCreateCollegeSchema = Joi.array().items(
  exports.createCollegeSchema
);

exports.createUserSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    middle: Joi.string(),
    last: Joi.string().required(),
  }),
  college: Joi.string().required(),
  batch: Joi.number().required(),
  designation: Joi.string().required(),
  image: Joi.string(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  bio: Joi.string(),
  status: Joi.boolean(),
});

exports.editUserSchema = Joi.object({
  name: Joi.object({
    first: Joi.string(),
    middle: Joi.string(),
    last: Joi.string(),
  }),
  college: Joi.string(),
  batch: Joi.number(),
  designation: Joi.string(),
  image: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  bio: Joi.string(),
  status: Joi.boolean(),
});
