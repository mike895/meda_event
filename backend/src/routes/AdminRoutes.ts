import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import {
  AdminValidator,
  registerTicketRedeemerUserSchema,
  registerUserSchema,
  updaterUserSchema,
  updateTicketRedeemerUserSchema,
} from '../validators/adminValidator';

class AdminRoutes {
  router = Router();
  adminController = new AdminController();
  adminValidator = new AdminValidator();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/admin/register-ticket-redeemer-user:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Create ticket redeemer user
     *     tags: [Admin]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - username
     *                      - firstName
     *                      - lastName
     *                      - password
     *                      - phoneNumber
     *                  properties:
     *                      firstName:
     *                          type: string
     *                      lastName:
     *                          type: string
     *                      password:
     *                          type: string
     *                      username:
     *                          type: string
     *                      phoneNumber:
     *                          type: string
     *                      address:
     *                          type: string
     *     responses:
     *       409:
     *         description: The phone number or username already belongs to an account
     *       201:
     *         description: Created successfully
     */
    this.router
      .route('/register-ticket-redeemer-user')
      .post(
        this.adminValidator.validateRegister(registerTicketRedeemerUserSchema),
        this.adminController.CreateTicketValidatorUser
      );
    /**
     * @swagger
     * /api/admin/ticket-redeemer-user/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all ticket redeemer users
     *     tags: [Admin]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All ticket redeemer users
     */
    this.router
      .route('/ticket-redeemer-user/')
      .get(this.adminController.GetAllTicketRedeemerUsers);
    /**
     * @swagger
     * /api/admin/ticket-redeemer-user/{id}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get user by id
     *     tags: [Admin]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/ticket-redeemer-user/:id')
      .get(this.adminController.GetTicketRedeemerUserById);
    /**
     * @swagger
     * /api/admin/ticket-redeemer-user/{id}:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Update ticket redeemer user by Id
     *     tags: [Admin]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - username
     *                      - firstName
     *                      - lastName
     *                      - password
     *                      - phoneNumber
     *                  properties:
     *                      firstName:
     *                          type: string
     *                      lastName:
     *                          type: string
     *                      password:
     *                          type: string
     *                      username:
     *                          type: string
     *                      phoneNumber:
     *                          type: string
     *                      address:
     *                          type: string
     *                      accountLockedOut:
     *                          type: boolean
     *     responses:
     *       409:
     *         description: The phone number or username already belongs to an account
     *       201:
     *         description: Updated successfully
     */
    this.router
      .route('/ticket-redeemer-user/:id')
      .put(
        this.adminValidator.validateObjectUpdate(
          updateTicketRedeemerUserSchema
        ),
        this.adminController.UpdateTicketRedeemerUser
      );
    /**
     * @swagger
     * /api/admin/roles/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all of the system roles in the database
     *     tags: [Admin]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All roles
     */
    this.router.route('/roles/').get(this.adminController.getAllSystemRoles);
    /**
     * @swagger
     * /api/admin/register-user:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Create a system user
     *     tags: [Admin]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - username
     *                      - firstName
     *                      - lastName
     *                      - password
     *                      - phoneNumber
     *                      - role
     *                  properties:
     *                      firstName:
     *                          type: string
     *                      lastName:
     *                          type: string
     *                      password:
     *                          type: string
     *                      username:
     *                          type: string
     *                      phoneNumber:
     *                          type: string
     *                      address:
     *                          type: string
     *                      role:
     *                          type: integer
     *                          description: The role id to be assigned to this user
     *     responses:
     *       409:
     *         description: The phone number or username already belongs to an account
     *       201:
     *         description: Created successfully
     */
    this.router
      .route('/register-user')
      .post(
        this.adminValidator.validateRegister(registerUserSchema),
        this.adminController.CreateUser
      );
    /**
     * @swagger
     * /api/admin/reset-password:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Reset a users password
     *     tags: [Admin]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - id
     *                      - password
     *                  properties:
     *                      id:
     *                          type: string
     *                      password:
     *                          type: string
     *     responses:
     *       200:
     *         description: Reset successful
     */
    this.router
      .route('/reset-password')
      .post(
        this.adminValidator.validateResetPassword(),
        this.adminController.ResetPassword
      );
    /**
     * @swagger
     * /api/admin/user/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all System users
     *     tags: [Admin]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All system users
     */
    this.router.route('/user/').get(this.adminController.getAllUsers);
    /**
     * @swagger
     * /api/admin/user/{id}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get user by id
     *     tags: [Admin]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.route('/user/:id').get(this.adminController.GetUserById);
    /**
     * @swagger
     * /api/admin//user/{id}:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Update user by id
     *     tags: [Admin]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - username
     *                      - firstName
     *                      - lastName
     *                      - password
     *                      - phoneNumber
     *                  properties:
     *                      firstName:
     *                          type: string
     *                      lastName:
     *                          type: string
     *                      password:
     *                          type: string
     *                      username:
     *                          type: string
     *                      phoneNumber:
     *                          type: string
     *                      address:
     *                          type: string
     *                      accountLockedOut:
     *                          type: boolean
     *     responses:
     *       409:
     *         description: The phone number or username already belongs to an account
     *       201:
     *         description: Updated successfully
     */
    this.router
      .route('/user/:id')
      .put(
        this.adminValidator.validateObjectUpdate(updaterUserSchema),
        this.adminController.UpdateUserById
      );
  }
}

export default new AdminRoutes().router;
