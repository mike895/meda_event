import * as swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1 ',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    // basePath: '/api/',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/routes/AdminRoutes.ts',
    './src/routes/AuthRoutes.ts',
    './src/routes/CinemaHallRoutes.ts',
    './src/routes/CinemaScheduleRoutes.ts',
    './src/routes/MovieRoutes.ts',
    './src/routes/RedemmerUserRoutes.ts',
    './src/routes/TicketRoutes.ts',
  ], // files containing annotations as above
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
