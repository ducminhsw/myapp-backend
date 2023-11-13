const Joi = require("joi");

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeatPassword: Joi.ref('password')
})