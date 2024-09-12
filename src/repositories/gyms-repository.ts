import { Prisma } from '@prisma/client'

export type Gym = {
    id: string
    title: string
    description?: string | null
    phone: string | null
    latitude: Prisma.Decimal
    longitude: Prisma.Decimal
    created_at: Date | string
}

export type GymInput = Prisma.GymCreateInput

export interface GymsRepository {
    create(data: GymInput): Promise<Gym>
    findById(id: string): Promise<Gym | null>
}
