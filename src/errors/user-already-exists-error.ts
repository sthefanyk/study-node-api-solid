export class UserAlreadyExistsError extends Error {
    constructor(mensage: string = 'E-mail already exists.') {
        super(mensage)
    }
}
