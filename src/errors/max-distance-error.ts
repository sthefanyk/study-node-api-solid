export class MaxDistanceError extends Error {
    constructor(mensage: string = 'Max distance reached.') {
        super(mensage)
    }
}
