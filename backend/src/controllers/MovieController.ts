import { Request, Response, NextFunction } from 'express';
import { omdbApiKey } from '../config';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import EventRepository from '../repositories/EventRepository';
import * as fetch from 'node-fetch';
export default class EventController {
  constructor() {}

  async CreateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        synopsis,
        tags,
        runtime,
        posterImg,
        eventOrganizer,
        trailerLink,
      }: {
        title: string;
        synopsis: string;
        eventOrganizer: string;
        tags: string[];
        runtime: number;
        posterImg: string;
        trailerLink: string | null;
      } = req.body;
      const evOld = await prisma.event.findUnique({
        where: {
          title: title,
        },
      });
      if (evOld) {
        return res.status(409).json({
          error: 'Event already exists.',
        });
      }
      const event = EventRepository.createEvent({
        tags,
        eventAdderId: (req.user as any).id,
        eventOrganizer,
        posterImg,
        runtime,
        synopsis,
        title,
        trailerLink,
      });
      return res.status(201).json({
        error: undefined,
        message: 'Event created successfully',
      });
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't create event.");
    }
  }

  async SearchAnEvent(req: Request, response: Response, next: NextFunction) {
    try {
      const title = req.params.title;
      const res = await fetch(
        `http://www.omdbapi.com/?` +
          new URLSearchParams({
            t: title,
            apikey: omdbApiKey!,
          }),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      let responseJson = {};
      if (res.status == 200) {
        const json = (await res.json()) as any;
        if (json.Error) {
          responseJson = { error: json.Error };
        } else {
          responseJson = json;
        }
      } else {
        const json = (await res.json()) as any;
        if (json.Error) {
          responseJson = { error: json.Error };
        } else {
          responseJson = { error: 'Internal server error.' };
        }
      }
      return response.status(200).json(responseJson);
    } catch (error) {
      return apiErrorHandler(error, req, response, "Couldn't Find event.");
    }
  }
  async GetAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(
        await prisma.event.findMany({
          include: {
            addedBy: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        })
      );
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't create event.");
    }
  }
}
