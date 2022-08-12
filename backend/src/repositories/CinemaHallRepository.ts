import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';
class EventHallRepository {
    constructor() { }
    async getEventHallById(id: string, select: Prisma.EventHallSelect | null): Promise<any> {
        return await prisma?.eventHall.findUnique({
            where: {
                id
            },
            select
        });
    }
}

export default new EventHallRepository();