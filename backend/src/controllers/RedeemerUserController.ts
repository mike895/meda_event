import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
export default class RedeemerUserController {
    constructor() { }
    async GetAllRedeemerUsers(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(
                await prisma.ticketValidatorUser.findMany({
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true
                    }
                })
            );
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Couldn\'t get users.');
        }
    }
}
