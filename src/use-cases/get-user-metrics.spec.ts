import { it, describe, expect, beforeEach, TestContext } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'
import { GetUserMetricsUseCase } from './get-user-metrics'

interface TestContextWithSut extends TestContext {
    checkInsRepository: InMemoryCheckInsRepository
    sut: GetUserMetricsUseCase
}

describe('Get User Metrics Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.checkInsRepository = new InMemoryCheckInsRepository()

        context.sut = new GetUserMetricsUseCase(context.checkInsRepository)
    })

    it('should be able to get check-ins count from netrics', async ({
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

        const { checkInsCount } = await sut.execute({ userId })

        expect(checkInsCount).toEqual(22)
    })
})
