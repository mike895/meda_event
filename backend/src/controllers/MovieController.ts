import { Request, Response, NextFunction } from 'express';
import { omdbApiKey } from '../config';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import EventRepository from '../repositories/EventRepository';
import * as fetch from 'node-fetch';

// const multer  = require('multer')
// var path = require('path')



// export const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//                 cb(null, 'public/images')
//         },
//         filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//    }
// })

// export const upload = multer({
//         storage: storage,
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
  async SearchAnEvent2(req: Request, response: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const res = await prisma.event.findUnique({
        where: {
          id: id,
        },
      });
      // let responseJson = {};
      // if (res.status == 200) {
      //   const json = (await res.json()) as any;
      //   if (json.Error) {
      //     responseJson = { error: json.Error };
      //   } else {
      //     responseJson = json;
      //   }
      // } else {
      //   const json = (await res.json()) as any;
      //   if (json.Error) {
      //     responseJson = { error: json.Error };
      //   } else {
      //     responseJson = { error: 'Internal server error.' };
      //   }
      // }
      return response.status(200).json(res);
    } catch (error) {
      return apiErrorHandler(error, req, response, "Couldn't Find event.");
    }
  }


    async UpdateEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const {  title, synopsis, eventOrganizer, tags, runtime, posterImg,  eventAdderId, trailerLink, }: { title: string, synopsis: string, eventOrganizer: string, tags: string[], runtime: number, posterImg: string, eventAdderId: string, trailerLink: string | null,}= req.body;
            // const usernameTaken = await UsersRepository.getUserByUsername(username);
            // if (usernameTaken && id != usernameTaken.id) {
            //     return res.status(409).json({
            //         error: 'This username already belongs to an account.'
            //     });
            // }
            // const phoneNumberTaken = await UsersRepository.getUserByPhoneNumber(phoneNumber);
            // if (phoneNumberTaken && id != phoneNumberTaken?.id) {
            //     return res.status(409).json({
            //         error: 'This phone number already belongs to an account.'
            //     });
            // }
            const user = await EventRepository.UpdateEvent(id, {  title, synopsis, eventOrganizer, tags, runtime, posterImg,  eventAdderId, trailerLink });
            return res.status(201).json({
                error: undefined,
                message: 'Event updated successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Event couldn\'t be updated.');
        }
    }


    async GetEventById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                return res.status(404).json({ error: `Event not requested` });
            }
            const eventselected = await EventRepository.getEventById(req.params.id, {
              title: true,
              synopsis: true,
              eventOrganizer: true,
              tags: true,
              runtime: true,
              posterImg: true,
              eventAdderId: true,
              trailerLink: true,
            });
            if (!eventselected) {
                return res.status(404).json({ error: `User doesn't exist` });
            }
            return res.json({ 
              title: eventselected?.title,
              synopsis: eventselected?.synopsis,
              eventOrganizer: eventselected?.eventOrganizer,
              tags: eventselected?.tags,
              runtime: eventselected?.runtime,
              posterImg: eventselected?.posterImg,
              eventAdderId: eventselected?.eventAdderId,
              trailerLink: eventselected?.trailerLink, });
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Event couldn\'t be Created.');
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
