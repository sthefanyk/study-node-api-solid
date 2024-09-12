import { MaxDistanceError } from '@/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import {
    CheckIn,
    CheckInsRepository,
} from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

interface CheckInUseCaseRequest {
    user_id: string
    gym_id: string
    validated_at?: Date | string | null
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseReponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute({
        gym_id,
        user_id,
        validated_at,
        userLatitude,
        userLongitude,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseReponse> {
        const gym = await this.gymsRepository.findById(gym_id)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            },
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError()
        }

        const checkInOnSameDate =
            await this.checkInsRepository.findByUserIdOnDate(
                user_id,
                new Date(),
            )

        if (checkInOnSameDate) {
            throw new MaxNumberOfCheckInsError()
        }

        const checkIn = await this.checkInsRepository.create({
            user_id,
            gym_id,
            validated_at,
        })

        return { checkIn }
    }
}
