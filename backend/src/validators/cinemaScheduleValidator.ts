import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterRequest extends Request {
    value?: { body?: string };
}
export class CinemaScheduleValidator {
    constructor() { }

    validateAdd(schema) {
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

export const addCinemaScheduleSchema = Joi.object().keys({
    regularTicketPrice: Joi.number().required(),
    // vipTicketPrice: Joi.number(),
    scheduleRange: Joi.array().items(Joi.date()).required(),
    event: Joi.string().required(),
    showTimes: Joi.array().items(Joi.object().keys({ time: Joi.date(), eventHall: Joi.string().required(), })),
    speakers: Joi.array().items(Joi.object().keys({ firstName: Joi.string().required(), lastName: Joi.string().required(), biography: Joi.string().required(), posterImg: Joi.string().uri().required(), })),
});
