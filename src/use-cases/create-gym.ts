import { Gym, GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymUseCaseReponse {
    gym: Gym
}

export class CreateGymUseCase {
    constructor(private gymRepository: GymsRepository) {}

    async execute(
        data: CreateGymUseCaseRequest,
    ): Promise<CreateGymUseCaseReponse> {
        const gym = await this.gymRepository.create(data)

        return { gym }
    }
}
