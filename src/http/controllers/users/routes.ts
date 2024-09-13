import { FastifyInstance } from 'fastify'
import { regiter } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verfifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', regiter)
    app.post('/sessions', authenticate)

    /** Authenticated */
    app.get('/me', { onRequest: [verfifyJWT] }, profile)
}
