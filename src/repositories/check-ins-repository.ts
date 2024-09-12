export type CheckIn = {
    id?: string
    created_at?: Date | string
    validated_at?: Date | string | null
    user_id: string
    gym_id: string
}

export type CheckInInput = {
    user_id: string
    gym_id: string
    validated_at?: Date | string | null
}

export interface CheckInsRepository {
    create(data: CheckInInput): Promise<CheckIn>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findManyUserId(userId: string, page: number): Promise<CheckIn[]>
    countByUserID(userId: string): Promise<number>
}
