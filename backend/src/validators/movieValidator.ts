import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterRequest extends Request {
  value?: { body?: string };
}
export class MovieValidator {
  constructor() {}

  validateAdd(schema) {
    return async (req: RegisterRequest, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req.body);
        req.value = req.value ?? {};
        req.value.body = req.value.body ?? val;
        next();
      } catch (error) {
        res.status(400).json(error);
      }
    };
  }
  validateObjectUpdate(schema) {
    return async (req: RegisterRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.params.id) {
          throw 'Id not sent with request';
        }
        const val = await schema.validateAsync(req.body);
        req.value = req.value ?? {};
        req.value.body = req.value.body ?? val;
        next();
      } catch (error) {
        res.status(400).json(error);
      }
    };
  }
}

export const addMovieSchema = Joi.object().keys({
  title: Joi.string().required(),
  synopsis: Joi.string().required(),
  eventOrganizer: Joi.string().required(),
  tags: Joi.array().items(Joi.string().allow(' ', '')),
  // tslint:disable-next-line:no-null-keyword
  runtime: Joi.number().required(),
  // tslint:disable-next-line:no-null-keyword
  posterImg: Joi.string().required(),
  // coverImg: Joi.string().uri(),
  trailerLink: Joi.string(),
  // rating: Joi.number().required(),
  // contentRating: Joi.string(),
});
