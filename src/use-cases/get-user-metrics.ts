import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
    userId: string
}

interface GetUserMetricsUseCaseReponse {
    checkInsCount: number
}

export class GetUserMetricsUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
    }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseReponse> {
        const checkInsCount =
            await this.checkInsRepository.countByUserID(userId)

        return { checkInsCount }
    }
}
