import { InavalidCredentialsError } from '@/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
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
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email,
            password,
        })

        const token = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sub: user.id,
            },
        )

        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sub: user.id,
                expiresIn: '7d',
            },
        )

        return reply
            .status(200)
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .send({
                token,
            })
    } catch (err) {
        if (err instanceof InavalidCredentialsError) {
            return reply.status(400).send({ message: err.message })
        }

        throw err
    }
}
