import { UserAlreadyExistsError } from '@/errors/user-already-exists'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterUseCaseRequest) {
        const passwordHash = await hash(password, 6)

        const userWithSameEmail = await this.userRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        await this.userRepository.create({
            name,
            email,
            password_hash: passwordHash,
        })
    }
}
