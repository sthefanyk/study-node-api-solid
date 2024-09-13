import {
    it,
    describe,
    expect,
    beforeEach,
    TestContext,
    afterEach,
    vi,
} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'
import { LateCheckInValidationsError } from '@/errors/late-check-in-validation-error'

interface TestContextWithSut extends TestContext {
    checkInsRepository: InMemoryCheckInsRepository
    sut: ValidateCheckInUseCase
}

describe('Vaalidate Check-in Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.checkInsRepository = new InMemoryCheckInsRepository()
        context.sut = new ValidateCheckInUseCase(context.checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate check in', async ({
        sut,
        checkInsRepository,
    }: TestContextWithSut) => {
        const checkInCreated = await checkInsRepository.create({
            gym_id: randomUUID(),
            user_id: randomUUID(),
        })

        const { checkIn } = await sut.execute({ checkInId: checkInCreated.id! })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(
            expect.any(Date),
        )
    })

    it('should be able to validate in inexisted check in', async ({
        sut,
    }: TestContextWithSut) => {
        await expect(() =>
            sut.execute({
                checkInId: 'inexistent-check-in-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should be able to validate the check-in after 20 minutes of its creation', async ({
        sut,
        checkInsRepository,
    }: TestContextWithSut) => {
        vi.setSystemTime(new Date(2024, 1, 27, 13, 40))

        const createdCheckin = await checkInsRepository.create({
            gym_id: 'gym_01',
            user_id: 'user_01',
        })

        const twentyOneMinutesMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesMs)

        await expect(() =>
            sut.execute({
                checkInId: createdCheckin.id!,
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidationsError)
    })
})
