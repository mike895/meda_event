import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import TicketController from '../controllers/TicketController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import medaTicketUserAuth from '../middlewares/medaTicketUserAuth';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import {
  AuthValidator,
  loginSchema,
  phoneNumberLoginSchema,
} from '../validators/authValidator';
import { TicketValidator } from '../validators/TicketValidator';

class AuthRoutes {
  router = Router();
  ticketController = new TicketController();
  ticketValidator = new TicketValidator();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/ticket/redeemer/{ticketKey}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get a ticket by it's ticket key (For redeemer users)
     *     tags: [Ticket]
     *     parameters:
     *         - name: ticketKey
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     *       404:
     *         description: It doesn't exist
     */
    this.router
      .route('/redeemer/:ticketKey')
      .get(
        userAuth,
        userTypeAuth(UserType.TicketValidatorUser),
        this.ticketValidator.validateGetSingle(),
        this.ticketController.GetTicket
      );
    /**
     * @swagger
     * /api/ticket/finance/{ticketKey}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get a ticket by it's ticket key (For Finance role user... sensitive info gets censored)
     *     tags: [Ticket]
     *     parameters:
     *         - name: ticketKey
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     *       404:
     *         description: It doesn't exist
     */
    // ! Temp role bypass for admin
    this.router
      .route('/finance/:ticketKey')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Cashier, Roles.Finanace]),
        this.ticketValidator.validateGetSingle(),
        this.ticketController.GetTicketIssueInfoByKey
      );
    /**
     * @swagger
     * /api/ticket/sales-report:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Get general sales report for the specified filter
     *     tags: [Ticket]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - cinemaHall
     *                      - movie
     *                      - redeemer
     *                      - scheduleRange
     *                  properties:
     *                      scheduleRange:
     *                          type: array
     *                          description: date start to date end
     *                          items:
     *                              type: string
     *                      movie:
     *                          type: array
     *                          description: array of movie id's
     *                          items:
     *                              type: string
     *                      redeemer:
     *                          type: array
     *                          description: array of redeemer user id's
     *                          items:
     *                              type: string
     *                      cinemaHall:
     *                          type: array
     *                          description: array of cinema hall id's
     *                          items:
     *                              type: string
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/sales-report')
      .post(this.ticketController.GetSalesReport);
    /**
     * @swagger
     * /api/ticket/create-ticket:
     *   post:
     *     summary: Buy/Create a ticket
     *     tags: [Ticket]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - showTimeId
     *                      - referenceNumber
     *                      - seats
     *                      - amount
     *                  properties:
     *                      seats:
     *                          type: array
     *                          description: array of seat id's
     *                          items:
     *                              type: string
     *                      showTimeId:
     *                          type: string
     *                      referenceNumber:
     *                          type: string
     *                      amount:
     *                          type: number
     *                          description: The amount of money paid by the user
     *     responses:
     *       201:
     *         description: Created successfully
     *       409:
     *         description: The seats you're trying to book have already been booked
     */
    this.router
      .route('/create-ticket')
      .post(medaTicketUserAuth, this.ticketController.CreateTicket);
    /**
     * @swagger
     * /api/ticket/buy-history:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get the ticket buy history of the user by the user id
     *     tags: [Ticket]
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/buy-history/')
      .get(medaTicketUserAuth, this.ticketController.GetTicketBuyHistory);
    /**
     * @swagger
     * /api/ticket/redeem-ticket:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Get general sales report for the specified filter
     *     tags: [Ticket]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - ticketKey
     *                  properties:
     *                      ticketKey:
     *                          type: string
     *     responses:
     *       200:
     *         description: Redeemed successfully
     */
    this.router
      .route('/redeem-ticket')
      .post(
        userAuth,
        userTypeAuth(UserType.TicketValidatorUser),
        this.ticketController.RedeemTicket
      );
    /**
     * @swagger
     * /api/ticket/redeem-history:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get the ticket redeem history of the currently logged in redeemer [Paginated]
     *     tags: [Ticket]
     *     parameters:
     *         - name: page
     *           in: query
     *           description: page to fetch
     *           required: true
     *         - name: size
     *           in: query
     *           description: page size
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/redeem-history')
      .get(
        userAuth,
        userTypeAuth(UserType.TicketValidatorUser),
        this.ticketController.GetRedeemHistory
      );
    /**
     * @swagger
     * /api/ticket/issue-receipt:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Issue fs number for a ticket
     *     tags: [Ticket]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - ticketKey
     *                      - fsNumber
     *                  properties:
     *                      ticketKey:
     *                          type: string
     *                      fsNumber:
     *                          type: string
     *     responses:
     *       200:
     *         description: Receipt Issued successfully
     *       400:
     *         description: Ticket doesn't exist
     */
    this.router
      .route('/issue-receipt')
      .post(
        userAuth,
        userTypeAuth(UserType.User),
        this.ticketController.IssueReceipt
      );
    // ! Need auth
    /**
     * @swagger
     * /api/ticket/{id}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get a ticket by it's Id (Movie ticket.... which includes child tickets(see the ER diagram))
     *     tags: [Ticket]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     *       404:
     *         description: It doesn't exist
     */
    this.router
      .route('/:id')
      .get(medaTicketUserAuth, this.ticketController.GetTicketById);
    /**
     * @swagger
     * /api/ticket/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all tickets
     *     tags: [Ticket]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     */
    // ! Role auth yet to be added
    this.router
      .route('/')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        this.ticketController.GetAllTickets
      );
    // ! Test
    this.router
      .route('/meda-pay-callback')
      .post(this.ticketController.TicketBoughtMedaPayCallback);
  }
}

export default new AuthRoutes().router;
