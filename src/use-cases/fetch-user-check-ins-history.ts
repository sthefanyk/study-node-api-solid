import {
    CheckIn,
    CheckInsRepository,
} from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string
    page: number
}

interface FetchUserCheckInsHistoryUseCaseReponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
        page,
    }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseReponse> {
        const checkIns = await this.checkInsRepository.findManyUserId(
            userId,
            page,
        )

        return { checkIns }
    }
}
