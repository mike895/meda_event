import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import AuthRepository from '../repositories/AuthRepository';
import { jwtSecret } from '../config';
import { hashPassword } from '../utils/auth';
import AttendantRepository from '../repositories/AttendantRepository';
import TicketRedeemerUserRepository from '../repositories/TicketRedeemerUserRepository';
import prisma from '../db/db';
import { Prisma } from '@prisma/client';
import UserType from '../data/userType';
export default class AdminController {
    constructor() { }

    async CreateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role }: { category: string, subCategory:string , memberCountry: string , observerCountry: string , signatoryCountry: string , prospectiveCountry: string , title: string, firstName: string, lastName: string, organization: string, designation: string, email: string, country: string, phoneNumber: string , registrationDate: string , participationMode: string, sideEvents: string , role: string } = req.body;
           

            const user = await AttendantRepository.createUser({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role });
            return res.status(201).json({
                error: undefined,
                message: 'Attendant created successfully'
            });

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Attendant couldn\'t be created.');
        }
    }


    async CreatehoheUser(req: Request, res: Response, next: NextFunction) {
      try {

        const { firstName, lastName, phoneNumber }: { firstName: string, lastName: string, phoneNumber: string } = req.body;
           
        const user = await AttendantRepository.createhoheAttendant({ firstName, lastName, phoneNumber });
        return res.status(201).json({
            error: undefined,
            message: 'Hohe Attendant created successfully'
        });

      } catch (error) {
        return apiErrorHandler(error, req, res, "Couldn't create Hohe Attendant ")
      }


    }

    async GetAllHoheAttendant(req: Request, res: Response, next: NextFunction) {
      try {
      // console.log("hi")
        const attendance = await prisma.hoheAttendant.findMany({ });
        console.log("what",attendance)
        if (!attendance) return res.status(404).json({ error: 'Error.' });
        return res.status(200).json({msg:"hello",attendance});
      } catch (error) {
        return apiErrorHandler(error, req, res, "Couldn't get Hohe attendant.");
      }
    }


    async GetAllHoheAttendance(req: Request, res: Response, next: NextFunction) {
      try {
      // console.log("hi")
        const attendance = await prisma.hoheAttendance.findMany({ 
          include: {
            redeemdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            hoheattendant: {
              select: { 
                title: true, 
                firstName: true, 
                lastName: true,  
                phoneNumber: true, 
              },
            },
          },
        });
        if (!attendance) return res.status(404).json({ error: 'Error.' });
        return res.status(200).json(attendance);
      } catch (error) {
        return apiErrorHandler(error, req, res, "Couldn't get Hohe attendance.");
      }
    }



    async GetAllAttendance(req: Request, res: Response, next: NextFunction) {
        try {
        // console.log("hi")
          const attendance = await prisma.attendance.findMany({ 
            include: {
              redeemdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              attendant: {
                select: {
                  category: true, 
                  subCategory: true, 
                  memberCountry: true, 
                  observerCountry: true, 
                  signatoryCountry: true, 
                  prospectiveCountry: true, 
                  title: true, 
                  firstName: true, 
                  lastName: true, 
                  organization: true, 
                  designation: true, 
                  email: true, 
                  country: true, 
                  phoneNumber: true, 
                  registrationDate: true, 
                  participationMode: true, 
                  sideEvents: true, 
                  role: true,
                },
              },
            },
          });
          if (!attendance) return res.status(404).json({ error: 'Error.' });
          return res.status(200).json(attendance);
        } catch (error) {
          return apiErrorHandler(error, req, res, "Couldn't get attendance.");
        }
      }


      async GetAllAttendant(req: Request, res: Response, next: NextFunction) {
        try {
        console.log("hi")
          const attendance = await prisma.attendant.findMany({ });
          if (!attendance) return res.status(404).json({ error: 'Error.' });
          return res.status(200).json(attendance);
        } catch (error) {
          return apiErrorHandler(error, req, res, "Couldn't get attendant.");
        }
      }






    async GetAttendantById(req: Request, res: Response, next: NextFunction) {
        try {
           const session =req.params.session;

            if (!req.params.id) {
                return res.status(404).json({ error: `Attendant not requested` });
            }
            const attendantselected = await AttendantRepository.GetAttendantById(req.params.id, {
                category: true, 
                subCategory: true, 
                memberCountry: true, 
                observerCountry: true, 
                signatoryCountry: true, 
                prospectiveCountry: true, 
                title: true, 
                firstName: true, 
                lastName: true, 
                organization: true, 
                designation: true, 
                email: true, 
                country: true, 
                phoneNumber: true, 
                registrationDate: true, 
                participationMode: true, 
                sideEvents: true, 
                // redeemdBy: true,
                // redeemdAt: true,
                // session1: true,  
                // session2: true,  
                // session3: true, 
                // session4: true, 
                role: true,

            });

        //   if(attendantselected)
        //   return res
        //      .status(200)
        //      .json({msg: attendantselected?.email,  session});



/*
            return res.json({ 

                category: attendantselected?.category, 
                subCategory: attendantselected?.subCategory, 
                memberCountry: attendantselected?.memberCountry, 
                observerCountry: attendantselected?.observerCountry, 
                signatoryCountry: attendantselected?.signatoryCountry, 
                prospectiveCountry: attendantselected?.prospectiveCountry, 
                title: attendantselected?.title, 
                firstName: attendantselected?.firstName, 
                lastName: attendantselected?.lastName, 
                organization: attendantselected?.organization, 
                designation: attendantselected?.designation, 
                email: attendantselected?.email, 
                country: attendantselected?.country, 
                phoneNumber: attendantselected?.phoneNumber, 
                registrationDate: attendantselected?.registrationDate, 
                participationMode: attendantselected?.participationMode, 
                sideEvents: attendantselected?.sideEvents, 
                redeemdBy: attendantselected?.redeemdBy,
                redeemdAt: attendantselected?.redeemdAt,
                session1: attendantselected?.session1,  
                session2: attendantselected?.session2,  
                session3: attendantselected?.session3, 
                session4: attendantselected?.session4, 
                role: attendantselected?.role, });

*/
                return res.json({message: "successfully checked In"})

        } catch (error) {
            return apiErrorHandler(error, req, res, 'Attendant couldn\'t be found.');
        }
    }



    async CheckBadge(req: Request, res: Response, next: NextFunction) {
        try {
          console.log("hello badge")
          const session = req.params.session;
          const id = req.params.id;
          const attendantselected = await prisma.attendant.findUnique({
            where: {
              id,
            },
          });

          // if(attendantselected)
          //   return res
          //      .status(200)
          //      .json({msg: attendantselected});


          if (attendantselected == undefined)
            return res
              .status(404)
              .json({ error: "Invalid badge, Attendee doesn't exist", Status: 0 });


          

          // const checkTicket = await prisma.attendance.findMany({
          //   where: {
          //     attendantId: id,
          //     session: session,
          //   },
          // });

          // if (!checkTicket) {
          //   return res.json({error: "Attendant has already checked in"})
          // }

          const redeemedTicket = await prisma.attendance.create({
            data: {
              attendantId: id,
              ticketValidatorUserId: (req.user as any).id,
              redeemdAt: new Date(),
              sessionEvent: session,
            },
  
          });

          // tslint:disable-next-line:no-null-keyword
          return (
            res
              .status(200)
              // tslint:disable-next-line:no-null-keyword
              .json({ error: null,attendant:{title: attendantselected.title,firstName: attendantselected.firstName, lastName: attendantselected.lastName, organization: attendantselected.organization, designation: attendantselected.designation}, message: 'Checked in successfully!',Status:1 })
          );
        } catch (error) {
          return apiErrorHandler(error, req, res, "Couldn't check in ticket.");
        }
      }




      async CheckHoheBadge(req: Request, res: Response, next: NextFunction) {
        try {
          console.log("hello hohe badge")
          // const session = req.params.session;
          const id = req.params.id;
          console.log("hohebadge",id)
          const attendantselected = await prisma.hoheAttendant.findUnique({
            where: {
              id,
            },
            select: {
              firstName:true,
              lastName:true,
              phoneNumber:true,
            },
          });
console.log("qaaqqqqqqqqqqq",attendantselected)
          // if(attendantselected)
          //   return res
          //      .status(200)
          //      .json({msg: attendantselected});


          if (attendantselected == undefined)
            return res
              .status(404)
              .json({ error: "Invalid badge, Attendee doesn't exist", Status: 0 });


          const redeemedTicket = await prisma.hoheAttendance.create({
            data: {
              hoheattendantId: id,
              // ticketValidatorUserId: (req.user as any).id,
              redeemdAt: new Date(),
            },
  
          });

          // tslint:disable-next-line:no-null-keyword
          return (
            res
              .status(200)
              .json({ error: null,attendant:{firstName: attendantselected.firstName, lastName: attendantselected.lastName }, message: 'Checked in successfully!',Status:1 })
          );
        } catch (error) {
          return apiErrorHandler(error, req, res, "Couldn't check in ticket.");
        }
      }





}
