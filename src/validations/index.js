const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  college: Joi.string().required(),
  password: Joi.string(),
  role: Joi.string().required(),
  status: Joi.boolean(),
});

exports.editAdminSchema = Joi.object({
  name: Joi.string(),
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
  course: Joi.array(),
  startYear: Joi.number().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  status: Joi.boolean(),
});

exports.editCollegeSchema = Joi.object({
  collegeName: Joi.string(),
  course: Joi.array(),
  startYear: Joi.number(),
  batch: Joi.array(),
  country: Joi.string(),
  state: Joi.string(),
  status: Joi.boolean(),
});

exports.bulkCreateCollegeSchema = Joi.array().items(
  exports.createCollegeSchema
);

exports.createNewsSchema = Joi.object({
  category: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  media: Joi.string().required(),
  status: Joi.string(),
  pdf: Joi.string(),
});

exports.editNewsSchema = Joi.object({
  category: Joi.string(),
  title: Joi.string(),
  content: Joi.string(),
  media: Joi.string(),
  status: Joi.string(),
  pdf: Joi.string(),
});

exports.createPromotionSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  media: Joi.string(),
  link: Joi.string(),
});

exports.editPromotionSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  media: Joi.string(),
  link: Joi.string(),
});

exports.createUserSchema = Joi.object({
  emiratesID: Joi.string().required(),
  fullName: Joi.string().required(),
  college: Joi.string().required(),
  course: Joi.string(),
  batch: Joi.number(),
  role: Joi.string().required(),
  image: Joi.string(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  bio: Joi.string().allow(""),
  status: Joi.string(),
});

exports.editUserSchema = Joi.object({
  fullName: Joi.string(),
  emiratesID: Joi.string(),
  college: Joi.string(),
  course: Joi.string(),
  batch: Joi.number(),
  role: Joi.string(),
  image: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  bio: Joi.string().allow(""),
  status: Joi.string(),
});

exports.updateUserSchema = Joi.object({
  fullName: Joi.string(),
  emiratesID: Joi.string(),
  image: Joi.string(),
  email: Joi.string(),
  address: Joi.string().allow(""),
  college: Joi.string(),
  course: Joi.string(),
  batch: Joi.number(),
  bio: Joi.string().allow(""),
  company: Joi.object({
    name: Joi.string().allow(""),
    designation: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    address: Joi.string().allow(""),
    logo: Joi.string().allow(""),
  }),
  social: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      link: Joi.string(),
    })
  ),
  websites: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      link: Joi.string(),
    })
  ),
  awards: Joi.array().items(
    Joi.object({
      image: Joi.string(),
      name: Joi.string(),
      authority: Joi.string(),
    })
  ),
  videos: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      link: Joi.string(),
    })
  ),
  certificates: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      link: Joi.string(),
    })
  ),
});

exports.createEventSchema = Joi.object({
  eventName: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  image: Joi.string(),
  startDate: Joi.date().required(),
  startTime: Joi.date().required(),
  endDate: Joi.date().required(),
  endTime: Joi.date().required(),
  platform: Joi.string(),
  link: Joi.string(),
  venue: Joi.string(),
  organiserName: Joi.string().required(),
  speakers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      designation: Joi.string().required(),
      role: Joi.string().required(),
      image: Joi.string(),
    })
  ),
  status: Joi.string(),
});

exports.editEventSchema = Joi.object({
  eventName: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  image: Joi.string(),
  startDate: Joi.date(),
  startTime: Joi.date(),
  endDate: Joi.date(),
  endTime: Joi.date(),
  platform: Joi.string(),
  link: Joi.string(),
  venue: Joi.string(),
  organiserName: Joi.string(),
  speakers: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      designation: Joi.string(),
      role: Joi.string(),
      image: Joi.string(),
    })
  ),
  status: Joi.string(),
});

exports.createFeedsSchema = Joi.object({
  type: Joi.string().required(),
  media: Joi.string(),
  link: Joi.string(),
  content: Joi.string().required(),
});

exports.createCourseSchema = Joi.object({
  courseName: Joi.string().required(),
});

exports.createNotificationSchema = Joi.object({
  sendTo: Joi.string().required(),
  users: Joi.array().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
  media: Joi.string().required(),
  link: Joi.string(),
  type: Joi.string().required(),
});

exports.createGroupSchame = Joi.object({
  groupName: Joi.string().required(),
  groupInfo: Joi.string().required(),
  participantIds: Joi.array().required(),
});

exports.editGroupSchema = Joi.object({
  groupName: Joi.string(),
  groupInfo: Joi.string(),
  participantIds: Joi.array(),
});

exports.createReport = Joi.object({
  content: Joi.string().required(),
  reportType: Joi.string(),
  description: Joi.string(),
});

exports.addTimeSchema = Joi.object({
  day: Joi.string().required(),
  start: Joi.string(),
  end: Joi.string(),
});

exports.bulKaddTimeSchema = Joi.object({
  addTimeSchema: Joi.array().items(exports.addTimeSchema).required(),
});

exports.editTimeSchema = Joi.object({
  day: Joi.string(),
  times: Joi.array(),
});

exports.createBooking = Joi.object({
  day: Joi.string().required(),
  time: Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required(),
  }),
  hall: Joi.string().required(),
  date: Joi.date().required(),
  eventName: Joi.string().required(),
  description: Joi.string().required(),
});

exports.editBooking = Joi.object({
  status: Joi.string(),
  eventName: Joi.string(),
  description: Joi.string(),
  reason: Joi.string(),
});

exports.createHall = Joi.object({
  name: Joi.string().required(),
  status: Joi.boolean(),
});
