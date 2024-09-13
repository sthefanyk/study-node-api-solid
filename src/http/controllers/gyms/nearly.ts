import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchNearlyGymsUseCase } from '@/use-cases/factories/make-fetch-nearly-gyms-use-case'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        }),
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body)

    const fetchNearbyGymsUseCase = makeFetchNearlyGymsUseCase()

    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return reply.status(200).send({
        gyms,
    })
}
