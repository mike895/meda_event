import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import {
  AuthValidator,
  loginSchema,
  phoneNumberLoginSchema,
} from '../validators/authValidator';

class AuthRoutes {
  router = Router();
  authController = new AuthController();
  authValidator = new AuthValidator();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/auth/login-user:
     *   post:
     *     summary: Login system user
     *     tags: [Authentication]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - username
     *                      - password
     *                  properties:
     *                      password:
     *                          type: string
     *                      username:
     *                          type: string
     *     responses:
     *       401:
     *         description: Username or password is incorrect
     *       200:
     *         description: Login success
     */
    this.router
      .route('/login-user')
      .post(
        this.authValidator.validateLogin(loginSchema),
        this.authController.LoginUser
      );
    /**
     * @swagger
     * /api/auth/current-user/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Gt current user if logged in
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Current user
     */
    this.router
      .route('/current-user')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Finanace]),
        this.authController.GetCurrentUser
      );
    /**
     * @swagger
     * /api/auth/current-ticket-validator-user:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Gt current ticket redeemer user if logged in
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Current user
     */
    this.router
      .route('/current-ticket-validator-user')
      .get(
        userAuth,
        userTypeAuth(UserType.TicketValidatorUser),
        this.authController.GetCurrentTicketValidatorUser
      );
    /**
     * @swagger
     * /api/auth/login-ticket-validator-user:
     *   post:
     *     summary: Login ticket redeemer user
     *     tags: [Authentication]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - phoneNumber
     *                      - password
     *                  properties:
     *                      password:
     *                          type: string
     *                      phoneNumber:
     *                          type: string
     *     responses:
     *       401:
     *         description: phoneNumber or password is incorrect
     *       200:
     *         description: Login success
     */
    this.router
      .route('/login-ticket-validator-user')
      .post(
        this.authValidator.validateLogin(phoneNumberLoginSchema),
        this.authController.LoginTicketValidatorUser
      );
  }
}

export default new AuthRoutes().router;
