import { Gym, GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymUseCaseRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymUseCaseReponse {
    gyms: Gym[]
}

export class FetchNearbyGymUseCase {
    constructor(private gymRepository: GymsRepository) {}

    async execute({
        userLatitude,
        userLongitude,
    }: FetchNearbyGymUseCaseRequest): Promise<FetchNearbyGymUseCaseReponse> {
        const gyms = await this.gymRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude,
        })

        return { gyms }
    }
}
