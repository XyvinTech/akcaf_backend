const Joi = require("joi");
const { date, link } = require("joi/lib");

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

exports.createNewsSchema = Joi.object({
  category: Joi.string(),
  title: Joi.string(),
  content: Joi.string(),
  media : Joi.string(),
  status: Joi.string(),
});

exports.editNewsSchema = Joi.object({
  category: Joi.string(),
  title: Joi.string(),
  content: Joi.string(),
  media : Joi.string(),
  status: Joi.string(),
});

exports.createPromotionSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type : Joi.string(),
  startDate : Joi.date(),
  endDate : Joi.date(),
  media : Joi.string(),
  link: Joi.string()
});

exports.editPromotionSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type : Joi.string(),
  startDate : Joi.date(),
  endDate : Joi.date(),
  media : Joi.string(),
  link: Joi.string()
});


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
