import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const response = await request(app.server).post('/sessions').send({
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String),
        })
    })

    it('should not authenticate user with unregistered email', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const response = await request(app.server).post('/sessions').send({
            email: 'johndoe1@example.com',
            password: '123456',
        })

        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: 'Invalid credentials.',
        })
    })

    it('should not authenticate user with incorrect password', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const response = await request(app.server).post('/sessions').send({
            email: 'johndoe@example.com',
            password: '1234567',
        })

        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: 'Invalid credentials.',
        })
    })
})
