import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

interface TestContextWithSut extends TestContext {
    usersRepository: InMemoryUsersRepository
    sut: RegisterUseCase
}

describe('Register Use Case', () => {
    beforeEach((context: TestContextWithSut) => {
        context.usersRepository = new InMemoryUsersRepository()
        context.sut = new RegisterUseCase(context.usersRepository)
    })

    it('should be able to register', async ({ sut }: TestContextWithSut) => {
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async ({
        sut,
    }: TestContextWithSut) => {
        const password = '123456'

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password,
        })

        const isPasswordCorrectlyHashed = await compare(
            password,
            user.password_hash,
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async ({
        sut,
    }: TestContextWithSut) => {
        const email = 'johndoe@example.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
