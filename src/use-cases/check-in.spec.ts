import {
    it,
    describe,
    expect,
    beforeEach,
    TestContext,
    vi,
    afterEach,
} from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { Gym } from '@/repositories/gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/errors/max-distance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

interface TestContextWithSut extends TestContext {
    gymsRepository: InMemoryGymsRepository
    checkInsRepository: InMemoryCheckInsRepository
    createGymUseCase: CreateGymUseCase
    gym: Gym
    sut: CheckInUseCase
}

describe('Check-in Use Case', () => {
    beforeEach(async (context: TestContextWithSut) => {
        context.gymsRepository = new InMemoryGymsRepository()
        context.checkInsRepository = new InMemoryCheckInsRepository()

        context.sut = new CheckInUseCase(
            context.checkInsRepository,
            context.gymsRepository,
        )

        context.gym = await context.gymsRepository.create({
            title: 'gym',
            latitude: new Decimal(-25.5777838),
            longitude: new Decimal(-48.5767553),
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async ({
        sut,
        gym,
    }: TestContextWithSut) => {
        const { checkIn } = await sut.execute({
            gym_id: gym.id,
            user_id: randomUUID(),
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in if the gym ID is invalid', async ({
        sut,
    }: TestContextWithSut) => {
        await expect(() =>
            sut.execute({
                gym_id: 'Fake ID',
                user_id: 'user-01',
                userLatitude: -25.5777838,
                userLongitude: -48.5767553,
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should be able to check in with validated at date', async ({
        sut,
        gym,
    }: TestContextWithSut) => {
        const validated_at = new Date()
        const { checkIn } = await sut.execute({
            gym_id: gym.id,
            user_id: randomUUID(),
            validated_at,
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        expect(checkIn.validated_at).toEqual(validated_at)
    })

    it('should be able to check in with validated at string', async ({
        sut,
        gym,
    }: TestContextWithSut) => {
        const validated_at = '12/09/2024'
        const { checkIn } = await sut.execute({
            gym_id: gym.id,
            user_id: randomUUID(),
            validated_at,
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        expect(checkIn.validated_at).toEqual(new Date(validated_at))
    })

    it('should not be able to check in twice in the same day', async ({
        sut,
        gym,
    }: TestContextWithSut) => {
        vi.setSystemTime(new Date(2024, 1, 27, 10, 0, 0))
        await sut.execute({
            gym_id: gym.id,
            user_id: 'user-01',
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        await expect(() =>
            sut.execute({
                gym_id: gym.id,
                user_id: 'user-01',
                userLatitude: -25.5777838,
                userLongitude: -48.5767553,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice in the same daybut and different days', async ({
        sut,
        gym,
    }: TestContextWithSut) => {
        vi.setSystemTime(new Date(2024, 1, 27, 10, 0, 0))
        await sut.execute({
            gym_id: gym.id,
            user_id: 'user-01',
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        vi.setSystemTime(new Date(2024, 1, 28, 10, 0, 0))

        const { checkIn } = await sut.execute({
            gym_id: gym.id,
            user_id: 'user-01',
            userLatitude: -25.5777838,
            userLongitude: -48.5767553,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async ({
        sut,
        gymsRepository,
    }: TestContextWithSut) => {
        const gym = await gymsRepository.create({
            title: 'gym',
            latitude: new Decimal(-25.512749),
            longitude: new Decimal(-48.513211),
        })

        await expect(() =>
            sut.execute({
                gym_id: gym.id,
                user_id: randomUUID(),
                userLatitude: -25.5777838,
                userLongitude: -48.5767553,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})
