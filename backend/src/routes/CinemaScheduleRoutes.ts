import { Router } from 'express';
import CinemaScheduleController from '../controllers/CinemaScheduleController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import { addCinemaHallSchema } from '../validators/cinemaHallValidator';
import {
  addCinemaScheduleSchema,
  CinemaScheduleValidator,
} from '../validators/cinemaScheduleValidator';

class CinemaScheduleRoutes {
  router = Router();
  cinemaScheduleController = new CinemaScheduleController();
  cinemaScheduleValidator = new CinemaScheduleValidator();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/cinema-schedule:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Create a movie schedule
     *     tags: [Cinema Schedule]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - regularTicketPrice
     *                      - vipTicketPrice
     *                      - scheduleRange
     *                      - movie
     *                      - showTimes
     *                  properties:
     *                      regularTicketPrice:
     *                          type: number
     *                      vipTicketPrice:
     *                          type: number
     *                      movie:
     *                          type: string
     *                          description: the referenced movie id
     *                      scheduleRange:
     *                          type: array
     *                          description: date start to date end
     *                          items:
     *                              type: string
     *                      showTimes:
     *                          type: array
     *                          description: Showtime schema
     *                          items:
     *                              type: object
     *                              properties:
     *                                  movieType:
     *                                      type: string
     *                                  time:
     *                                      type: string
     *                                  cinemaHall:
     *                                      description: the referenced cinema hall Id
     *                                      type: string
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
        this.cinemaScheduleValidator.validateAdd(addCinemaScheduleSchema),
        this.cinemaScheduleController.CreateEventSchedule
      );
    /**
     * @swagger
     * /api/cinema-schedule:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all cinema schedules
     *     tags: [Cinema Schedule]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All Cinema schedules
     */
    this.router
      .route('/')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Cashier]),
        this.cinemaScheduleController.GetAllEventSchedules
      );
    /**
     * @swagger
     * /api/cinema-schedule/schedules-preview:
     *   get:
     *     summary: Get all cinema for preview (from now to 5 days in advance from now)
     *     tags: [Cinema Schedule]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All Cinema schedules
     */
    this.router
      .route('/schedules-preview')
      .get(this.cinemaScheduleController.GetEventSchedulesForPreview);
    /**
     * @swagger
     * /api/cinema-schedule/schedule/{id}:
     *   get:
     *     summary: Get a schedule by id
     *     tags: [Cinema Schedule]
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
      .route('/schedule/:id')
      .get(this.cinemaScheduleController.GetEventSchedule);
    /**
     * @swagger
     * /api/cinema-schedule/schedule/showtime/{id}:
     *   get:
     *     summary: Get a schedule showtime with hall
     *     tags: [Cinema Schedule]
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
      .route('/schedule/showtime/:id')
      .get(this.cinemaScheduleController.GetShowTimeWithHall);

    /**
     * @swagger
     * /api/cinema-schedule/schedule/showtime/{id}:
     *   delete:
     *     security:
     *        - bearerAuth: []
     *     summary: Delete a showtime from schedule
     *     tags: [Cinema Schedule]
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     *       409:
     *         description: A ticket is bought for this showtime thus it can't be deleted
     */
    this.router
      .route('/schedule/showtime/:id')
      .delete(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.DeleteShowtime
      );
    /**
     * @swagger
     * /api/cinema-schedule/schedule/showtime/{id}:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Deactivate a showtime for now (Can be extended to update more)
     *     tags: [Cinema Schedule]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - active
     *                  properties:
     *                      active:
     *                          type: boolean
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/schedule/showtime/:id')
      .put(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.UpdateShowtime
      );
    /**
     * @swagger
     * /api/cinema-schedule/schedule/{id}/add-showtime:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Add a showtime to existing schedule
     *     tags: [Cinema Schedule]
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
     *                      - showTimes
     *                  properties:
     *                      showTimes:
     *                          type: array
     *                          description: Showtime schema
     *                          items:
     *                              type: object
     *                              properties:
     *                                  movieType:
     *                                      type: string
     *                                  time:
     *                                      type: string
     *                                  cinemaHall:
     *                                      description: the referenced cinema hall Id
     *                                      type: string
     *     responses:
     *       201:
     *         description: Updated successfully
     */
    this.router
      .route('/schedule/:id/add-showtime')
      .put(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.AddShowTimesToSchedule
      );


/////////////////////////////////////////////////

    // this.router
    //   .route('/schedule/showtime/:id')
    //   .get(this.cinemaScheduleController.GetShowTimeWithHall);

    // /**
    //  * @swagger
    //  * /api/cinema-schedule/schedule/showtime/{id}:
    //  *   delete:
    //  *     security:
    //  *        - bearerAuth: []
    //  *     summary: Delete a showtime from schedule
    //  *     tags: [Cinema Schedule]
    //  *     parameters:
    //  *         - name: id
    //  *           in: path
    //  *           required: true
    //  *     responses:
    //  *       200:
    //  *         description: OK
    //  *       409:
    //  *         description: A ticket is bought for this showtime thus it can't be deleted
    //  */
    this.router
      .route('/schedule/speaker/:id')
      .delete(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.DeleteSpeaker
      );
    /**
     * @swagger
     * /api/cinema-schedule/schedule/showtime/{id}:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Deactivate a showtime for now (Can be extended to update more)
     *     tags: [Cinema Schedule]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - active
     *                  properties:
     *                      active:
     *                          type: boolean
     *     parameters:
     *         - name: id
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     */
    this.router
      .route('/schedule/speaker/:id')
      .put(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.UpdateSpeaker
      );
    /**
     * @swagger
     * /api/cinema-schedule/schedule/{id}/add-showtime:
     *   put:
     *     security:
     *        - bearerAuth: []
     *     summary: Add a showtime to existing schedule
     *     tags: [Cinema Schedule]
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
     *                      - showTimes
     *                  properties:
     *                      showTimes:
     *                          type: array
     *                          description: Showtime schema
     *                          items:
     *                              type: object
     *                              properties:
     *                                  movieType:
     *                                      type: string
     *                                  time:
     *                                      type: string
     *                                  cinemaHall:
     *                                      description: the referenced cinema hall Id
     *                                      type: string
     *     responses:
     *       201:
     *         description: Updated successfully
     */
    this.router
      .route('/schedule/:id/add-speaker')
      .put(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.cinemaScheduleController.AddSpeakerToSchedule
      );





  }
}

export default new CinemaScheduleRoutes().router;
