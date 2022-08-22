import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import EventController from '../controllers/MovieController';
import upload from '../controllers/MovieController';

import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import { addMovieSchema, MovieValidator } from '../validators/movieValidator';

// const multer  = require('multer')
// var path = require('path')

class MovieRoutes {
  router = Router();
  movieController = new EventController();
  movieValidator = new MovieValidator();
  constructor() {
    this.initializeRoutes();
  }


//  storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//                 cb(null, 'public/images')
//         },
//         filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//    }
// })

//  upload = multer({
//         storage: this.storage,
//         limits: { fileSize: '2000000' },
//         fileFilter: (req, file, cb) => {
//                 const fileTypes = /jpeg|jpg|png|gif/
//                 const mimeType = fileTypes.test(file.mimetype)
//                 const extname = fileTypes.test(path.extname(file.originalname))

//                 if(mimeType && extname) {
//                         return cb(null, true)
//                 }
//                 cb('Give proper files format to upload')
//         }

// }).single('posterImg')


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
        // this.upload,
        this.movieController.CreateEvent
      );

      // this.router
      // .route('/upload')
      // .post(
      //   // userAuth,
      //   // userTypeAuth(UserType.User),
      //   // userRoleAuth([Roles.Admin]),
      //   this.upload
      // );

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
      this.router
      .route('/search2/:id')
      .get(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
        this.movieController.SearchAnEvent2
      );

    this.router.route('/:id').get(this.movieController.GetEventById);

    this.router
    .route('/:id')
    .put(
        userAuth,
        userTypeAuth(UserType.User),
        userRoleAuth([Roles.Admin]),
      this.movieValidator.validateAdd(addMovieSchema),
      this.movieController.UpdateEventById
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

   
  }
}

export default new MovieRoutes().router;
