import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import MovieController from '../controllers/MovieController';
// import UploadController from '../controllers/UploadController';

import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import { addMovieSchema, MovieValidator } from '../validators/movieValidator';

class MovieRoutes {
  router = Router();
  movieController = new MovieController();
  movieValidator = new MovieValidator();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/movie/:
     *   post:
     *     security:
     *        - bearerAuth: []
     *     summary: Create a movie schedule
     *     tags: [Movie]
     *     requestBody:
     *      required: true
     *      content:
     *          application/json:
     *              schema:
     *                  type: object
     *                  required:
     *                      - title
     *                      - synopsis
     *                      - genre
     *                      - rating
     *                      - runtime
     *                      - posterImg
     *                      - coverImg
     *                      - contentRating
     *                  properties:
     *                      rating:
     *                          type: number
     *                      runtime:
     *                          type: number
     *                      title:
     *                          type: string
     *                      synopsis:
     *                          type: string
     *                      posterImg:
     *                          type: string
     *                      coverImg:
     *                          type: string
     *                      contentRating:
     *                          type: string
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
        this.movieValidator.validateAdd(addMovieSchema),
        this.movieController.CreateEvent
      );
    /**
     * @swagger
     * /api/movie/search/{title}:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Search a movie from external api by its title
     *     tags: [Movie]
     *     parameters:
     *         - name: title
     *           in: path
     *           required: true
     *     responses:
     *       200:
     *         description: OK
     *       404:
     *         description: Movie couldn't be found
     */
    this.router
      .route('/search/:title')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.movieController.SearchAnEvent
      );
    /**
     * @swagger
     * /api/movie/:
     *   get:
     *     security:
     *        - bearerAuth: []
     *     summary: Get all movies that are in the system
     *     tags: [Movie]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: All Movies
     */
    this.router
      .route('/')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Cashier]),
        this.movieController.GetAllEvents
      );

      // this.router
      // .route('/upload')
      // .get(
      //   userAuth,
      //   userTypeAuth(UserType.User),
      //   userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Cashier]),
      //   this.uploadController.upload
      // );
  }
}

export default new MovieRoutes().router;
