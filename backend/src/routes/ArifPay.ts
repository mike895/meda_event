import axios from 'axios';
import { Router, json } from 'express';
import CinemaHallController from '../controllers/CinemaHallController';
import Roles from '../data/roles';
import UserType from '../data/userType';
import userAuth from '../middlewares/userAuth';
import userRoleAuth from '../middlewares/userRoleAuth';
import userTypeAuth from '../middlewares/userTypeAuth';
import {
  addCinemaHallSchema,
  CinemaHallValidator,
} from '../validators/cinemaHallValidator';


import {
  PaymentStatus,
  Prisma,
  ReceiptStatus,
  TicketStatus,
} from '@prisma/client';
import prisma from '../db/db';

class ArifPayRoutes {
  router = Router();
  cinemaHallController = new CinemaHallController();
  cinemaHallValidator = new CinemaHallValidator();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // this.router
    //   .route('/')
    //   .get(
    //     userAuth,
    //     userTypeAuth(UserType.User),
    //     userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Finanace]),
    //     this.cinemaHallController.GetAllEventHalls
    //   );
    this.router.post('/create', (req, res, next) => {
      const { price, name, quantity, id: orderId } = req.body;

      //   console.log(orderId, price, name, quantity);

      axios({
        method: 'post',
        headers: {
          application: 'asldkj',
          'x-arifpay-key': `${process.env.ARIF_PAY_KEY}`,
        },

        url: `https://gateway.arifpay.net/v0/sandbox/checkout/session`,
        data: {
          cancelUrl: 'http://cancel',
          nonce: orderId,
          errorUrl: 'http://error',
          notifyUrl: 'https://meda.et/api/ticket/arifpay-callback',
          successUrl: 'http://success',
          paymentMethods: ['CARD', 'AWASH'],
          expireDate: new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          items: [
            {
              name,
              quantity,
              price,
              image: 'https://meda.et/images/logo.png',
            },
          ],
          beneficiaries: [
            {
              accountNumber: '01320662432100',
              bank: 'AWINETAA',
              amount: price,
            },
          ],
        },
      })
        .then(async (ArifRes) => {
          console.log('----------------');
          console.log(ArifRes.data);
          console.log(orderId);
          console.log('----------------');

          const updateReference = await prisma.eventTicket.update({
            where: {
              id: orderId,
            },
            data: {
              referenceNumber: ArifRes.data.sessionId,
            },
          });
          return res.status(200).json(ArifRes.data);
        })
        .catch((err) => {
          console.log(err);
          return res.status(200).json('Error creating arifpay payment');
        });

      //   needle.post(
      //     `https://gateway.arifpay.net/v0/sandbox/checkout/session`,
      //     {
      //       cancelUrl: 'http://cancel',
      //       nonce: orderId,
      //       errorUrl: 'http://error',
      //       notifyUrl: 'https://meda.et/api/arifpay/callback',
      //       successUrl: 'http://success',
      //       paymentMethods: ['CARD', 'AWASH'],
      //       expireDate: new Date(
      //         Date.now() + 1 * 24 * 60 * 60 * 1000
      //       ).toISOString(),
      //       items: [
      //         {
      //           name,
      //           quantity,
      //           price,
      //           image: 'https://meda.et/images/logo.png',
      //         },
      //       ],
      //       beneficiaries: [
      //         {
      //           accountNumber: '01320662432100',
      //           bank: 'AWINETAA',
      //           amount: price,
      //         },
      //       ],
      //     },
      //     {
      //       json: true,
      //       headers: {
      //         'x-arifpay-key': process.env.ARIF_PAY_KEY,
      //       },
      //     },
      //     (arifError, arifRes, arifBody) => {
      //       console.log(arifRes);

      //       console.log(
      //         '*** Arif pay response: code - ',
      //         arifRes.statusCode,
      //         '\nbody - ',
      //         arifBody
      //       );

      //       if (arifError) {
      //         console.log('Arif pay Error: ', arifBody);
      //         return res.status(arifRes.statusCode).json({ error: arifBody });
      //       } else {
      //         needle.put(
      //           `${'frappeUrl'}/api/resource/Order/${req.params.orderId}`,
      //           {
      //             session_id: arifBody.data.sessionId,
      //           },
      //           { json: true },
      //           (err, ress, body) => {
      //             if (err) {
      //               console.log(
      //                 'Error while adding reference number to order: ',
      //                 err
      //               );
      //               res.status(ress.statusCode).json({ error: err });
      //             } else {
      //               // console.log(body);
      //               res.status(ress.statusCode).json({
      //                 paymentUrl: arifBody.data.paymentUrl,
      //                 cancelUrl: arifBody.data.cancelUrl,
      //                 total: arifBody.data.totalAmount,
      //               });
      //             }
      //           }
      //         );
      //       }
      //     }
      //   );
    });

    // this.router.post('/callback', (req, res, next) => {
    //   console.log('***Arifpay called with body *** ', req.body);
    //   needle.get(
    //     `${'frappeUrl'}/api/resource/Order/${req.body.nonce}`,
    //     (orderErr, orderRes, orderBody) => {
    //       if (orderErr) {
    //         console.log(
    //           'Payment callback for order ' +
    //             req.body.nonce +
    //             ' has no order in database'
    //         );
    //         console.log('Get order error ', orderErr);
    //         return res.status(200).json({ error: orderErr });
    //       } else {
    //         needle.get(
    //           `https://gateway.arifpay.net/v0/sandbox/checkout/session/${orderBody.data.session_id}`,
    //           {
    //             headers: {
    //               'x-arifpay-key': '5tWdaIuiYnn7a3FxGJwaoRdSkvzqUGBM',
    //             },
    //           },
    //           (arifErr, arifRes, arifBody) => {
    //             if (arifErr) {
    //               console.log(
    //                 "Arif callback called but we couldn't double check the session ",
    //                 arifErr
    //               );
    //               return res.status(200).json({ error: arifErr });
    //             } else {
    //               console.log(
    //                 'Got session check result from arif pay: ',
    //                 arifBody
    //               );
    //               if (arifBody.data.totalAmount >= orderBody.data.grand) {
    //                 let status;
    //                 switch (arifBody.data.transaction.transactionStatus) {
    //                   case 'CANCELLED':
    //                     status = 'Cancelled';
    //                     break;
    //                   case 'FAILED':
    //                     status = 'Failed';
    //                     break;
    //                   case 'EXPIRED':
    //                     status = 'Expired';
    //                     break;
    //                   case 'SUCCESS':
    //                     status = 'Complete';
    //                     break;
    //                   case 'PENDING':
    //                     status = 'Pending';
    //                     break;
    //                   default:
    //                     console.log(
    //                       'Arifpay payment status not from the expected enum'
    //                     );
    //                     status = 'Initiated';
    //                 }
    //                 needle.put(
    //                   `${'frappeUrl'}/api/resource/Order/${req.body.nonce}`,
    //                   {
    //                     payment_status: status,
    //                   },
    //                   { json: true },
    //                   (err, ress, body) => {
    //                     if (err) {
    //                       console.log(
    //                         'Error while putting new payment status: ',
    //                         err
    //                       );
    //                       res.status(200).json({ error: err });
    //                     } else {
    //                       console.log('Put status ', status, ' body ', body);
    //                       res.status(200).json(body);
    //                     }
    //                   }
    //                 );
    //               } else {
    //                 console.log(
    //                   'Arifpay totalAmount and order grand total is not equal: ',
    //                   arifBody.data.totalAmount,
    //                   ', ',
    //                   orderBody.data.grand
    //                 );
    //                 res
    //                   .status(200)
    //                   .json({ error: 'User payed the wrong amount' });
    //               }
    //             }
    //           }
    //         );
    //       }
    //     }
    //   );
    // });
  }
}

export default new ArifPayRoutes().router;