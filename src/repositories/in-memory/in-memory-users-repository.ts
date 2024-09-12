import { randomUUID } from 'node:crypto'
import { User, UserInput, UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async create(data: UserInput): Promise<User> {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
        }

        this.items.push(user)

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find((item) => item.email === email)
        return !user ? null : user
    }

    async findById(id: string): Promise<User | null> {
        const user = this.items.find((item) => item.id === id)
        return !user ? null : user
    }
}
