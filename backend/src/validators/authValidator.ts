import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface LoginRequest extends Request {
    value?: { body?: string };
}
export class AuthValidator {
    constructor() { }

    validateLogin(schema) {
        return async (req: LoginRequest, res: Response, next: NextFunction) => {
            try {
                const val = await schema.validateAsync(req.body);
                req.value = req.value ?? {};
                req.value.body = req.value.body ?? val;
                next();
            } catch (error) {
                res.status(400).json(error);
            }
        };
    }
}

export const loginSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export const phoneNumberLoginSchema = Joi.object().keys({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
});