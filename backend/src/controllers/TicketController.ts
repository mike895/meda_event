import { Request, Response, NextFunction } from 'express';
// import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from '../handlers/errorHandler';
import { EventHallColumn } from '../types/eventHall';
import {
  PaymentStatus,
  Prisma,
  ReceiptStatus,
  TicketStatus,
} from '@prisma/client';
import prisma from '../db/db';
import dayjs = require('dayjs');
import * as duration from 'dayjs/plugin/duration';
import { generateUID } from '../utils/uid/index';
import { sendMessage, sendSmsMessage, sendToBot } from '../utils/messaging';
import Roles from '../data/roles';
import { scheduler } from '../scheduler';
import { AsyncTask, SimpleIntervalJob } from 'toad-scheduler';
import { webClientHostedUrl } from '../config';
import { Server } from 'socket.io';
import * as fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(duration);


export default class TicketController {
  constructor() {}
  async CreateTicket(req: Request, res: Response, next: NextFunction) {
    // Get the userId from the authenticated user @red.user.id (//!the phone num is the ID)
    try {
      const {
        seats,
        amount,
        showTimeId,
        chatid,
        // referenceNumber,
      }: {
        amount: number;
        // referenceNumber: string;
        showTimeId: string;
        seats: string[];
        chatid: string;
      } = req.body;

      
    
      const ticketId = uuidv4();
      const curuser = req.user as any;
      const { href, billReferenceNumber } =
        await TicketController.GenerateReference({
          name: curuser.firstName + curuser.lastName,
          phoneNumber: curuser.phoneNumber,
          amount: amount,
          ticketId: ticketId,
        });

      // ! Check if this is an active showtime
      const stb = await prisma.showTime.findUnique({
        where: {
          id: showTimeId,
        },
      });
      if (stb!.active == false) {
        return res.json({
          error: "You can't buy a ticket to a deactivated showtime",
        });
      }
      const seatTicketsAlreadyBought: string[] = [];
      for (const seat of seats) {
        const ticketForThisSeatExists = await prisma.ticketsOnSeats.findFirst({
          where: {
            seatId: seat,
            eventTicket: {
              showTimeId,
            },
          },
          include: {
            eventTicket: {
              include: {
                showTime: true,
              },
            },
            seat: true,
          },
        });

        if (ticketForThisSeatExists != undefined) {
          seatTicketsAlreadyBought.push(ticketForThisSeatExists.seat.seatName);
        }
      }
      if (seatTicketsAlreadyBought.length != 0)
        return res.status(409).json({
          error: `Seats ${seatTicketsAlreadyBought.join(
            ','
          )} have already been reserved`,
        });

      const seatTicketArray: { seatId: string; ticketKey: string }[] = [];
      for (const seat of seats) {
        let ticketKey: undefined | string = undefined;
        // Loop until a unique key is generated
        do {
          const generatedTicket = generateUID();
          if (
            !(await prisma.ticketsOnSeats.findUnique({
              where: { ticketKey: generatedTicket },
            }))
          ) {
            ticketKey = generatedTicket;
          }
        } while (ticketKey == undefined);
        seatTicketArray.push({
          seatId: seat,
          ticketKey,
        });
      }
      const createdEventTicket = await prisma.eventTicket.create({
        data: {
          id: ticketId,
          userId: (req.user as any).phoneNumber,
          referenceNumber: billReferenceNumber,
          showTimeId,
          amount: amount,
          paymentStatus: PaymentStatus.PENDING,
          chatid: chatid,
          TicketsOnSeats: {
            createMany: {
              data: seatTicketArray,
            },
          },
        },
        include: {
          TicketsOnSeats: {
            include: {
              seat: true,
            },
          },
          showTime: {
            include: {
              EventSchedule: {
                include: {
                  event: true,
                },
              },
              eventHall: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      // Send the req back
      res.status(201).json({ ...createdEventTicket, href });
      // ! END
      // ? The seats are "reserved" now and the code below will remove the reservation after x amount of time after the ticket was bought
      const task = new AsyncTask(
        'task to release seats reserved',
        async () => {
          console.log('Cleanse the seats...');
          await prisma.eventTicket.update({
            where: {
              id: createdEventTicket.id,
            },
            data: {
              // tslint:disable-next-line:no-null-keyword
              showTimeId: null,
              paymentStatus: PaymentStatus.CANCELED,
            },
          });
          scheduler.removeById(createdEventTicket.referenceNumber);
        },
        (err: Error) => {
          /* handle error here */
          // Don't deadlock please
          scheduler.removeById(createdEventTicket.referenceNumber);
        }
      );
      const job = new SimpleIntervalJob(
        { seconds: 600 },
        task,
        billReferenceNumber
      );
      scheduler.addSimpleIntervalJob(job);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't create ticket.");
    }
  }

  async GetTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketKey = req.params.ticketKey;

      const ticket = await prisma.ticketsOnSeats.findUnique({
        where: {
          ticketKey,
        },
        include: {
          redeemdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          eventTicket: {
            include: {
            
              showTime: {
                include: {
                  eventHall: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  EventSchedule: {
                    select: {
                      date: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
          seat: true,
        },
      });
      if (!ticket)
        return res.status(404).json({ error: "Ticket doesn't exist" });
      return res.status(200).json(ticket);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
    }
  }
  async GetTicketIssueInfoByKey(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticketKey = req.params.ticketKey;

      const ticket = await prisma.ticketsOnSeats.findUnique({
        where: {
          ticketKey,
        },
        select: {
          ticketKey: true,
          receiptStatus: true,
          fsNumber: true,
          seat: {
            select: {
              seatType: true,
              seatName: true,
            },
          },
          eventTicket: {
            include: {
              showTime: {
                include: {
                  EventSchedule: {
                    include: {
                      event: {
                        select: {
                          title: true,
                        },
                      },
                    },
                  },
                  eventHall: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!ticket)
        return res.status(404).json({ error: "Ticket doesn't exist" });
      return res.status(200).json(ticket);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
    }
  }
  async RedeemTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticketKey }: { ticketKey: string } = req.body;
      const isAlreadyReddemed = await prisma.ticketsOnSeats.findUnique({
        where: {
          ticketKey,
        },
        include: {
          redeemdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          eventTicket: {
            include: {
              showTime: {
                include: {
                  eventHall: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  EventSchedule: {
                    select: {
                      date: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
          seat: true,
        },
      });
      if (isAlreadyReddemed == undefined)
        return res
          .status(404)
          .json({ error: "Invalid ticket, ticket doesn't exist" });
      if (isAlreadyReddemed.ticketStatus == TicketStatus.REDEEMED)
        return res
          .status(409)
          .json({ error: 'This ticket has already been redeemed!' });
      if (isAlreadyReddemed.eventTicket.paymentStatus != PaymentStatus.PAYED)
        return res.status(409).json({ error: 'Payment not confirmed!' });
      const redeemedTicket = await prisma.ticketsOnSeats.update({
        where: {
          ticketKey: ticketKey,
        },
        data: {
          ticketStatus: TicketStatus.REDEEMED,
          ticketValidatorUserId: (req.user as any).id,
          redeemdAt: new Date(),
        },
        include: {
          redeemdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          eventTicket: {
            include: {
              showTime: {
                include: {
                  eventHall: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  EventSchedule: {
                    select: {
                      date: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
          seat: true,
        },
      });
      // tslint:disable-next-line:no-null-keyword
      return (
        res
          .status(200)
          // tslint:disable-next-line:no-null-keyword
          .json({ error: null, message: 'Ticket redeemed successfully!' })
      );
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
    }
  }
  async GetRedeemHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const redeemerId = (req.user as any).id;
      const size =
        req.query.size == undefined ? 10 : parseInt(req.query.size as any, 10);
      const page =
        req.query.page == undefined ? 1 : parseInt(req.query.page as any, 10);
      const skip = (page - 1) * size;
      const redeemedTickets = await prisma.ticketsOnSeats.findMany({
        take: size,
        skip,
        where: {
          ticketValidatorUserId: redeemerId,
          ticketStatus: TicketStatus.REDEEMED,
          // TODO Remove this on production
          NOT: {
            // tslint:disable-next-line:no-null-keyword
            redeemdAt: null,
          },
        },
        orderBy: {
          redeemdAt: 'desc',
        },
        include: {
          redeemdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          eventTicket: {
            include: {
              showTime: {
                include: {
                  eventHall: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  EventSchedule: {
                    select: {
                      date: true,
                      event: true,
                    },
                  },
                },
              },
            },
          },
          seat: true,
        },
      });
      return res.status(200).json(redeemedTickets);
    } catch (error) {
      return apiErrorHandler(
        error,
        req,
        res,
        'Error fetching redeemed tickets.'
      );
    }
  }
  async GetTicketById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const ticket = await prisma.eventTicket.findFirst({
        where: {
          id,
          userId: (req.user as any).phoneNumber,
        },
        include: {
          showTime: {
            include: {
              eventHall: {
                select: {
                  id: true,
                  name: true,
                },
              },
              EventSchedule: {
                select: {
                  date: true,
                  event: true,
                },
              },
            },
          },
          TicketsOnSeats: {
            include: {
              seat: true,
            },
          },
        },
      });
      if (!ticket)
        return res.status(404).json({ error: "Ticket doesn't exist" });
      return res.status(200).json(ticket);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get ticket.");
    }
  }
  async GetTicketBuyHistory(req: Request, res: Response, next: NextFunction) {
    // TODO Add authentication once there is a way to auth a meda user
    try {
      const ticket = await prisma.eventTicket.findMany({
        where: {
          userId: (req.user as any).phoneNumber,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          showTime: {
            include: {
              eventHall: {
                select: {
                  id: true,
                  name: true,
                },
              },
              EventSchedule: {
                select: {
                  date: true,
                  event: true,
                },
              },
            },
          },
          TicketsOnSeats: {
            include: {
              seat: true,
            },
          },
        },
      });
      // if (!ticket) return res.status(404).json({ error: "Ticket don't exist" });
      return res.status(200).json(ticket);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get ticket.");
    }
  }
  async GetSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        eventHall,
        event,
        redeemer,
        scheduleRange,
      }: {
        eventHall: string[] | undefined;
        event: string[] | undefined;
        redeemer: string[] | undefined;
        scheduleRange: string[] | undefined;
      } = req.body;
      let scheduleStartDate: any | undefined = undefined;
      let scheduleEndDate: any | undefined = undefined;
      if (scheduleRange) {
        scheduleStartDate = dayjs(scheduleRange[0]).toDate();
        scheduleEndDate = dayjs(scheduleRange[1]).toDate();
      }
      const allTickets = await prisma.eventTicket.findMany({
        where: {
          createdAt:
            scheduleRange == undefined
              ? scheduleRange
              : {
                  gte: scheduleStartDate,
                  lte: scheduleEndDate,
                },
          showTime: {
            AND: [
              {
                OR: [
                  ...(eventHall == undefined ? [] : eventHall).map((e) => {
                    return {
                      eventHallId: e,
                    };
                  }),
                ],
              },
              {
                OR: [
                  ...(event == undefined ? [] : event).map((e) => {
                    return {
                      EventSchedule: {
                        eventId: e,
                      },
                    };
                  }),
                ],
              },
            ],
          },
          TicketsOnSeats:
            redeemer == undefined
              ? undefined
              : {
                  some: {
                    OR: [
                      ...(redeemer == undefined ? [] : redeemer).map((e) => {
                        return {
                          ticketValidatorUserId: e,
                        };
                      }),
                    ],
                  },
                },
        },
        include: {
          showTime: {
            include: {
              EventSchedule: {
                include: {
                  event: true,
                },
              },
            },
          },
          TicketsOnSeats: {
            select: {
              ticketValidatorUserId: true,
            },
          },
        },
      });
      return res.status(200).json({
        tickets: {
          ticketsSold: allTickets.length,
          totalAmount: allTickets.reduce((a, b) => a + b.amount || 0, 0),
        },
      });
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get sales report.");
    }
  }
  async GetAllTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await prisma.ticketsOnSeats.findMany({
        include: {
          redeemdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          seat: true,
          eventTicket: {
            include: {
              showTime: {
                include: {
                  eventHall: true,
                  EventSchedule: {
                    include: {
                      event: {
                        select: {
                          title: true,
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!tickets) return res.status(404).json({ error: 'Error.' });
      return res.status(200).json(tickets);
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't get tickets.");
    }
  }
  async IssueReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticketKey, fsNumber }: { ticketKey: string; fsNumber: string } =
        req.body;

      const isAlreadyIssued = await prisma.ticketsOnSeats.findUnique({
        where: {
          ticketKey,
        },
        include: {
          eventTicket: true,
        },
      });
      if (isAlreadyIssued == undefined)
        return res
          .status(404)
          .json({ error: "Invalid ticket, ticket doesn't exist" });

      if (isAlreadyIssued.receiptStatus == ReceiptStatus.ISSUED)
        return res
          .status(409)
          .json({ error: 'A receipt has already been issued!' });
      if (isAlreadyIssued.eventTicket.paymentStatus != PaymentStatus.PAYED)
        return res.status(409).json({
          error:
            "Can't issue receipt for this ticket because payment isn't complete yet",
        });

      const issuedTicket = await prisma.ticketsOnSeats.update({
        where: {
          ticketKey: ticketKey,
        },
        data: {
          receiptStatus: ReceiptStatus.ISSUED,
          fsNumber,
        },
      });
      return (
        res
          .status(200)
          // tslint:disable-next-line:no-null-keyword
          .json({ error: null, message: 'Receipt issued successfully!' })
      );
    } catch (error) {
      return apiErrorHandler(error, req, res, "Couldn't issue receipt.");
    }
  }
  async TicketBoughtMedaPayCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const {
      orderId,
      status,
      referenceNumber,
      paymentMethod,
      isSimulation,
      amount,
    }: any = req.body;
    try {
      // Check env and if someone is using a simulation on production just end it
      if (
        process.env.NODE_ENV === 'production' &&
        isSimulation == true &&
        false
      )
        throw new Error("Can't use sandbox on prod");
      if (status == 'PAYED') {
        // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
        scheduler.removeById(referenceNumber);
        const eventTicket = await prisma.eventTicket.findUnique({
          where: {
            referenceNumber,
          },
          include: {
            TicketsOnSeats: {
              include: {
                seat: true,
              },
            },
            showTime: {
              include: {
                EventSchedule: {
                  include: {
                    event: true,
                  },
                },
                eventHall: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
        // tslint:disable-next-line:no-null-keyword
        if (eventTicket?.showTimeId == null) {
          // This means the reservation has already been removed and the user paid for a reservation that doesn't exist
          // Payment shouldn't be this annoying ffs
          // So now they need to be refunded so we'll mark it as need to be refunded
          scheduler.removeById(referenceNumber);
          await prisma.eventTicket.update({
            where: {
              referenceNumber,
            },
            data: {
              // tslint:disable-next-line:no-null-keyword
              showTimeId: null,
              paymentStatus: PaymentStatus.TOBERETURNED,
              referenceNumber: referenceNumber,
              paymentMethod,
              amount,
            },
          });
        } else {
          // ! PAYMENT SUCCESSFUL
          // TODO Check if anyone wants to be a smart ass and sends a fake amount
          const updatedTicket = await prisma.eventTicket.update({
            where: {
              referenceNumber,
            },
            data: {
              paymentStatus: PaymentStatus.PAYED,
              referenceNumber: referenceNumber,
              paymentMethod,
              amount,
            },
            include: {
              TicketsOnSeats: {
                include: {
                  seat: true,
                },
              },
              showTime: {
                include: {
                  EventSchedule: {
                    include: {
                      event: true,
                    },
                  },
                  eventHall: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          });
          // ! NOTIFY ALL USERS WITH ROLE FINANCE
          const allFinance = await prisma.user.findMany({
            where: {
              accountLockedOut: false,
              roles: {
                // Finance or cashier
                name: Roles.Finanace,
              },
            },
          });


          await sendSmsMessage(
            allFinance.map((e) => e.phoneNumber),
            `Meda|Ticket: ${
              eventTicket.TicketsOnSeats.length
            } tickets for the event ${
              eventTicket.showTime!.EventSchedule?.event.title
            } have been bought`
          );

          let seatNames = '';
          eventTicket.TicketsOnSeats.forEach((e) => {
            seatNames += `${e.ticketKey}, `;
          });


          // Send the user a notification and a url to checkout his link
          const msg = `Meda|Ticket \nDear user, \nYou have bought ${
          eventTicket.TicketsOnSeats.length
          } tickets for the event ${
          eventTicket.showTime!.EventSchedule?.event.title
          }\nhall name: ${eventTicket.showTime!.eventHall.name
          }\nseats: ${seatNames
          }\nreference number: ${eventTicket.referenceNumber
          }\ntime: ${dayjs(eventTicket.showTime?.time).format('h:mm A')} ${dayjs(eventTicket.showTime?.EventSchedule?.date).format('MMM DD, YYYY')
          }\n\nyou can get your ticket on Meda mobile app or at ${webClientHostedUrl}/tickets/${eventTicket.id
          }` ;
          
          await sendMessage(
            eventTicket.userId,
            msg
          );

          // Send message to telegram bot
          // if(eventTicket.chatid)
          if (eventTicket.chatid){
          const tickets_on_seats  = eventTicket.TicketsOnSeats 
          sendToBot(eventTicket.chatid, tickets_on_seats , msg)
          }
          // Notify the telegram bot server
          // const io: Server = req.app.get('io');
          // const ticketNotificationNamespace = io.of('/ticket-notification');
          // ticketNotificationNamespace.emit(
          //   'onTicketPaymentComplete',
          //   updatedTicket
          // );

        }
      } else if (status == 'CANCELED') {
        // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
        scheduler.removeById(referenceNumber);
        await prisma.eventTicket.update({
          where: {
            referenceNumber,
          },
          data: {
            // tslint:disable-next-line:no-null-keyword
            showTimeId: null,
            paymentStatus: PaymentStatus.CANCELED,
            referenceNumber: referenceNumber,
            paymentMethod,
          },
        });
      }
      return res.end();
    } catch (error) {
      return apiErrorHandler(error, req, res, 'Error confirming payment');
    }
  }
  static async GenerateReference({
    name,
    phoneNumber,
    amount,
    ticketId,
  }: {
    name: string;
    phoneNumber: string;
    amount: number;
    ticketId: string;
  }) {
    const mpay = await fetch(`https://api.pay.meda.chat/v1/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.0xCu1GltD3fM8EoZOryDtw7zQMvyBWq1vBbIzQEH1Fk`,
      },
      body: JSON.stringify({
        purchaseDetails: {
          orderId: 'Not Required',
          description: 'Meda|Tickets',
          amount: amount,
          customerName: name,
          customerPhoneNumber: phoneNumber.substring(1),
        },
        redirectUrls: {
          returnUrl: `https://meda.et/tickets/${ticketId}`,
          cancelUrl: 'NaN',
          callbackUrl: 'https://meda.et/api/ticket/meda-pay-callback',
        },
        metaData: {},
      }),
    });
    const mpayRes = await mpay.json();

    if (mpayRes.error) {
      throw new Error(mpayRes.error);
    }
    const { billReferenceNumber, link } = mpayRes;
    const { href } = link;
    return { billReferenceNumber, href };
  }
}
