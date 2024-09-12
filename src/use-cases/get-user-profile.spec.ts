import { it, describe, expect, TestContext, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    usersRepository: InMemoryUsersRepository
    sut: GetUserProfileUseCase
}

describe('Get User Profile Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.usersRepository = new InMemoryUsersRepository()
        context.sut = new GetUserProfileUseCase(context.usersRepository)
    })

    it('should be able to get user profile', async ({
        usersRepository,
        sut,
    }: TestContextWithSut) => {
        const userCreated = await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await sut.execute({
            userId: userCreated.id,
        })

        expect(user.name).toEqual(userCreated.name)
        expect(user.email).toEqual(userCreated.email)
    })

    it('should not be able get user profile with wrong id', async ({
        sut,
    }: TestContextWithSut) => {
        await expect(() =>
            sut.execute({
                userId: 'non-existing-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
