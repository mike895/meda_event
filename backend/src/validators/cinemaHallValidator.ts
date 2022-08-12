import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterRequest extends Request {
    value?: { body?: string };
}
export class CinemaHallValidator {
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
    // validateObjectUpdate(schema) {
    //     return async (req: RegisterRequest, res: Response, next: NextFunction) => {
    //         try {
    //             if (!req.params.id) {
    //                 throw 'Id not sent with request';
    //             }
    //             const val = await schema.validateAsync(req.body);
    //             req.value = req.value ?? {};
    //             req.value.body = req.value.body ?? val;
    //             next();
    //         } catch (error) {
    //             res.status(400).json(error);
    //         }
    //     };
    // }
}

export const addCinemaHallSchema = Joi.object().keys({
    eventHallName: Joi.string().required(),
    regularSeatMap: Joi.array().items(Joi.any()),
    // vipSeatMap: Joi.array().items(Joi.any()),

});
