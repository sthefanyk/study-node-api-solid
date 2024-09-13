export class LateCheckInValidationsError extends Error {
    constructor(
        mensage: string = 'The check-in can only be validated until 20 minutes of its creation.',
    ) {
        super(mensage)
    }
}
