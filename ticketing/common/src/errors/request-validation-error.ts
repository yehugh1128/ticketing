import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
export class ReqeustValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('请求参数错误');
        //因为我们正在扩展一个内置类，所以加上这一行
        Object.setPrototypeOf(this, ReqeustValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(err => {
            return {
                message: err.msg,
                field: err.type === 'field' ? err.path : ''
            }
        });
    }
}