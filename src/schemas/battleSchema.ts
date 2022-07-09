import joi from "joi";

export const authSchema = joi.object({
    firstUser: joi.string().required(),
    secondUser: joi.string().required()
});