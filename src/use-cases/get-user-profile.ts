import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { User, UsersRepository } from '@/repositories/users-repository'

interface GetUserProfileUseCaseRequest {
    userId: string
}

interface GetUserProfileUseCaseReponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute({
        userId,
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseReponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return { user }
    }
}
