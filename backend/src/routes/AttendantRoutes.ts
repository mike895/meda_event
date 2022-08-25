import { Router } from 'express';
import AttendantController from '../controllers/AttendantController';
import AuthController from '../controllers/AuthController';

import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import { TicketValidator } from '../validators/TicketValidator';



class AttendantRoutes {
  router = Router();
  attendantController = new AttendantController();
  ticketValidator = new TicketValidator();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    
    this.router
      .route('/register')
      .post(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.CreateUser
      );
      this.router
      .route('/fetch')
      .get(
        // userAuth,
        // userTypeAuth(UserType.User),
        // userRoleAuth([Roles.Finanace]),
        this.attendantController.GetAllAttendance
      );

      this.router
      .route('/')
      .get(
        // userAuth,
        // userTypeAuth(UserType.User),
        // userRoleAuth([Roles.Finanace]),
        this.attendantController.GetAllAttendant
      );

      this.router
      .route('/register')
      .post(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.CreateUser
      );

      this.router
      .route('/:session/:id')
      .post(
        userAuth,
        userTypeAuth(UserType.TicketValidatorUser),
        this.ticketValidator.validateCheckIn(),
        this.attendantController.CheckBadge

      );

  }
}

export default new AttendantRoutes().router;
