import { FastifyInstance } from 'fastify'
import { regiter } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verfifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', regiter)
    app.post('/sessions', authenticate)

    /** Authenticated */
    app.get('/me', { onRequest: [verfifyJWT] }, profile)
}
