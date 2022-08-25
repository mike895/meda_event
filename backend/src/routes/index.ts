import { Application } from 'express';
import AuthRoutes from './AuthRoutes';
// import lessonRouter from './LessonRoutes';
import userAuth from '../middlewares/userAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import UserType from '../data/userType';
import Roles from '../data/roles';
import AdminRoutes from './AdminRoutes';
import MovieRoutes from './MovieRoutes';
import AttendantRoutes from './AttendantRoutes';
import CinemaHallRoutes from './CinemaHallRoutes';
import CinemaScheduleRoutes from './CinemaScheduleRoutes';
import TicketRoutes from './TicketRoutes';
import * as path from 'path';
import RedeemerUserRoutes from './RedemmerUserRoutes';
import * as swaggerUI from 'swagger-ui-express';
import { swaggerDocs } from '../swagger/swagerConfig';
const multer  = require('multer')
// var path = require('path')
var storeval;
 
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                cb(null, 'public/images')
        },
        filename: (req, file, cb) => {
          storeval = Date.now() + path.extname(file.originalname);
        cb(null, storeval)
   }
})

const upload = multer({
        storage: storage,
        limits: { fileSize: '2000000' },
        fileFilter: (req, file, cb) => {
                const fileTypes = /jpeg|jpg|png|gif/
                const mimeType = fileTypes.test(file.mimetype)
                const extname = fileTypes.test(path.extname(file.originalname))

                if(mimeType && extname) {
                        return cb(null, true)
                }
                cb('Give proper files format to upload')
        }

})



export default class Routes {




  constructor(app: Application) {
    app.use('/api/auth', AuthRoutes);
    app.use(
      '/api/admin',
      userAuth,
      userTypeAuth(UserType.User),
      userRoleAuth([Roles.Admin]),
      AdminRoutes
    );
    app.use('/upload', upload.single('logo') ,(req,res)=> {
        // upload()
      setTimeout(() => {
        console.log('file uploaded', storeval)
        return res.status(200).json({ result: true, msg: 'file uploaded', name: storeval})
      }, 3000);
    });
    app.use('/api/event', MovieRoutes);
    app.use('/api/attendant', AttendantRoutes);
    app.use('/api/venue', CinemaHallRoutes);
    app.use('/api/event-schedule', CinemaScheduleRoutes);
    app.use('/api/ticket', TicketRoutes);
    app.use('/api/redeemer-users', RedeemerUserRoutes);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    app.get('/backend*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../../frontend/build/index.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(
        path.join(__dirname, '../../../web-ticket/build/index.html')
      );
    });
  }
}
