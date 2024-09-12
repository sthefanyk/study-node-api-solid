export class ResourceNotFoundError extends Error {
    constructor(mensage: string = 'Resource not found.') {
        super(mensage)
    }
}
