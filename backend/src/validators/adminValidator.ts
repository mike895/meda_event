import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterRequest extends Request {
    value?: { body?: string };
}
export class AdminValidator {
    constructor() { }

    validateRegister(schema) {
        return async (req: RegisterRequest, res: Response, next: NextFunction) => {
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
    validateResetPassword() {
        return async (req: RegisterRequest, res: Response, next: NextFunction) => {
            try {
                const val = await resetUser.validateAsync(req.body);
                req.value = req.value ?? {};
                req.value.body = req.value.body ?? val;
                next();
            } catch (error) {
                res.status(400).json(error);
            }
        };
    }
    validateObjectUpdate(schema) {
        return async (req: RegisterRequest, res: Response, next: NextFunction) => {
            try {
                if (!req.params.id) {
                    throw 'Id not sent with request';
                }
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

export const registerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().length(4).required(),
    // tslint:disable-next-line:no-null-keyword
    phoneNumber: Joi.string().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string().allow(null),
    role: Joi.number().required(),
});

export const registerTicketRedeemerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().length(4).required(),
    phoneNumber: Joi.string().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});

export const updateTicketRedeemerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accountLockedOut: Joi.bool().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});


export const updaterUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accountLockedOut: Joi.bool().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});

export const resetUser = Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().length(4).required(),
});
