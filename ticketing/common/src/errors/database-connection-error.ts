import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {

    statusCode = 500;
    reason = '无法连接数据库';

    constructor() {
        super('无法连接到数据库');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ];
    }
}