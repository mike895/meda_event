import { Request, Response, NextFunction } from 'express';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import { EventHallColumn } from '../types/eventHall';
import prisma from '../db/db';
import * as moment from 'moment';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { date } from 'joi';
// import { EventType } from '@prisma/client';
// const utc = require('dayjs/plugin/utc');
dayjs.extend(duration);
export default class EventScheduleController {
  constructor() {}
  async CreateEventSchedule(req: Request, res: Response, next: NextFunction) {

    try {
      const {
        scheduleRange,
        event,
        showTimes,
        speakers,
        // vipTicketPrice,
        regularTicketPrice,
      }: {
        scheduleRange: string[];
        event: string;
        eventHall: string;
        // vipTicketPrice: number;
        regularTicketPrice: number;
        showTimes: { eventType: string; time: string; eventHall: string }[];
        speakers: { firstName: string; lastName: string; posterImg: string; biography: string  }[];
      } = req.body;
      const scheduleStartDate = dayjs(scheduleRange[0]);
      const scheduleEndDate = dayjs(scheduleRange[1]);
      // Get the date difference
      const dateRange = scheduleEndDate.diff(scheduleStartDate, 'day');
      const dateArray: dayjs.Dayjs[] = [];
      for (let _ = 0; _ < dateRange + 1; _++) {
        dateArray.push(scheduleStartDate.add(_, 'day'));
      }

      const showTimeArray: {
        // eventType: string;
        time: dayjs.Dayjs;
        eventHall: string;
      }[] = [];
      showTimes.forEach((e) => {
        showTimeArray.push({
          // eventType: e.eventType,
          time: dayjs(e.time),
          eventHall: e.eventHall,
        });
      });

      const speakerArray: {
       firstName: string;
       lastName: string; 
       biography: string;
	posterImg: string;
      }[] = [];
      speakers.forEach((e) => {
        speakerArray.push({
          firstName: e.firstName, 
          lastName: e.lastName, 
          biography: e.biography,
        posterImg: e.posterImg,
	});
      });

      await prisma.$transaction([
        ...dateArray.map((element) => {
          return prisma.eventSchedule.create({
            data: {
              date: new Date(element.toDate().setHours(0, 0, 0, 0)),
              eventId: event,
              regularTicketPrice: regularTicketPrice,
              // vipTicketPrice: vipTicketPrice,
              showTimes: {
                createMany: {
                  data: [
                    ...showTimeArray.map((e) => {
                      return {
                        eventHallId: e.eventHall,
                        // eventType:
                        //   e.eventType == '3D' ? EventType.THREE : EventType.TWO,
                        time: e.time.toDate(),
                      };
                    }),
                  ],
                },
              },
              speakers: {
                createMany: {
                  data: [
                    ...speakerArray.map((e) => {
                      return {
                        firstName: e.firstName, 
                        lastName: e.lastName, 
                        biography: e.biography,
			posterImg: e.posterImg,
                      };
                    }),
                  ],
                },
              },
            },
          });
        }),
      ]);
      return res
        .status(201)
        .json({ message: 'Schedule Created Successfully!' });
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't create Event Hall.");
    }
  }

  async GetAllEventSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(
        await prisma.eventSchedule.findMany({
          include: {
            event: true,
            showTimes: {
              include: {
                eventHall: true,
              },
            },
            speakers:true,
          },
        })
      );
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get schedules.");
    }
  }
  async GetEventSchedulesForPreview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
      // Fetch Schedules Available forward 5 days;
      const allEventSchedules = await prisma.eventSchedule.findMany({
        // where: {
        //   date: {
        //     gte: todayMidnight,
        //     lt: dayjs(todayMidnight).add(5, 'day').toDate(),
        //   },
        // },
        include: {
          event: true,
          showTimes: {
            include: {
              eventHall: true,
            },
          },
          speakers: true,
        },
      });
      
      const schedulesGrouped: { date: Date; schedules: any[] }[] = [];
      allEventSchedules.forEach((e) => {
        const scheduleDateIndex = schedulesGrouped.findIndex(
          (i) => i.date.getDate() === e.date.getDate()
        );
        if (scheduleDateIndex == -1) {
          schedulesGrouped.push({ date: e.date, schedules: [e] });
        } else {
          schedulesGrouped[scheduleDateIndex].schedules.push(e);
        }
      });
      return res.status(200).json(schedulesGrouped);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get schedules.");
    }
  }

  async GetEventSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const scheduleId = req.params.id;
      if (!scheduleId)
        return res.status(404).json({ error: "Couldn't find schedule!" });
      const schedule = await prisma.eventSchedule.findUnique({
        where: {
          id: scheduleId,
        },
        include: {
          event: true,
          showTimes: {
            include: {
              eventHall: true,
            },
          },
           speakers: true,
        },
      });
      if (!schedule)
        return res.status(404).json({ error: "Couldn't find schedule!" });
      return res.json(schedule);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get schedule.");
    }
  }

  // Check
  async GetShowTimeWithHall(req: Request, res: Response, next: NextFunction) {
    try {
      const showTimeId = req.params.id;
      if (!showTimeId)
        return res.status(404).json({ error: "Couldn't find schedule!" });
      const showtime = await prisma.showTime.findUnique({
        where: {
          id: showTimeId,
        },
        include: {
          EventSchedule: {
            include: {
              event: true,
            },
          },
          eventHall: {
            select: {
              name: true,
              id: true,
              regularSeats: {
                include: {
                  seats: {
                    select: {
                      id: true,
                      seatName: true,
                      seatType: true,
                      TicketsOnSeats: {
                        where: {
                          eventTicket: {
                            showTimeId: showTimeId,
                          },
                        },
                        select: {
                          seatId: true,
                          seat: {
                            select: {
                              id: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              // vipSeats: {
              //   include: {
              //     seats: {
              //       select: {
              //         seatName: true,
              //         id: true,
              //         seatType: true,
              //         TicketsOnSeats: {
              //           where: {
              //             eventTicket: {
              //               showTimeId: showTimeId,
              //             },
              //           },
              //           include: {
              //             seat: {
              //               select: {
              //                 id: true,
              //               },
              //             },
              //           },
              //         },
              //       },
              //     },
              //   },
              // },
            },
          },
        },
      });
      if (!showtime)
        return res.status(404).json({ error: "Couldn't find showtime!" });
      return res.json(showtime);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get showtime.");
    }
  }

  async DeleteShowtime(req: Request, res: Response, next: NextFunction) {
    try {
      const showTimeId = req.params.id;
      if (!showTimeId)
        return res.status(404).json({ error: "Couldn't find showtime!" });
      // Check wether the referenced showtime exists
      const showTime = await prisma.showTime.findUnique({
        where: {
          id: showTimeId,
        },
      });
      if (!showTime) {
        return res.status(404).json({ error: "Couldn't find showtime!" });
      }
      const ticketsForThisShowTime = await prisma.eventTicket.findMany({
        where: {
          showTimeId,
        },
        include: {
          TicketsOnSeats: true,
        },
      });
      // Had there been tickets sold for this showtime
      if (ticketsForThisShowTime.length > 0) {
        const totalAmountTickets = ticketsForThisShowTime
          .map((e) => e.TicketsOnSeats.length)
          .reduce((a, b) => a + b, 0);
        return res.status(409).json({
          error: `${totalAmountTickets} tickets have already been bought for this showtime so unfortunately you can't remove this showtime. You can deactivate it though.`,
        });
      } else {
        // Free
        await prisma.showTime.delete({
          where: {
            id: showTimeId,
          },
        });
        return res.status(200).json({ message: 'Deleted successfully!' });
      }
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Error deleting showtime.');
    }
  }

  async UpdateShowtime(req: Request, res: Response, next: NextFunction) {
    try {
      const showTimeId = req.params.id;
      let { active } = req.body;
      if (active == undefined) active = true;
      if (!showTimeId)
        return res.status(404).json({ error: "Couldn't find showtime!" });
      const showTime = await prisma.showTime.findUnique({
        where: {
          id: showTimeId,
        },
      });
      if (!showTime) {
        return res.status(404).json({ error: "Couldn't find showtime!" });
      }
      await prisma.showTime.update({
        where: {
          id: showTimeId,
        },
        data: {
          active,
        },
      });
      return res.status(201).json({ message: 'Showtime updated successfully' });
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Error deleting showtime.');
    }
  }

  async AddShowTimesToSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const {
        showTimes,
      }: {
        showTimes: { eventType: string; time: string; eventHall: string }[];
      } = req.body;
      const scheduleId = req.params.id;

      const showTimeArray: {
        // eventType: string;
        time: dayjs.Dayjs;
        eventHall: string;
      }[] = [];
      showTimes.forEach((e) => {
        showTimeArray.push({
          // eventType: e.eventType,
          time: dayjs(e.time),
          eventHall: e.eventHall,
        });
      });
      await prisma.eventSchedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          showTimes: {
            createMany: {
              data: [
                ...showTimeArray.map((e) => {
                  return {
                    eventHallId: e.eventHall,
                    // eventType:
                    //   e.eventType == '3D' ? EventType.THREE : EventType.TWO,
                    time: e.time.toDate(),
                  };
                }),
              ],
            },
          },
        },
      });
      return res
        .status(201)
        .json({ message: 'Schedule Updated Successfully!' });
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't update Schedule.");
    }
  }





//Speakers Controller

async AddSpeakerToSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {
      const {
        speakers,
      }: {
        speakers: { firstName: string; lastName: string; posterImg: string; biography: string }[];
      } = req.body;
      const scheduleId = req.params.id;

       const speakerArray: {
       firstName: string;
       lastName: string; 
       biography: string;
	posterImg: string;
      }[] = [];
      speakers.forEach((e) => {
        speakerArray.push({
          firstName: e.firstName, 
          lastName: e.lastName, 
          biography: e.biography,
	posterImg: e.posterImg,
        });
      });

      await prisma.eventSchedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          speakers: {
            createMany: {
              data: [
                ...speakerArray.map((e) => {
                  return {
                    firstName: e.firstName, 
                    lastName: e.lastName, 
                    biography: e.biography,
		    posterImg: e.posterImg,

                  };
                }),
              ],
            },
          },
        },
      });
      return res
        .status(201)
        .json({ message: 'Schedule Updated Successfully!' });
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't update Schedule.");
    }
  }



async DeleteSpeaker(req: Request, res: Response, next: NextFunction) {
    try {
      const speakerId = req.params.id;
      if (!speakerId)
        return res.status(404).json({ error: "Couldn't find speaker!" });
      // Check wether the referenced showtime exists
      const speaker = await prisma.speakers.findUnique({
        where: {
          id: speakerId,
        },
      });

      if (!speaker) {
        return res.status(404).json({ error: "Couldn't find speaker!" });
      }
      await prisma.speakers.delete({
          where: {
            id: speakerId,
          },
        });
      return res.status(200).json({ message: 'Deleted successfully!' });
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Error deleting speaker.');
    }
  }

  async UpdateSpeaker(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const speakerId = req.params.id;
    //   // let { active } = req.body;
    //   // if (active == undefined) active = true;
    //   if (!speakerId)
    //     return res.status(404).json({ error: "Couldn't find speaker!" });
    //   const speaker = await prisma.speakers.findUnique({
    //     where: {
    //       id: speakerId,
    //     },
    //   });
    //   if (!speaker) {
    //     return res.status(404).json({ error: "Couldn't find speaker!" });
    //   }
    //   await prisma.speakers.update({
    //     where: {
    //       id: speakerId,
    //     },
    //     data: {
    //       active,
    //     },
    //   });
    //   return res.status(201).json({ message: 'speaker updated successfully' });
    // } catch (error) {
    //   return apiErrorHandler(error, req, res, 'Error deleting speaker.');
    // }
    return null
  }
}
