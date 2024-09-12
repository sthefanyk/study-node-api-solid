import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymUseCase } from './fetch-nearby-gyms'

interface TestContextWithSut extends TestContext {
    gymsRepository: InMemoryGymsRepository
    sut: FetchNearbyGymUseCase
}

describe('FetchNearby Gym Use Case', () => {
    beforeEach((context: TestContextWithSut) => {
        context.gymsRepository = new InMemoryGymsRepository()
        context.sut = new FetchNearbyGymUseCase(context.gymsRepository)
    })

    it('should be able to fetch nearby gyms', async ({
        sut,
        gymsRepository,
    }: TestContextWithSut) => {
        await gymsRepository.create({
            title: 'Far Gym',
            latitude: -25.5777838,
            longitude: -48.5767553,
            description: '',
            phone: '',
        })

        await gymsRepository.create({
            title: 'Near Gym',
            latitude: -25.5175805,
            longitude: -48.5151809,
            description: '',
            phone: '',
        })

        const { gyms } = await sut.execute({
            userLatitude: -25.512749,
            userLongitude: -48.513211,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
    })
})
