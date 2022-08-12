import prisma from '../db/db';
import { compare } from 'bcryptjs';
import UserType from '../data/userType';
import { hashPassword } from '../utils/auth';
class AuthRepository {
    constructor() { }
    async comparePassword(password, hash) {
        return await compare(password, hash);
    }
    async changePassword({ userType, id, password }: { userType: UserType, id: string, password: string }) {
        if (userType === UserType.User) {
            const user = await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    password: await hashPassword(password)
                }

            });
        }
        if (userType === UserType.TicketValidatorUser) {
            const user = await prisma.ticketValidatorUser.update({
                where: {
                    id: id
                },
                data: {
                    password: await hashPassword(password)
                }

            });
        }
    }
}

export default new AuthRepository();