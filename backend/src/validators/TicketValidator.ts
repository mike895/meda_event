import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterRequest extends Request {
    value?: { body?: string };
}
export class TicketValidator {
    constructor() { }
    validateGetSingle() {
        return async (req: RegisterRequest, res: Response, next: NextFunction) => {
            try {
                if (!req.params.ticketKey) {
                    throw 'Id not sent with request';
                }
                next();
            } catch (error) {
                res.status(400).json(error);
            }
        };
    }
}