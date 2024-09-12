import { FastifyInstance } from 'fastify'
import { regiter } from './controllers/register'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', regiter)
    app.post('/sessions', authenticate)
}
