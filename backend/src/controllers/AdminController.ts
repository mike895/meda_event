import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import AuthRepository from '../repositories/AuthRepository';
import { jwtSecret } from '../config';
import { hashPassword } from '../utils/auth';
import UsersRepository from '../repositories/UsersRepository';
import TicketRedeemerUserRepository from '../repositories/TicketRedeemerUserRepository';
import prisma from '../db/db';
import { Prisma } from '@prisma/client';
import UserType from '../data/userType';
export default class AdminController {
    constructor() { }

    async CreateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, username, password, phoneNumber, role, address }: { role: number, firstName: string, lastName: string, username: string, password: string, phoneNumber: string, address: string | null } = req.body;
            const usernameTaken = await UsersRepository.getUserByUsername(username);
            if (usernameTaken) {
                return res.status(409).json({
                    error: 'This username already belongs to an account.'
                });
            }
            const phoneNumberTaken = await UsersRepository.getUserByPhoneNumber(phoneNumber || '');
            if (phoneNumberTaken) {
                return res.status(409).json({
                    error: 'This phone number already belongs to an account.'
                });
            }
            const user = await UsersRepository.createUser({ firstName, lastName, username, password: await hashPassword(password), phoneNumber: phoneNumber, role, registrantId: (req.user as any).id, address });
            return res.status(201).json({
                error: undefined,
                message: 'User created successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'User couldn\'t be created.');
        }
    }
    async CreateTicketValidatorUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, username, password, phoneNumber, address }: { firstName: string, lastName: string, username: string, password: string, phoneNumber: string, address: string | null } = req.body;
            const usernameTaken = await TicketRedeemerUserRepository.getTicketRedeemerUserByUserName(username);
            if (usernameTaken) {
                return res.status(409).json({
                    error: 'This username already belongs to an account.'
                });
            }
            const phoneNumberTaken = await TicketRedeemerUserRepository.getTicketRedeemerUserByPhoneNumber(phoneNumber);
            if (phoneNumberTaken) {
                return res.status(409).json({
                    error: 'This phone number already belongs to an account.'
                });
            }
            const user = await TicketRedeemerUserRepository.createTicketRedeemer({ firstName, lastName, username, password: await hashPassword(password), phoneNumber: phoneNumber, registrantId: (req.user as any).id, address });
            return res.status(201).json({
                error: undefined,
                message: 'User created successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }
    async GetAllTicketRedeemerUsers(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(await TicketRedeemerUserRepository.getAllTicketRedeemerUsers());
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }

    async GetTicketRedeemerUserById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                return res.status(404).json({ error: `User not requested` });
            }
            const ticketRedUser = await TicketRedeemerUserRepository.getTicketRedeemerUserById(req.params.id, {
                id: true,
                firstName: true,
                lastName: true,
                registeredBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                username: true,
                accountLockedOut: true,
                accessFailedCount: true,
                phoneNumber: true,
                createdAt: true,
            });
            if (!ticketRedUser) {
                return res.status(404).json({ error: `User doesn't exist` });
            }
            return res.json({ username: ticketRedUser?.username, firstName: ticketRedUser?.firstName, lastName: ticketRedUser?.lastName, phoneNumber: ticketRedUser?.phoneNumber, accountLockedOut: ticketRedUser?.accountLockedOut, });
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }
    async UpdateTicketRedeemerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const { firstName, lastName, username, phoneNumber, address, accountLockedOut }: { firstName: string, lastName: string, username: string, phoneNumber: string, address: string | null, accountLockedOut: boolean } = req.body;
            const usernameTaken = await TicketRedeemerUserRepository.getTicketRedeemerUserByUserName(username);
            if (usernameTaken && id != usernameTaken.id) {
                return res.status(409).json({
                    error: 'This username already belongs to an account.'
                });
            }
            const phoneNumberTaken = await TicketRedeemerUserRepository.getTicketRedeemerUserByPhoneNumber(phoneNumber);
            if (phoneNumberTaken && id != phoneNumberTaken?.id) {
                return res.status(409).json({
                    error: 'This phone number already belongs to an account.'
                });
            }
            const user = await TicketRedeemerUserRepository.updateTicketRedeemer(id, { firstName, lastName, username, address, accountLockedOut });
            return res.status(201).json({
                error: undefined,
                message: 'User updated successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be updated.');
        }
    }
    async getAllSystemRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const allRoles = await prisma?.userRole.findMany({});
            return res.json(allRoles);
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await prisma?.user.findMany({
                where: {},
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    registeredBy: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    roles: true,
                    username: true,
                    accountLockedOut: true,
                    accessFailedCount: true,
                    phoneNumber: true,
                    createdAt: true,

                }
            });
            return res.json(users);
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }
    async UpdateUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const { firstName, lastName, username, phoneNumber, address, accountLockedOut, role }: { firstName: string, lastName: string, username: string, phoneNumber: string, address: string | null, accountLockedOut: boolean, role: number } = req.body;
            const usernameTaken = await UsersRepository.getUserByUsername(username);
            if (usernameTaken && id != usernameTaken.id) {
                return res.status(409).json({
                    error: 'This username already belongs to an account.'
                });
            }
            const phoneNumberTaken = await UsersRepository.getUserByPhoneNumber(phoneNumber);
            if (phoneNumberTaken && id != phoneNumberTaken?.id) {
                return res.status(409).json({
                    error: 'This phone number already belongs to an account.'
                });
            }
            const user = await UsersRepository.UpdateUser(id, { firstName, lastName, username, address, accountLockedOut, role, phoneNumber });
            return res.status(201).json({
                error: undefined,
                message: 'User updated successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be updated.');
        }
    }
    async GetUserById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                return res.status(404).json({ error: `User not requested` });
            }
            const ticketRedUser = await UsersRepository.getUserById(req.params.id, {
                id: true,
                firstName: true,
                lastName: true,
                registeredBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                username: true,
                accountLockedOut: true,
                accessFailedCount: true,
                phoneNumber: true,
                createdAt: true,
                roles: true
            });
            if (!ticketRedUser) {
                return res.status(404).json({ error: `User doesn't exist` });
            }
            return res.json({ username: ticketRedUser?.username, firstName: ticketRedUser?.firstName, lastName: ticketRedUser?.lastName, phoneNumber: ticketRedUser?.phoneNumber, accountLockedOut: ticketRedUser?.accountLockedOut, });
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
        }
    }
    async ResetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, password } = req.body;
            let userType: UserType;
            if (await prisma.user.findUnique({ where: { id } })) {
                userType = UserType.User;
            }
            else if (await prisma.ticketValidatorUser.findUnique({ where: { id } })) {
                userType = UserType.TicketValidatorUser;
            }
            else {
                throw 'User doesn\'t exist';
            }
            await AuthRepository.changePassword({ id, userType, password });
            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Reset password failed.');
        }
    }

}
