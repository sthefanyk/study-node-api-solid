import { FastifyInstance } from 'fastify'
import { regiter } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', regiter)
}
