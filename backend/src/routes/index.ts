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
import CinemaHallRoutes from './CinemaHallRoutes';
import CinemaScheduleRoutes from './CinemaScheduleRoutes';
import TicketRoutes from './TicketRoutes';
import * as path from 'path';
import RedeemerUserRoutes from './RedemmerUserRoutes';
import * as swaggerUI from 'swagger-ui-express';
import { swaggerDocs } from '../swagger/swagerConfig';
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
    app.use('/api/event', MovieRoutes);
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
