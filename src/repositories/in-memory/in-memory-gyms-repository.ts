import { randomUUID } from 'node:crypto'
import { Gym, GymInput, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements GymsRepository {
    public gyms: Gym[] = []

    async create(data: GymInput): Promise<Gym> {
        const gym: Gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
            created_at: new Date(),
        }

        this.gyms.push(gym)

        return gym
    }

    async findById(id: string): Promise<Gym | null> {
        const gym = this.gyms.find((gym) => gym.id === id)
        return !gym ? null : gym
    }
}
