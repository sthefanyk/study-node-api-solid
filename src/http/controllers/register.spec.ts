import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(response.statusCode).toEqual(201)
    })

    // it('should not be able to register with same email twice', async () => {
    //     await request(app.server).post('/users').send({
    //         name: 'John Doe',
    //         email: 'johndoe@example.com',
    //         password: '123456',
    //     })

    //     const response = await request(app.server).post('/users').send({
    //         name: 'John Doe',
    //         email: 'johndoe@example.com',
    //         password: '123456',
    //     })

    //     expect(response.statusCode).toEqual(409)
    //     expect(response.body.message).toEqual('E-mail already exists.')
    // })
})
