import { prisma } from '@/lib/prisma'
import {
    FindMAnyNearbyParams,
    Gym,
    GymInput,
    GymsRepository,
} from '@/repositories/gyms-repository'
import { Gym as GymPrisma } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
    async create(data: GymInput): Promise<Gym> {
        const gym = await prisma.gym.create({
            data,
        })

        return gym
    }

    async searchMany(query: string, page: number): Promise<Gym[]> {
        const gym = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return gym
    }

    async findById(id: string): Promise<Gym | null> {
        const gym = await prisma.gym.findUnique({
            where: {
                id,
            },
        })

        return gym
    }

    async findManyNearby({
        latitude,
        longitude,
    }: FindMAnyNearbyParams): Promise<Gym[]> {
        const gyms = await prisma.$queryRaw<GymPrisma[]>`
            SELECT * FROM gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 5
        `

        return gyms
    }
}
