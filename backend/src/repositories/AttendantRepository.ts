import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';
class AttendantRepository {
    constructor() { }

    async GetAttendantById(
        id: string,
        select: Prisma.AttendantSelect | null
      ): Promise<any> {
        return await prisma?.attendant.findUnique({
          where: {
            id,
          },
          select,
        });
      }



    async createUser({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role }: { category: string, subCategory:string , memberCountry: string , observerCountry: string , signatoryCountry: string , prospectiveCountry: string , title: string, firstName: string, lastName: string, organization: string, designation: string, email: string, country: string, phoneNumber: string , registrationDate: string , participationMode: string, sideEvents: string , role: string }) {
        return await prisma?.attendant.create({
            data: {
                category, 
                subCategory, 
                memberCountry, 
                observerCountry, 
                signatoryCountry, 
                prospectiveCountry, 
                title, 
                firstName, 
                lastName, 
                organization, 
                designation, 
                email, 
                country, 
                phoneNumber, 
                registrationDate, 
                participationMode, 
                sideEvents,
                role
            }
        }
        );
    }



    async createAttendance({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role }: { category: string, subCategory:string , memberCountry: string , observerCountry: string , signatoryCountry: string , prospectiveCountry: string , title: string, firstName: string, lastName: string, organization: string, designation: string, email: string, country: string, phoneNumber: string , registrationDate: string , participationMode: string, sideEvents: string , role: string }) {
      return await prisma?.attendant.create({
          data: {
              category, 
              subCategory, 
              memberCountry, 
              observerCountry, 
              signatoryCountry, 
              prospectiveCountry, 
              title, 
              firstName, 
              lastName, 
              organization, 
              designation, 
              email, 
              country, 
              phoneNumber, 
              registrationDate, 
              participationMode, 
              sideEvents,
              role
          }
      }
      );
  }




  async createhoheAttendant({  title, firstName, lastName, phoneNumber }: { title: string, firstName: string, lastName: string, phoneNumber: string }) {
    return await prisma?.hoheattendant.create({
        data: {
            title, 
            firstName, 
            lastName,
            phoneNumber
        }
    }
    );
}



    // async UpdateUser(id: string, { firstName, lastName, username, address, accountLockedOut, role, phoneNumber }: { firstName: string, lastName: string, username: string, address: string , accountLockedOut: boolean, role: number, phoneNumber: string }) {
    //     return await prisma?.user.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             firstName,
    //             lastName,
    //             username,
    //             normalizedUsername: username.toUpperCase(),
    //             address,
    //             accountLockedOut,
    //             userRoleId: role,
    //             phoneNumber: phoneNumber
    //         },
    //     }
    //     );
    // }

}

export default new AttendantRepository();