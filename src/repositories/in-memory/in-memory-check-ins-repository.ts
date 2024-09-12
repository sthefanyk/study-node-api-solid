import { randomUUID } from 'node:crypto'
import {
    CheckIn,
    CheckInInput,
    CheckInsRepository,
} from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async findManyUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.items
            .filter((checkIn) => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20)
    }

    async create(data: CheckInInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
        }

        this.items.push(checkIn)

        return checkIn
    }

    async findByUserIdOnDate(
        userId: string,
        date: Date,
    ): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSamaDate =
                checkInDate.isAfter(startOfTheDay) &&
                checkInDate.isBefore(endOfTheDay)

            return checkIn.user_id === userId && isOnSamaDate
        })

        if (!checkInOnSameDate) {
            return null
        }

        return checkInOnSameDate
    }
}
