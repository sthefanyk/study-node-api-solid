import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { User, UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
    async findByEmail(email: string): Promise<User | null> {
        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        return userWithSameEmail
    }

    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data,
        })

        return user
    }
}
