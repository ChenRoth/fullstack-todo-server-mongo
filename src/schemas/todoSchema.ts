import Joi from '@hapi/joi';

export const todoSchema = Joi.object({
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
});