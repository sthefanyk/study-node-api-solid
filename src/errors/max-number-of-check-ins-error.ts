export class MaxNumberOfCheckInsError extends Error {
    constructor(mensage: string = 'Max number of check-ins reached.') {
        super(mensage)
    }
}
