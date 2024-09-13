import { FastifyInstance } from 'fastify'
import { verfifyJWT } from '../../middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearly'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verfifyJWT)

    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)

    app.post('/gyms', create)
}
