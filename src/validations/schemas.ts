import Joi from 'joi';

export const userSignupSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().default("User"),
  middleName: Joi.string().allow(null, ""),
  lastName: Joi.string().allow(null, ""),
  mobile: Joi.string().allow(null, ""),
  timeZone: Joi.string().allow(null, ""),
  ipAddress: Joi.string().allow(null, ""),
  entityId: Joi.number().default(0),
  entityTypeId: Joi.number().default(0),
  referCode: Joi.string().allow(null, ""),
});

export const userLoginSchema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});
