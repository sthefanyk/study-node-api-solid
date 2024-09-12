import { it, describe, expect, TestContext, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InavalidCredentialsError } from '@/errors/invalid-credentials'
import { hash } from 'bcryptjs'

interface TestContextWithSut extends TestContext {
    usersRepository: InMemoryUsersRepository
    sut: AuthenticateUseCase
}

describe('Autheticate Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.usersRepository = new InMemoryUsersRepository()
        context.sut = new AuthenticateUseCase(context.usersRepository)
    })

    it('should be possible to authenticate the user', async ({
        usersRepository,
        sut,
    }: TestContextWithSut) => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not authenticate user with unregistered email', async ({
        sut,
    }: TestContextWithSut) => {
        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InavalidCredentialsError)
    })

    it('should not authenticate user with incorrect password', async ({
        usersRepository,
        sut,
    }: TestContextWithSut) => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123457',
            }),
        ).rejects.toBeInstanceOf(InavalidCredentialsError)
    })
})
