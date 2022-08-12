import { Prisma } from '@prisma/client';
import prisma from '../db/db';
class TicketRedeemerUserRepository {
    constructor() { }
    async getTicketRedeemerUserById(id: string, select: Prisma.TicketValidatorUserSelect | null): Promise<any> {
        return await prisma?.ticketValidatorUser.findUnique({
            where: {
                id
            },
            select
        });
    }
    async getTicketRedeemerUserByUserName(username: string) {
        return await prisma?.ticketValidatorUser.findUnique({
            where: {
                normalizedUsername: username.toUpperCase()
            },
            include: {
                registeredBy: true
            }
        });
    }
    async getTicketRedeemerUserByPhoneNumber(phoneNumber: string) {
        return await prisma?.ticketValidatorUser.findUnique({
            where: {
                phoneNumber
            },
            include: {
                registeredBy: true
            }
        });
    }
    async createTicketRedeemer({ firstName, lastName, username, password, registrantId, phoneNumber, address }: { firstName: string, lastName: string, username: string, password: string, registrantId: string, phoneNumber: string, address: string | null }) {
        return await prisma?.ticketValidatorUser.create({
            data: {
                firstName,
                lastName,
                username,
                normalizedUsername: username.toUpperCase(),
                password,
                registrantId,
                phoneNumber,
                address
            },
        }
        );
    }
    async updateTicketRedeemer(id: string, { firstName, lastName, username, address, accountLockedOut }: { firstName: string, lastName: string, username: string, address: string | null, accountLockedOut: boolean }) {
        return await prisma?.ticketValidatorUser.update({
            where: {
                id: id
            },
            data: {
                firstName,
                lastName,
                username,
                normalizedUsername: username.toUpperCase(),
                address,
                accountLockedOut
            },
        }
        );
    }
    async getAllTicketRedeemerUsers() {
        return await prisma?.ticketValidatorUser.findMany({
            where: {},
            select: {
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

            }
        });
    }
}

export default new TicketRedeemerUserRepository();