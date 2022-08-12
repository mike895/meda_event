import prisma from '../db/db';
import { compare } from 'bcryptjs';
import { Prisma } from '@prisma/client';


class EventRepository {
  constructor() {}
  async getEventById(
    id: string,
    select: Prisma.EventSelect | null
  ): Promise<any> {
    return await prisma?.event.findUnique({
      where: {
        id,
      },
      select,
    });
  }
  async createEvent({
    title,
    synopsis,
    tags,
    runtime,
    eventOrganizer,
    posterImg,
    eventAdderId,
    trailerLink,
  }: {
    title: string;
    synopsis: string;
    eventOrganizer: string;
    tags: string[];
    runtime: number;
    posterImg: string;
    eventAdderId: string;
    trailerLink: string | null;
  }) {
    return await prisma?.event.create({
      data: {
        title,
        synopsis,
        eventOrganizer,
        tags,
        runtime,
        posterImg,
        eventAdderId,
        trailerLink,
      },
    });
  }
}

export default new EventRepository();
