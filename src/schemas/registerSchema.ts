import Joi from '@hapi/joi';

export const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().email(),
});