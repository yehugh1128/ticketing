import { CustomError } from "./custom-error"

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public error: {message:string, field?:string}) {
        super(error.message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.error.message, field:this.error.field }];
    }
    
}