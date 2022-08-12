
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from '../config';
import prisma from '../db/db';
import UsersRepository from '../repositories/UsersRepository';
import AuthRepository from '../repositories/AuthRepository';
import TicketValidatorUserRepository from '../repositories/TicketRedeemerUserRepository';
import UserType from '../data/userType';
import { User, UserRole, TicketValidatorUser } from '@prisma/client';
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};
async function checkUserExists(id: string) {
    let user;
    user = await UsersRepository.getUserById(id, {
        firstName: true,
        lastName: true,
        id: true,
        registeredBy: true,
        roles: true,
        username: true,
        accountLockedOut: true,
        accessFailedCount: true,
        phoneNumber: true,
        createdAt: true,

    });
    if (user) {
        user.userType = UserType.User;
        return user;
    }
    user = await TicketValidatorUserRepository.getTicketRedeemerUserById(id, {
        id: true,
        firstName: true,
        lastName: true,
        registeredBy: true,
        username: true,
        accountLockedOut: true,
        accessFailedCount: true,
        phoneNumber: true,
        createdAt: true,
    });
    if (user) {
        user.userType = UserType.TicketValidatorUser;
        return user;
    }
    return user;

}
export default passport => {
    passport.use(new Strategy(options, async (payload, done) => {
        await checkUserExists(payload.id).then(async user => {
            // treat a locked out account as Unauthenticated
            if (user && !user.accountLockedOut) {
                return done(undefined, user);
            }
            return done(undefined, false);
        }).catch(err => {
            console.log(err);
            done(undefined, false);
        });
    }));
};