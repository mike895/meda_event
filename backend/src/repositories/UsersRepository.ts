import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';
class UsersRepository {
    constructor() { }
    async getUserById(id: string, select: Prisma.UserSelect | null): Promise<any> {
        return await prisma?.user.findUnique({
            where: {
                id
            },
            select
        });
    }
    async getUserByUsername(username: string) {
        return await prisma?.user.findUnique({
            where: {
                normalizedUsername: username.toUpperCase()
            },
            include: {
                roles: true,
                registeredBy: true
            }
        });
    }
    async getUserByPhoneNumber(phoneNumber: string) {
        return await prisma?.user.findUnique({
            where: {
                phoneNumber
            },
            include: {
                roles: true,
                registeredBy: true
            }
        });
    }
    async createUser({ firstName, lastName, username, password, registrantId, phoneNumber, role, address }: { role: number, firstName: string, lastName: string, username: string, password: string, registrantId: string, phoneNumber: string, address: string | null }) {
        return await prisma?.user.create({
            data: {
                firstName,
                lastName,
                username,
                normalizedUsername: username.toUpperCase(),
                password,
                registrantId,
                userRoleId: role,
                phoneNumber,
                address
            },
            include: {
                roles: true
            }
        }
        );
    }
    async UpdateUser(id: string, { firstName, lastName, username, address, accountLockedOut, role, phoneNumber }: { firstName: string, lastName: string, username: string, address: string | null, accountLockedOut: boolean, role: number, phoneNumber: string }) {
        return await prisma?.user.update({
            where: {
                id: id
            },
            data: {
                firstName,
                lastName,
                username,
                normalizedUsername: username.toUpperCase(),
                address,
                accountLockedOut,
                userRoleId: role,
                phoneNumber: phoneNumber
            },
        }
        );
    }
}

export default new UsersRepository();