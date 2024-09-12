export class InavalidCredentialsError extends Error {
    constructor(mensage: string = 'Invalid credentials.') {
        super(mensage)
    }
}
