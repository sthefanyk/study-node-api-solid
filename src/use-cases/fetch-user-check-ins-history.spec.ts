import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

interface TestContextWithSut extends TestContext {
    checkInsRepository: InMemoryCheckInsRepository
    sut: FetchUserCheckInsHistoryUseCase
}

describe('Fetch User Check-Ins History Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.checkInsRepository = new InMemoryCheckInsRepository()

        context.sut = new FetchUserCheckInsHistoryUseCase(
            context.checkInsRepository,
        )
    })

    it('should be able to fetch check-in history', async ({
        sut,
        checkInsRepository,
    }: TestContextWithSut) => {
        const userId = randomUUID()

        await checkInsRepository.create({
            user_id: userId,
            gym_id: 'gym_1',
        })

        await checkInsRepository.create({
            user_id: userId,
            gym_id: 'gym_2',
        })

        const { checkIns } = await sut.execute({ userId, page: 1 })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym_1' }),
            expect.objectContaining({ gym_id: 'gym_2' }),
        ])
    })

    it('should be able to fetch pagineted check-in history', async ({
        sut,
        checkInsRepository,
    }: TestContextWithSut) => {
        const userId = randomUUID()

        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                user_id: userId,
                gym_id: `gym_${i}`,
            })
        }

        const { checkIns } = await sut.execute({ userId, page: 2 })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym_21' }),
            expect.objectContaining({ gym_id: 'gym_22' }),
        ])
    })
})
