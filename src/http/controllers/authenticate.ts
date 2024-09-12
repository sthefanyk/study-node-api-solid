import { InavalidCredentialsError } from '@/errors/invalid-credentials'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateSchema.parse(request.body)

    try {
        const userRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(userRepository)

        await authenticateUseCase.execute({
            email,
            password,
        })
    } catch (err) {
        if (err instanceof InavalidCredentialsError) {
            return reply.status(400).send({ message: err.message })
        }

        throw err
    }

    return reply.status(200).send()
}
