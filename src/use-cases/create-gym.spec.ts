import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

interface TestContextWithSut extends TestContext {
    gymsRepository: InMemoryGymsRepository
    sut: CreateGymUseCase
}

describe('Create Gym Use Case', () => {
    beforeEach((context: TestContextWithSut) => {
        context.gymsRepository = new InMemoryGymsRepository()
        context.sut = new CreateGymUseCase(context.gymsRepository)
    })

    it('should be able to register gym', async ({
        sut,
    }: TestContextWithSut) => {
        const { gym } = await sut.execute({
            title: 'gym',
            latitude: -25.5777838,
            longitude: -48.5767553,
            description: '',
            phone: '',
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})
