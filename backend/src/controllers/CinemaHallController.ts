import { Request, Response, NextFunction } from 'express';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import { EventHallColumn } from '../types/eventHall';
import prisma from '../db/db';
import { SeatType } from '@prisma/client';
export default class EventHallController {
    constructor() { }
    async CreateEventHall(req: Request, res: Response, next: NextFunction) {

        try {
            const { eventHallName, regularSeatMap }: { eventHallName: string, regularSeatMap: EventHallColumn[] } = req.body;
            const createdEventHall = await prisma.$transaction(async (prisma) => {
                const eventHall = await prisma.eventHall.create({
                    data: {
                        name: eventHallName,
                    }
                });
                for (const e of regularSeatMap) {
                    await prisma.seatColumn.create({
                        data: {
                            columnName: e.columnName,
                            columnOrder: e.columnOrder,
                            columnType: e.columnType,
                            eventHallRegularId: eventHall.id,
                            seats: {
                                createMany: {
                                    data: [
                                        ...e.seats.map(seat => {
                                            return {
                                                seatType: SeatType.REGULAR,
                                                seatName: seat.seatName
                                            };
                                        })
                                    ]
                                }
                            }
                        }
                    });
                }
                // for (const e of vipSeatMap) {
                //     await prisma.seatColumn.create({
                //         data: {
                //             columnName: e.columnName,
                //             columnOrder: e.columnOrder,
                //             columnType: e.columnType,
                //             // eventHallVipId: eventHall.id,
                //             seats: {
                //                 createMany: {
                //                     data: [
                //                         ...e.seats.map(seat => {
                //                             return {
                //                                 seatType: SeatType.VIP,
                //                                 seatName: seat.seatName
                //                             };
                //                         })
                //                     ]
                //                 }
                //             }
                //         }
                //     });
                // }
                return await prisma.eventHall.findUnique({
                    where: {
                        id: eventHall.id,
                    },
                    include: {
                        regularSeats: {
                            include: {
                                seats: true
                            }
                        }
                        // vipSeats: {
                        //     include: {
                        //         seats: true
                        //     }
                        // }

                    }
                });
            });
            return res.status(201).json(createdEventHall);
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Couldn\'t create Cinema Hall.');
        }
    }
    async GetAllEventHalls(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json(
                await prisma.eventHall.findMany({
                    include: {
                        regularSeats: {
                            include: {
                                seats: true
                            }
                        }
                        // vipSeats: {
                        //     include: {
                        //         seats: true
                        //     }
                        // }

                    }
                })
            );
        } catch (error) {
            return apiErrorHandler(error, req, res, 'Couldn\'t create movie.');
        }
    }

}


