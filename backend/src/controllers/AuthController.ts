import { Request, Response, NextFunction } from 'express';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import AuthRepository from '../repositories/AuthRepository';
import { jwtSecret } from '../config';
import UsersRepository from '../repositories/UsersRepository';
import TicketValidatorUserRepository from '../repositories/TicketRedeemerUserRepository';
export default class AuthController {
  constructor() {}

  async LoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await UsersRepository.getUserByUsername(username);
      if (user && user.accountLockedOut) {
        return res.status(401).json({
          error:
            'This account is locked out... please contact your system administrators!',
        });
      }
      if (
        !user ||
        !(await AuthRepository.comparePassword(password, user.password))
      ) {
        return res.status(401).json({ error: 'Invalid Credentials!' });
      } else {
        const token = sign(
          {
            id: user.id,
            role: user.roles,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
          },
          jwtSecret!,
          { expiresIn: '7 days' }
        );
        // console.log('====================================');
        // console.log(token);
        // console.log('====================================');
        const result = {
          token: `Bearer ${token}`,
          expiryDate: moment().add(168, 'hours'),
          id: user.id,
          role: user.roles.name,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
        return res.status(200).json({
          ...result,
          error: undefined,
        });
      }
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Login failed.');
    }
  }

  async GetCurrentUser(req: any, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const result = {
        id: user.id,
        role: user.roles.name,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      return res.status(200).json({
        result,
      });
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Fetching current user failed.');
    }
  }

  async LoginTicketValidatorUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { phoneNumber, password } = req.body;
      const user =
        await TicketValidatorUserRepository.getTicketRedeemerUserByPhoneNumber(
          phoneNumber
        );
      if (user && user.accountLockedOut) {
        return res.status(401).json({
          error:
            'This account is locked out... please contact your system administrators!',
        });
      }
      if (
        !user ||
        !(await AuthRepository.comparePassword(password, user.password))
      ) {
        return res.status(401).json({ error: 'Invalid Credentials!' });
      } else {
        const token = sign(
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            phoneNumber: user.phoneNumber,
          },
          jwtSecret!,
          { expiresIn: '7 days' }
        );
        const result = {
          token: `Bearer ${token}`,
          expiryDate: moment().add(168, 'hours'),
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          phoneNumber: user.phoneNumber,
        };
        return res.status(200).json({
          ...result,
          error: undefined,
        });
      }
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Login failed.');
    }
  }
  async GetCurrentTicketValidatorUser(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as any;
      const result = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phoneNumber: user.phoneNumber,
      };
      return res.status(200).json({
        result,
      });
    } catch (error) {
      return apiErrorHandler(
        error,
        req,
        res,
        'Fetching current ticket validator user failed.'
      );
    }
  }
}
