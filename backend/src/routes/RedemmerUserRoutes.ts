import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import MovieController from '../controllers/MovieController';
import RedeemerUserController from '../controllers/RedeemerUserController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import { addMovieSchema, MovieValidator } from '../validators/movieValidator';

class RedeemerUserRoutes {
  router = Router();
  ticketRedeemerUserController = new RedeemerUserController();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Get key val pair for ticket red users for filtering
    /**
     * @swagger
     * /api/api/redeemer-users:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all ticket redeemer users in the system (For role Finance and Cashier)
     *     tags: [Ticket redeemer]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All ticket redeemer users
     */
    this.router
      .route('/')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Cashier]),
        this.ticketRedeemerUserController.GetAllRedeemerUsers
      );
  }
}

export default new RedeemerUserRoutes().router;
