import { Router } from 'express';
import CinemaHallController from '../controllers/CinemaHallController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import {
  addCinemaHallSchema,
  CinemaHallValidator,
} from '../validators/cinemaHallValidator';

class CinemaHallRoutes {
  router = Router();
  cinemaHallController = new CinemaHallController();
  cinemaHallValidator = new CinemaHallValidator();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/cinema-hall/:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Create a cinema hall
     *     tags: [Cinema Hall]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - regularSeatMap
     *                      - vipSeatMap
     *                      - cinemaHallName
     *                  properties:
     *                      cinemaHallName:
     *                          type: string
     *                      vipSeatMap:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  columnName:
     *                                      type: string
     *                                  seats:
     *                                      type: array
     *                                      items:
     *                                          type: string
     *                                  columnOrder:
     *                                       type: string
     *                                  columnType:
     *                                       type: string
     *                                       enum: [PADDING, SEATMAP]
     *                      regularSeatMap:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  columnName:
     *                                      type: string
     *                                  seats:
     *                                      type: array
     *                                      items:
     *                                          type: string
     *                                  columnOrder:
     *                                       type: string
     *                                  columnType:
     *                                       type: string
     *                                       enum: [PADDING, SEATMAP]
     *     responses:
     *       201:
     *         description: Created successfully
     */
    this.router
      .route('/')
      .post(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaHallValidator.validateAdd(addCinemaHallSchema),
        this.cinemaHallController.CreateEventHall
      );
    /**
     * @swagger
     * /api/cinema-hall/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all the cinema halls on the system
     *     tags: [Cinema Hall]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All Cinema halls
     */
    this.router
      .route('/')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Finanace]),
        this.cinemaHallController.GetAllEventHalls
      );
  }
}

export default new CinemaHallRoutes().router;
