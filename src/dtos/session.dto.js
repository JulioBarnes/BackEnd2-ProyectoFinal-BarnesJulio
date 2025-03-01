import Joi from "joi";

export const sessionRegisterDto = Joi.object({
  first_name: Joi.string().min(3).max(15).required(),
  last_name: Joi.string().min(2).max(15).required(),
  age: Joi.number().integer().min(18).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
});

export const sessionLoginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
});

//🚩Para actualizar sólo nombres y edad
export const usersUpdateDto = Joi.object({
  first_name: Joi.string().min(3).max(15),
  last_name: Joi.string().min(2).max(15),
  age: Joi.number().integer().min(18).max(120),
});
