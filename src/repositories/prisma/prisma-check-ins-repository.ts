import { prisma } from '@/lib/prisma'
import {
    CheckIn,
    CheckInInput,
    CheckInsRepository,
} from '@/repositories/check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: CheckInInput): Promise<CheckIn> {
        const checkIn = prisma.checkIn.create({
            data,
        })

        return checkIn
    }

    async save(data: CheckIn): Promise<CheckIn> {
        const checkIn = prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        })

        return checkIn
    }

    async findById(checkInId: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: checkInId,
            },
        })

        return checkIn ?? null
    }

    async findByUserIdOnDate(
        userId: string,
        date: Date,
    ): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                },
            },
        })

        return checkIn ?? null
    }

    async findManyUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return checkIns
    }

    async countByUserID(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        })

        return count
    }
}
