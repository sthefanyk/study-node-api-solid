import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'
import { title } from 'process'

interface TestContextWithSut extends TestContext {
    gymsRepository: InMemoryGymsRepository
    sut: SearchGymUseCase
}

describe('Search Gym Use Case', () => {
    beforeEach((context: TestContextWithSut) => {
        context.gymsRepository = new InMemoryGymsRepository()
        context.sut = new SearchGymUseCase(context.gymsRepository)
    })

    it('should be able to search gym by title', async ({
        sut,
        gymsRepository,
    }: TestContextWithSut) => {
        await gymsRepository.create({
            title: 'Javascript Gym',
            latitude: -25.5777838,
            longitude: -48.5767553,
            description: '',
            phone: '',
        })

        await gymsRepository.create({
            title: 'Typescript Gym',
            latitude: -25.5777838,
            longitude: -48.5767553,
            description: '',
            phone: '',
        })

        const { gyms } = await sut.execute({ query: 'Javascript', page: 1 })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym' }),
        ])
    })

    it('should be able to fetch pagineted gym search', async ({
        sut,
        gymsRepository,
    }: TestContextWithSut) => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `gym_${i}`,
                latitude: -25.5777838,
                longitude: -48.5767553,
                description: '',
                phone: '',
            })
        }

        const { gyms } = await sut.execute({ query: 'gym', page: 2 })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'gym_21' }),
            expect.objectContaining({ title: 'gym_22' }),
        ])
    })
})
