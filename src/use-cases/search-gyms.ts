import { Gym, GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymUseCaseRequest {
    query: string
    page: number
}

interface SearchGymUseCaseReponse {
    gyms: Gym[]
}

export class SearchGymUseCase {
    constructor(private gymRepository: GymsRepository) {}

    async execute({
        query,
        page,
    }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseReponse> {
        const gyms = await this.gymRepository.searchMany(query, page)

        return { gyms }
    }
}
