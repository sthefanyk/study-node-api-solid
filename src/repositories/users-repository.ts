export type User = {
    id: string
    name: string
    email: string
    password_hash: string
    created_at: Date
}

export type UserInput = {
    name: string
    email: string
    password_hash: string
}

export interface UsersRepository {
    create(data: UserInput): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
}
