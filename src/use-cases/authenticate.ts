import { InavalidCredentialsError } from '@/errors/invalid-credentials'
import { User, UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
    email: string
    password: string
}

interface AuthenticateUseCaseReponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseReponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new InavalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InavalidCredentialsError()
        }

        return { user }
    }
}
