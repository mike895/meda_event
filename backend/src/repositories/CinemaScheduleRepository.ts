import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';
class EventScheduleRepository {
    constructor() { }
    async getEventScheduleById(id: string, select: Prisma.EventScheduleSelect | null): Promise<any> {
        return await prisma?.eventSchedule.findUnique({
            where: {
                id
            },
            select
        });
    }
}

export default new EventScheduleRepository();